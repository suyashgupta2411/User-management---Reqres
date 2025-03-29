import { useEffect, useRef } from "react";

interface PlexusBackgroundProps {
  children: React.ReactNode;
  dotColor?: string;
  lineColor?: string;
  dotDensity?: number;
  connectionDistance?: number;
}

const AnimatedBackground: React.FC<PlexusBackgroundProps> = ({
  children,
  dotColor = "255, 255, 255",
  lineColor = "255, 255, 255",
  dotDensity = 1,
  connectionDistance = 100,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas to full screen with device pixel ratio for sharper rendering
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    // Handle resize
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Particles setup
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }

    // Create particles - smaller and more numerous
    const particles: Particle[] = [];
    const baseParticleCount = Math.floor(
      (window.innerWidth * window.innerHeight) / 15000
    );
    const particleCount = Math.floor(baseParticleCount * dotDensity);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3, // Slower movement
        vy: (Math.random() - 0.5) * 0.3,
        size: 0.5 + Math.random() * 0.7, // Much smaller dots
      });
    }

    // Animation loop
    const animate = () => {
      // Clear canvas with slight opacity to create trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Boundary check with bounce
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.15; // Very faint lines
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
            ctx.lineWidth = 0.3;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw particle - much smaller and fainter
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor}, 0.4)`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [dotColor, lineColor, dotDensity, connectionDistance]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

export default AnimatedBackground;
