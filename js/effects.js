// Visual effects layer. Everything here is progressive enhancement:
// the page is complete without it, and reduced-motion users get static output.
document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const root = document.documentElement;
    const cssVar = (name) => getComputedStyle(root).getPropertyValue(name).trim();

    // ------------------------------------------------------------------
    // Ambient "attack graph": drifting nodes, red probes travelling along
    // edges, green rings where a probe gets blocked. Reacts to the cursor.
    // ------------------------------------------------------------------
    const canvas = document.getElementById('ambient');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const pointer = { x: -9999, y: -9999 };
        let nodes = [], probes = [], rings = [];
        let w = 0, h = 0, dpr = 1, raf = 0, lastProbe = 0;
        let colors = {};
        const LINK = 150;

        const readColors = () => {
            const light = root.getAttribute('data-theme') === 'light';
            colors = {
                node: light ? 'rgba(10, 127, 176, 0.45)' : 'rgba(76, 201, 240, 0.55)',
                link: light ? '10, 127, 176' : '76, 201, 240',
                hot: cssVar('--color-primary') || '#2ee6a8',
                probe: light ? '#d43d3d' : '#ff6b6b',
                ring: light ? '10, 155, 110' : '46, 230, 168'
            };
        };

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.min(220, Math.max(24, Math.floor((w * h) / 15000)));
            nodes = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() * 1.4 + 0.6
            }));
            probes = [];
            rings = [];
        };

        const neighbours = (a) => nodes.filter(b => b !== a && Math.hypot(a.x - b.x, a.y - b.y) < LINK);

        const spawnProbe = () => {
            const from = nodes[Math.floor(Math.random() * nodes.length)];
            const options = neighbours(from);
            if (!options.length) return;
            const to = options[Math.floor(Math.random() * options.length)];
            probes.push({ from, to, t: 0, speed: 0.012 + Math.random() * 0.01 });
        };

        const draw = (time) => {
            ctx.clearRect(0, 0, w, h);

            for (const n of nodes) {
                if (!reduceMotion) {
                    n.x += n.vx;
                    n.y += n.vy;
                    if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
                    if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
                }
            }

            // Links
            ctx.lineWidth = 1;
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const b = nodes[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d > LINK) continue;
                    ctx.strokeStyle = `rgba(${colors.link}, ${(1 - d / LINK) * 0.22})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            // Nodes (+ cursor connections)
            for (const n of nodes) {
                const pd = Math.hypot(n.x - pointer.x, n.y - pointer.y);
                const near = pd < 200;
                if (near) {
                    ctx.strokeStyle = colors.hot;
                    ctx.globalAlpha = (1 - pd / 200) * 0.6;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(pointer.x, pointer.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
                ctx.fillStyle = near ? colors.hot : colors.node;
                ctx.beginPath();
                ctx.arc(n.x, n.y, near ? n.r + 1 : n.r, 0, Math.PI * 2);
                ctx.fill();
            }

            if (!reduceMotion) {
                // Probes travel an edge; on arrival they're "blocked"
                if (time - lastProbe > 700 && probes.length < 8) {
                    spawnProbe();
                    lastProbe = time;
                }
                probes = probes.filter(p => {
                    p.t += p.speed;
                    const x = p.from.x + (p.to.x - p.from.x) * p.t;
                    const y = p.from.y + (p.to.y - p.from.y) * p.t;
                    ctx.fillStyle = colors.probe;
                    ctx.shadowColor = colors.probe;
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    if (p.t >= 1) {
                        rings.push({ x: p.to.x, y: p.to.y, r: 2, a: 0.8 });
                        return false;
                    }
                    return true;
                });
                rings = rings.filter(r => {
                    r.r += 0.6;
                    r.a -= 0.016;
                    ctx.strokeStyle = `rgba(${colors.ring}, ${Math.max(0, r.a)})`;
                    ctx.beginPath();
                    ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
                    ctx.stroke();
                    return r.a > 0;
                });
            }
        };

        const loop = (time) => {
            draw(time);
            raf = requestAnimationFrame(loop);
        };

        const start = () => {
            cancelAnimationFrame(raf);
            if (reduceMotion) draw(0);
            else raf = requestAnimationFrame(loop);
        };

        readColors();
        resize();
        start();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => { resize(); start(); }, 150);
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(raf);
            else start();
        });
        document.addEventListener('themechange', () => { readColors(); if (reduceMotion) draw(0); });
        if (finePointer) {
            window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
            document.addEventListener('pointerleave', () => { pointer.x = pointer.y = -9999; });
        }
    }

    // ------------------------------------------------------------------
    // Cursor spotlight + card border glow
    // ------------------------------------------------------------------
    if (finePointer) {
        const spotlight = document.querySelector('.spotlight');
        let frame = 0, lastEvent = null;
        window.addEventListener('pointermove', (e) => {
            lastEvent = e;
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                if (spotlight) {
                    spotlight.style.setProperty('--sx', `${lastEvent.clientX}px`);
                    spotlight.style.setProperty('--sy', `${lastEvent.clientY}px`);
                }
                const card = lastEvent.target.closest && lastEvent.target.closest('.card');
                if (card) {
                    const r = card.getBoundingClientRect();
                    card.style.setProperty('--mx', `${lastEvent.clientX - r.left}px`);
                    card.style.setProperty('--my', `${lastEvent.clientY - r.top}px`);
                }
            });
        }, { passive: true });
    }

    // ------------------------------------------------------------------
    // Text decode / scramble on headings
    // ------------------------------------------------------------------
    const GLYPHS = '!<>-_\\/[]{}=+*^?#01';
    const scramble = (el) => {
        const final = el.textContent;
        const queue = [...final].map((ch, i) => ({
            ch,
            start: Math.floor(Math.random() * 12) + i * 0.6,
            end: Math.floor(Math.random() * 12) + 14 + i * 0.6
        }));
        let frameNo = 0;
        el.setAttribute('aria-label', final);
        const tick = () => {
            let out = '', done = 0;
            for (const q of queue) {
                if (q.ch === ' ' || frameNo >= q.end) { out += q.ch === '&' ? '&amp;' : q.ch; done++; }
                else if (frameNo >= q.start) out += `<span class="scramble-char" aria-hidden="true">${GLYPHS[Math.floor(Math.random() * GLYPHS.length)]}</span>`;
                else out += `<span aria-hidden="true" style="opacity:0">${q.ch === '<' ? '&lt;' : q.ch}</span>`;
            }
            el.innerHTML = out;
            if (done < queue.length) { frameNo++; requestAnimationFrame(tick); }
            else { el.textContent = final; el.removeAttribute('aria-label'); }
        };
        tick();
    };

    if (!reduceMotion && 'IntersectionObserver' in window) {
        const scrambleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                scrambleObserver.unobserve(entry.target);
                scramble(entry.target);
            });
        }, { threshold: 0.6 });
        document.querySelectorAll('[data-scramble]').forEach(el => scrambleObserver.observe(el));
    }

    // ------------------------------------------------------------------
    // Status-line typer
    // ------------------------------------------------------------------
    const typer = document.querySelector('[data-typer]');
    if (typer && !reduceMotion) {
        let phrases = [];
        try { phrases = JSON.parse(typer.dataset.typer); } catch (e) {}
        let p = 0, i = phrases[0] ? phrases[0].length : 0, deleting = true;
        const step = () => {
            const phrase = phrases[p];
            typer.textContent = phrase.slice(0, i);
            let delay = deleting ? 35 : 70;
            if (deleting && i === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 300; }
            else if (!deleting && i === phrases[p].length) { deleting = true; delay = 2600; }
            i += deleting ? -1 : 1;
            setTimeout(step, delay);
        };
        if (phrases.length > 1) setTimeout(step, 3200);
    }

    // ------------------------------------------------------------------
    // Count-up stats
    // ------------------------------------------------------------------
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
        const fmt = new Intl.NumberFormat('en-US');
        const render = (el, v) => { el.textContent = `${el.dataset.prefix || ''}${fmt.format(v)}${el.dataset.suffix || ''}`; };
        counters.forEach(el => render(el, 0));
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                countObserver.unobserve(entry.target);
                const el = entry.target, target = Number(el.dataset.count), t0 = performance.now();
                const tick = (now) => {
                    const k = Math.min(1, (now - t0) / 1400);
                    render(el, Math.round(target * (1 - Math.pow(1 - k, 3))));
                    if (k < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            });
        }, { threshold: 0.5 });
        counters.forEach(el => countObserver.observe(el));
    }

    // ------------------------------------------------------------------
    // Headshot: biometric scan on load, 3D tilt on hover
    // ------------------------------------------------------------------
    const frame = document.querySelector('.hero-image .frame');
    const frameLabel = document.getElementById('frame-label');
    if (frame && frameLabel && !reduceMotion) {
        const img = frame.querySelector('img');
        const runScan = () => {
            frame.style.setProperty('--scan-h', `${img.offsetHeight}px`);
            frameLabel.textContent = 'scanning…';
            frame.classList.add('scanning');
            setTimeout(() => {
                frameLabel.textContent = 'id: pfemis // verified ✓';
                frameLabel.classList.add('verified');
                setTimeout(() => { frameLabel.classList.remove('verified'); frameLabel.textContent = 'id: pfemis // ai-sec'; }, 2200);
            }, 1800);
        };
        if (img.complete) setTimeout(runScan, 500); else img.addEventListener('load', () => setTimeout(runScan, 500));
    }

    const tilt = document.querySelector('.tilt');
    if (tilt && finePointer && !reduceMotion) {
        tilt.addEventListener('pointermove', (e) => {
            const r = tilt.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            tilt.style.setProperty('--ry', `${x * 10}deg`);
            tilt.style.setProperty('--rx', `${-y * 10}deg`);
        });
        tilt.addEventListener('pointerleave', () => {
            tilt.style.setProperty('--ry', '0deg');
            tilt.style.setProperty('--rx', '0deg');
        });
    }

    // ------------------------------------------------------------------
    // Hero terminal: an illustrative OWASP LLM red-team run, looped
    // ------------------------------------------------------------------
    const term = document.getElementById('hero-term');
    if (term && getComputedStyle(term.parentElement).display !== 'none') {
        const script = [
            ['cmd', '$ redteam run --suite owasp-llm-top10 --target demo-bot'],
            ['dim', '  loading probes: pyrit, garak …'],
            ['row', 'LLM01 prompt_injection.roleplay', 'vuln'],
            ['row', 'LLM01 prompt_injection.yoruba', 'vuln'],
            ['row', 'LLM02 sensitive_info_disclosure', 'ok'],
            ['row', 'LLM06 excessive_agency.tool_call', 'ok'],
            ['row', 'LLM07 system_prompt_leakage', 'vuln'],
            ['info', '→ applying layered defense pipeline …'],
            ['cmd', '$ redteam rerun --failed'],
            ['row', 'LLM01 prompt_injection.*', 'ok'],
            ['row', 'LLM07 system_prompt_leakage', 'ok'],
            ['ok', '✓ 0 critical findings remaining']
        ];
        const pad = (s) => s + ' ' + '.'.repeat(Math.max(2, 36 - s.length)) + ' ';
        const lineHTML = ([kind, text, result]) => {
            if (kind === 'row') {
                const tag = result === 'vuln' ? '<span class="t-vuln">VULNERABLE</span>' : '<span class="t-ok">BLOCKED</span>';
                return `<span class="t-dim">${pad(text)}</span>${tag}`;
            }
            return `<span class="t-${kind}">${text}</span>`;
        };

        if (reduceMotion) {
            term.innerHTML = script.map(lineHTML).join('\n');
        } else {
            let lines = [], idx = 0;
            const render = (partial) => {
                const shown = lines.slice(-10);
                term.innerHTML = shown.join('\n') + (partial !== undefined ? (shown.length ? '\n' : '') + partial : '') + '<span class="caret"></span>';
            };
            const typeCommand = (text, done) => {
                let i = 0;
                const tick = () => {
                    render(`<span class="t-cmd">${text.slice(0, i)}</span>`);
                    if (i++ < text.length) setTimeout(tick, 28);
                    else done();
                };
                tick();
            };
            const next = () => {
                if (idx >= script.length) {
                    setTimeout(() => { lines = []; idx = 0; next(); }, 4000);
                    return;
                }
                const item = script[idx++];
                if (item[0] === 'cmd') {
                    typeCommand(item[1], () => { lines.push(lineHTML(item)); render(); setTimeout(next, 450); });
                } else {
                    lines.push(lineHTML(item));
                    render();
                    setTimeout(next, item[0] === 'row' ? 380 : 650);
                }
            };
            setTimeout(next, 900);
        }
    }

    // ------------------------------------------------------------------
    // Magnetic buttons
    // ------------------------------------------------------------------
    if (finePointer && !reduceMotion) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('pointermove', (e) => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
            });
            btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
        });
    }

    // ------------------------------------------------------------------
    // Lightbox for gallery / event images
    // ------------------------------------------------------------------
    const lightbox = document.getElementById('lightbox');
    if (lightbox && typeof lightbox.showModal === 'function') {
        const img = document.getElementById('lightbox-img');
        const caption = document.getElementById('lightbox-caption');
        let group = [], index = 0;

        const show = (i) => {
            index = (i + group.length) % group.length;
            const item = group[index];
            img.src = item.dataset.src;
            img.alt = item.querySelector('img') ? item.querySelector('img').alt : '';
            caption.textContent = `${item.dataset.caption || ''}  ·  ${index + 1}/${group.length}`;
        };

        document.querySelectorAll('[data-lightbox]').forEach(trigger => {
            trigger.addEventListener('click', () => {
                group = [...document.querySelectorAll(`[data-lightbox="${trigger.dataset.lightbox}"]`)];
                show(group.indexOf(trigger));
                lightbox.showModal();
            });
        });

        lightbox.querySelector('[data-lightbox-close]').addEventListener('click', () => lightbox.close());
        lightbox.querySelector('[data-lightbox-prev]').addEventListener('click', () => show(index - 1));
        lightbox.querySelector('[data-lightbox-next]').addEventListener('click', () => show(index + 1));
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
        lightbox.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') show(index - 1);
            if (e.key === 'ArrowRight') show(index + 1);
        });
    }
});
