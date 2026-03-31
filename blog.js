/* ── Typewriter subtitle ── */
(function initTypedSubtitle() {
    const phrases = [
        'Writing weekly about whatever I want.',
        'Emacs, language learning & life.',
        'A corner of the internet that is mine.',
    ];
    const el = document.getElementById('typed-subtitle');
    if (!el) return;

    // Structure: el → [textNode, cursorSpan]
    const textNode = document.createTextNode('');
    const cursor   = document.createElement('span');
    cursor.className = 'cursor';
    el.textContent = '';
    el.appendChild(textNode);
    el.appendChild(cursor);

    let pi = 0, ci = 0, deleting = false;

    function tick() {
        const phrase = phrases[pi];
        if (!deleting) {
            textNode.textContent = phrase.slice(0, ci);
            ci++;
            if (ci > phrase.length) { deleting = true; setTimeout(tick, 1600); return; }
        } else {
            textNode.textContent = phrase.slice(0, ci);
            ci--;
            if (ci < 0) {
                deleting = false;
                pi = (pi + 1) % phrases.length;
                ci = 0;
                setTimeout(tick, 400);
                return;
            }
        }
        setTimeout(tick, deleting ? 45 : 70);
    }

    setTimeout(tick, 500);
}());

/* ── Theme toggle ── */
(function initTheme() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    btn.textContent = saved === 'dark' ? '☀️' : '🌙';

    btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        btn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
}());

/* ── Particle canvas background ── */
(function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, dots;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function makeDot() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 2 + 1,
            vx: (Math.random() - .5) * .35,
            vy: (Math.random() - .5) * .35,
        };
    }

    function init() {
        resize();
        // ~1 dot per 14 000 px², capped at 80 to keep line-drawing O(n²) fast
        const count = Math.min(Math.floor(W * H / 14000), 80);
        dots = Array.from({ length: count }, makeDot);
    }

    function getAccentColor() {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--accent').trim() || '#4361ee';
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        const accent = getAccentColor();

        dots.forEach(d => {
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < -5) d.x = W + 5;
            if (d.x > W + 5) d.x = -5;
            if (d.y < -5) d.y = H + 5;
            if (d.y > H + 5) d.y = -5;

            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = accent;
            ctx.globalAlpha = .25;
            ctx.fill();
        });

        // Draw lines between nearby dots
        ctx.globalAlpha = .08;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1;
        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x;
                const dy = dots[i].y - dots[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.globalAlpha = .08 * (1 - dist / 120);
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', init);
    init();
    draw();
}());

/* ── Render blog entries with staggered entrance animations ── */
function renderBlogList() {
    const blogList = document.getElementById('blog-list');
    if (!blogList) return;

    [...blogEntries].reverse().forEach((entry, i) => {
        const li   = document.createElement('li');
        const link = document.createElement('a');
        link.href  = entry.file;

        const dateSpan  = document.createElement('span');
        dateSpan.className   = 'entry-date';
        dateSpan.textContent = entry.date;

        const titleSpan  = document.createElement('span');
        titleSpan.className   = 'entry-title';
        titleSpan.textContent = entry.title;

        link.appendChild(dateSpan);
        link.appendChild(titleSpan);
        li.appendChild(link);
        blogList.appendChild(li);

        // Staggered reveal: each card slides in after a short delay
        setTimeout(() => li.classList.add('visible'), 120 + i * 90);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderBlogList);
} else {
    renderBlogList();
}

