import { useCallback } from "react";

export function useConfetti() {
  const fire = useCallback((options = {}) => {
    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#10b981", "#34d399", "#f59e0b", "#a78bfa"];
    const count = options.count ?? 120;

    const particles = Array.from({ length: count }, () => ({
      x: (options.x ?? 0.5) * canvas.width,
      y: (options.y ?? 0.2) * canvas.height,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 7 + 4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      gravity: 0.35,
      opacity: 1,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));

    let frame;
    let age = 0;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      age++;

      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.opacity = Math.max(0, 1 - age / 120);

        if (p.y < canvas.height + 20) alive = true;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      }

      if (alive && age < 150) {
        frame = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(frame);
        canvas.remove();
      }
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      canvas.remove();
    };
  }, []);

  return { fire };
}