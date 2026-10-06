/* Strata — the signature visual. Hairline layers laid down bottom-first, like wealth accrued over decades.
   The top layer (the "upper crust") is drawn brightest. The cursor presses gently into the layers.
   Usage: <canvas data-strata="dark|light" data-lines="40" data-top="0.32"></canvas> */
(function () {
  var UC = window.UC;

  UC.register('strata', '[data-strata]', function (canvas) {
    var ctx = canvas.getContext('2d');
    var theme = canvas.dataset.strata || 'dark';
    var N = parseInt(canvas.dataset.lines || '40', 10);
    var topFrac = parseFloat(canvas.dataset.top || '0.3');
    var interactive = canvas.dataset.interactive !== 'false' && window.matchMedia('(hover:hover)').matches;
    var scrollLinked = canvas.dataset.scroll === 'true';
    var colors = theme === 'dark'
      ? { crust: [199, 168, 104], line: [199, 168, 104], aTop: 0.46, aBottom: 0.12 }
      : { crust: [145, 106, 46], line: [145, 106, 46], aTop: 0.5, aBottom: 0.16 };

    var W = 0, H = 0, dpr = 1, start = 0, visible = true, raf = 0;
    var mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, k: 0, tk: 0 };
    var seeds = [];
    for (var i = 0; i < N; i++) seeds.push({ p1: Math.random() * 6.28, p2: Math.random() * 6.28, a: 0.4 + Math.random() * 0.6 });

    function resize() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Base height of layer i: i=0 is the crust (top). Layers compress with depth.
    function baseY(i, squeeze) {
      var t = i / (N - 1);
      var depth = 1 - Math.pow(1 - t, 1.55);           // spacing tightens toward the bottom
      var top = H * topFrac + squeeze * H * 0.12;
      return top + depth * (H * 1.02 - top);
    }
    function fold(x, time) {
      return Math.sin(x * 0.0017 + 0.9 + time * 0.06) * H * 0.045 + Math.sin(x * 0.0043 + 2.1 - time * 0.04) * H * 0.014;
    }

    function draw(now) {
      var time = (now || 0) / 1000;
      var p = UC.reduced ? 1 : Math.min(1, (now - start) / 2600);
      var squeeze = 0;
      if (scrollLinked) squeeze = Math.max(0, Math.min(1, window.scrollY / Math.max(1, H)));
      mouse.x += (mouse.tx - mouse.x) * 0.08; mouse.y += (mouse.ty - mouse.y) * 0.08; mouse.k += (mouse.tk - mouse.k) * 0.06;

      ctx.clearRect(0, 0, W, H);
      var step = Math.max(6, W / 160);
      var rows = [];
      for (var i = 0; i < N; i++) {
        var t = i / (N - 1);
        // bottom layers are laid down first; the crust (i = 0) arrives last
        var lp = UC.reduced ? 1 : Math.max(0, Math.min(1, p * 1.8 - (1 - t) * 0.8));
        lp = 1 - Math.pow(1 - lp, 3);
        var y0 = baseY(i, squeeze), sd = seeds[i], amp = 1 - t * 0.55, pts = [];
        if (lp > 0) {
          var xEnd = W * lp;
          for (var x = 0; x <= xEnd + step; x += step) {
            var xx = Math.min(x, xEnd);
            var y = y0 + fold(xx, time) * amp + Math.sin(xx * 0.011 * sd.a + sd.p1 + time * 0.18) * 2.2 * sd.a + Math.sin(xx * 0.0026 + sd.p2) * H * 0.006;
            if (mouse.k > 0.001) {
              var dx = xx - mouse.x, dy = y0 - mouse.y;
              y += mouse.k * 26 * Math.exp(-(dx * dx) / (2 * 150 * 150)) * Math.exp(-(dy * dy) / (2 * 120 * 120));
            }
            pts.push(xx, y);
            if (xx >= xEnd) break;
          }
        }
        rows.push({ t: t, pts: pts });
      }
      // faint tonal bands every few layers, so the field reads as strata rather than lines
      for (var b = 0; b < N - 1; b++) {
        if (b % 5 !== 1) continue;
        var A = rows[b].pts, B = rows[b + 1].pts;
        if (A.length < 4 || B.length < 4) continue;
        ctx.beginPath(); ctx.moveTo(A[0], A[1]);
        for (var a = 2; a < A.length; a += 2) ctx.lineTo(A[a], A[a + 1]);
        for (var c = Math.min(B.length, A.length) - 2; c >= 0; c -= 2) ctx.lineTo(B[c], B[c + 1]);
        ctx.closePath();
        ctx.fillStyle = 'rgba(' + colors.line.join(',') + ',' + (theme === 'dark' ? 0.045 : 0.06) + ')';
        ctx.fill();
      }
      for (var r = N - 1; r >= 0; r--) {
        var P = rows[r].pts;
        if (P.length < 4) continue;
        ctx.beginPath(); ctx.moveTo(P[0], P[1]);
        for (var q = 2; q < P.length; q += 2) ctx.lineTo(P[q], P[q + 1]);
        if (r === 0) {
          ctx.strokeStyle = 'rgba(' + colors.crust.join(',') + ',.95)';
          ctx.lineWidth = 1.5;
        } else {
          var al = colors.aTop + (colors.aBottom - colors.aTop) * rows[r].t;
          ctx.strokeStyle = 'rgba(' + colors.line.join(',') + ',' + al.toFixed(3) + ')';
          ctx.lineWidth = r % 6 === 0 ? 1 : 0.6;
        }
        ctx.stroke();
      }
      if (!UC.reduced && visible) raf = requestAnimationFrame(draw);
    }

    function loop() { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }

    resize();
    start = performance.now();
    if (UC.reduced) draw(start); else loop();

    window.addEventListener('resize', function () {
      resize();
      if (UC.reduced || !visible) { var keep = visible; visible = false; draw(performance.now()); visible = keep; }
    });
    if ('IntersectionObserver' in window && !UC.reduced) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) loop(); }, { threshold: 0 }).observe(canvas);
    }
    if (interactive && !UC.reduced) {
      var host = canvas.parentElement;
      host.addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect();
        mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top; mouse.tk = 1;
        if (mouse.x < -999) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
      });
      host.addEventListener('pointerleave', function () { mouse.tk = 0; });
    }
  });
})();
