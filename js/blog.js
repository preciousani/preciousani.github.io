// Blog enhancements: post TOC + scrollspy, reading progress, code copy,
// heading anchors, and tag / text filtering on the blog index.
document.addEventListener('DOMContentLoaded', () => {
    const prose = document.querySelector('.prose');

    if (prose) {
        // Reading progress tied to the article body
        const bar = document.querySelector('.reading-progress span');
        const onScroll = () => {
            const r = prose.getBoundingClientRect();
            const total = r.height - window.innerHeight * 0.6;
            const k = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
            if (bar) bar.style.transform = `scaleX(${k})`;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // Table of contents from h2/h3
        const headings = [...prose.querySelectorAll('h2[id], h3[id]')];
        const toc = document.getElementById('toc');
        const tocAside = document.querySelector('.post-toc');
        if (toc && headings.length >= 2) {
            const ol = document.createElement('ol');
            headings.forEach(h => {
                const li = document.createElement('li');
                li.className = h.tagName === 'H3' ? 'toc-sub' : '';
                const a = document.createElement('a');
                a.href = `#${h.id}`;
                a.textContent = h.textContent;
                li.appendChild(a);
                ol.appendChild(li);
            });
            toc.appendChild(ol);

            const links = [...toc.querySelectorAll('a')];
            const spy = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    links.forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`));
                });
            }, { rootMargin: '-15% 0px -75% 0px' });
            headings.forEach(h => spy.observe(h));
        } else if (tocAside) {
            tocAside.classList.add('is-empty');
        }

        // Anchor links on headings
        headings.forEach(h => {
            const a = document.createElement('a');
            a.className = 'heading-anchor';
            a.href = `#${h.id}`;
            a.setAttribute('aria-label', `Link to ${h.textContent}`);
            a.textContent = '#';
            h.appendChild(a);
        });

        // Copy buttons on code blocks
        prose.querySelectorAll('pre').forEach(pre => {
            const wrap = pre.closest('div.highlighter-rouge') || pre;
            const lang = (wrap.className.match(/language-(\w+)/) || [])[1];
            const bar = document.createElement('div');
            bar.className = 'code-bar';
            bar.innerHTML = `<span>${lang || 'code'}</span>`;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = 'copy';
            btn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ''));
                    btn.textContent = 'copied ✓';
                } catch (e) {
                    btn.textContent = 'press ctrl+c';
                }
                setTimeout(() => { btn.textContent = 'copy'; }, 1600);
            });
            bar.appendChild(btn);
            wrap.parentNode.insertBefore(bar, wrap);
            bar.classList.add('attached');
        });

        // External links open in a new tab
        prose.querySelectorAll('a[href^="http"]').forEach(a => {
            if (!a.href.startsWith(window.location.origin)) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }
        });
    }

    // Blog index filtering
    const filterInput = document.getElementById('post-filter');
    const tagButtons = [...document.querySelectorAll('.tag-filter [data-tag]')];
    const posts = [...document.querySelectorAll('[data-post]')];
    if (posts.length && (filterInput || tagButtons.length)) {
        const empty = document.getElementById('post-empty');
        let activeTag = new URLSearchParams(window.location.search).get('tag') || '';

        const apply = () => {
            const q = (filterInput ? filterInput.value : '').trim().toLowerCase();
            let visible = 0;
            posts.forEach(p => {
                const tags = (p.dataset.tags || '').split(' ');
                const match = (!activeTag || tags.includes(activeTag)) && (!q || p.dataset.title.includes(q) || tags.some(t => t.includes(q)));
                p.hidden = !match;
                if (match && !p.classList.contains('post-feature')) visible++;
            });
            document.querySelectorAll('[data-year-group]').forEach(g => {
                g.hidden = ![...g.querySelectorAll('[data-post]')].some(p => !p.hidden);
            });
            tagButtons.forEach(b => b.classList.toggle('is-active', b.dataset.tag === activeTag));
            if (empty) empty.hidden = visible > 0;
        };

        tagButtons.forEach(b => b.addEventListener('click', () => {
            activeTag = b.dataset.tag === activeTag ? '' : b.dataset.tag;
            const url = new URL(window.location.href);
            if (activeTag) url.searchParams.set('tag', activeTag); else url.searchParams.delete('tag');
            history.replaceState(null, '', url);
            apply();
        }));
        if (filterInput) filterInput.addEventListener('input', apply);
        document.querySelectorAll('[data-clear-filter]').forEach(b => b.addEventListener('click', () => {
            activeTag = '';
            if (filterInput) filterInput.value = '';
            history.replaceState(null, '', window.location.pathname);
            apply();
        }));
        apply();
    }
});
