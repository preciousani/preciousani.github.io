// Command palette: ⌘K / Ctrl+K / "/" to open. Sections, posts, links and actions.
document.addEventListener('DOMContentLoaded', () => {
    const palette = document.getElementById('cmdk');
    const input = document.getElementById('cmdk-input');
    const list = document.getElementById('cmdk-list');
    const dataEl = document.getElementById('cmdk-data');
    if (!palette || !input || !list || !dataEl) return;

    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    document.querySelectorAll('[data-mod-key]').forEach(k => { k.textContent = isMac ? '⌘K' : 'Ctrl K'; });

    let data = {};
    try { data = JSON.parse(dataEl.textContent); } catch (e) {}
    const home = data.home || '#';
    const go = (url) => () => { window.location.href = url; };

    const sections = [
        ['whoami', 'about'], ['focus areas', 'focus'], ['featured work', 'work'], ['latest writing', 'writing'],
        ['speaking & events', 'speaking'], ['tutorials', 'content'], ['community', 'community'],
        ['credentials', 'credentials'], ['contact', 'contact']
    ];

    const commands = [
        ...sections.map(([label, id], i) => ({
            group: 'Navigate', icon: String(i + 1).padStart(2, '0'), label: `Go to ${label}`, hint: `#${id}`, run: go(home + id)
        })),
        ...(data.posts || []).map(p => ({ group: 'Writing', icon: '¶', label: p.title, hint: p.date, run: go(p.url) })),
        { group: 'Writing', icon: '≡', label: 'All posts', hint: '/blog', run: go(data.blog || '/blog/') },
        { group: 'Writing', icon: '◉', label: 'RSS feed', hint: 'feed.xml', run: go(data.feed || '/feed.xml') },
        {
            group: 'Actions', icon: '◐', label: 'Toggle light / dark theme', hint: 'theme',
            run: () => window.toggleTheme && window.toggleTheme()
        },
        {
            group: 'Actions', icon: '@', label: 'Copy email address', hint: data.email,
            run: () => navigator.clipboard && navigator.clipboard.writeText(data.email)
        },
        {
            group: 'Actions', icon: '⚡', label: 'Hack the bot', hint: 'play',
            run: () => { if (!(window.focusBot && window.focusBot())) window.location.href = home + 'hackthebot'; }
        },
        ...[
            ['GitHub', 'https://github.com/DroidPrezzo'],
            ['LinkedIn', 'https://linkedin.com/in/pfemisani'],
            ['Medium', 'https://poluwafemisani.medium.com/'],
            ['YouTube', 'https://youtube.com/@CodewithPrecious'],
            ['X / Twitter', 'https://x.com/pfemis']
        ].map(([label, url]) => ({
            group: 'Links', icon: '↗', label, hint: new URL(url).hostname.replace('www.', ''),
            run: () => window.open(url, '_blank', 'noopener')
        }))
    ];

    // Subsequence fuzzy match; lower score is better
    const score = (text, query) => {
        if (!query) return 0;
        text = text.toLowerCase();
        const direct = text.indexOf(query);
        if (direct !== -1) return direct;
        let ti = 0, gaps = 0;
        for (const ch of query) {
            const found = text.indexOf(ch, ti);
            if (found === -1) return Infinity;
            gaps += found - ti;
            ti = found + 1;
        }
        return 100 + gaps;
    };

    let results = [], active = 0, lastFocus = null;

    const render = () => {
        const q = input.value.trim().toLowerCase();
        results = commands
            .map(c => ({ c, s: Math.min(score(c.label, q), score(`${c.group} ${c.hint || ''}`, q) + 50) }))
            .filter(r => r.s !== Infinity)
            .sort((a, b) => (q ? a.s - b.s : 0))
            .map(r => r.c);
        active = Math.min(active, Math.max(0, results.length - 1));

        list.innerHTML = '';
        if (!results.length) {
            list.innerHTML = '<li class="cmdk-empty">No matches. Try "blog", "theme" or "bot".</li>';
            return;
        }
        let group = null;
        results.forEach((c, i) => {
            if (!q && c.group !== group) {
                group = c.group;
                const g = document.createElement('li');
                g.className = 'cmdk-group';
                g.setAttribute('role', 'presentation');
                g.textContent = group;
                list.appendChild(g);
            }
            const li = document.createElement('li');
            li.className = 'cmdk-item';
            li.id = `cmdk-item-${i}`;
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', i === active);
            const icon = document.createElement('span');
            icon.className = 'icon';
            icon.textContent = c.icon;
            const label = document.createElement('span');
            label.textContent = c.label;
            const hint = document.createElement('span');
            hint.className = 'hint';
            hint.textContent = c.hint || '';
            li.append(icon, label, hint);
            li.addEventListener('pointermove', () => { if (active !== i) { active = i; highlight(); } });
            li.addEventListener('click', () => execute(i));
            list.appendChild(li);
        });
        input.setAttribute('aria-activedescendant', `cmdk-item-${active}`);
    };

    const highlight = () => {
        list.querySelectorAll('.cmdk-item').forEach((el) => {
            const selected = el.id === `cmdk-item-${active}`;
            el.setAttribute('aria-selected', selected);
            if (selected) el.scrollIntoView({ block: 'nearest' });
        });
        input.setAttribute('aria-activedescendant', `cmdk-item-${active}`);
    };

    const open = () => {
        lastFocus = document.activeElement;
        palette.hidden = false;
        input.value = '';
        active = 0;
        render();
        input.focus();
        document.body.style.overflow = 'hidden';
    };

    const close = () => {
        palette.hidden = true;
        document.body.style.overflow = '';
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };

    const execute = (i) => {
        const cmd = results[i];
        if (!cmd) return;
        close();
        cmd.run();
    };

    input.addEventListener('input', () => { active = 0; render(); });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % results.length; highlight(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + results.length) % results.length; highlight(); }
        else if (e.key === 'Enter') { e.preventDefault(); execute(active); }
        else if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'Tab') { e.preventDefault(); }
    });

    document.addEventListener('keydown', (e) => {
        const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            palette.hidden ? open() : close();
        } else if (e.key === '/' && !typing && palette.hidden) {
            e.preventDefault();
            open();
        }
    });

    document.querySelectorAll('[data-cmdk-open]').forEach(b => b.addEventListener('click', open));
    palette.querySelectorAll('[data-cmdk-close]').forEach(b => b.addEventListener('click', close));
});
