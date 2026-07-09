"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  phase: number;
  twinkleSpeed: number;
  colorType: "white" | "sky" | "purple";
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
}

interface Cloud {
  x: number;
  y: number;
  scale: number;
  speed: number;
  opacity: number;
}

interface Bird {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  flapPhase: number;
  flapSpeed: number;
}

export function SpaceBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    const shootingStars: ShootingStar[] = [];
    let clouds: Cloud[] = [];
    let birds: Bird[] = [];
    let sunPulsePhase = 0;
    
    const isDark = resolvedTheme === "dark";
    let lastWidth = 0;

    const resizeCanvas = () => {
      const currentWidth = window.innerWidth;
      canvas.width = currentWidth;
      canvas.height = window.innerHeight;
      
      if (currentWidth !== lastWidth) {
        lastWidth = currentWidth;
        if (isDark) {
          initStars();
        } else {
          initClouds();
          initBirds();
        }
      }
    };

    const initStars = () => {
      stars = [];
      const density = 100;
      const starCount = Math.floor((canvas.width * canvas.height) / 10000) * (density / 100);

      for (let i = 0; i < starCount; i++) {
        const size = Math.random() * 2 + 0.5;
        const colorRand = Math.random();
        
        let colorType: "white" | "sky" | "purple" = "white";
        if (colorRand > 0.85) colorType = "sky";
        else if (colorRand > 0.7) colorType = "purple";

        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          alpha: Math.random() * 0.8 + 0.2,
          phase: Math.random() * Math.PI,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          colorType,
        });
      }
    };

    const initClouds = () => {
      clouds = [];
      const count = 4;
      const isMobile = canvas.width < 768;
      for (let i = 0; i < count; i++) {
        clouds.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.45 + 60,
          scale: isMobile ? (Math.random() * 0.6 + 0.5) : (Math.random() * 1.4 + 1.0),
          speed: Math.random() * 0.2 + 0.08,
          opacity: Math.random() * 0.3 + 0.45,
        });
      }
    };

    const initBirds = () => {
      birds = [];
      const count = 3; // Flock of 3 birds in V-formation
      const isMobile = canvas.width < 768;
      
      const offsets = [
        { dx: 0, dy: 0 },
        { dx: isMobile ? -22 : -45, dy: isMobile ? 11 : 22 },
        { dx: isMobile ? -44 : -90, dy: isMobile ? 22 : 44 }
      ];
      
      const startX = isMobile ? -50 : -120; // Enter faster on mobile
      const startY = Math.random() * canvas.height * 0.2 + 80;
      const baseSpeed = Math.random() * 0.15 + 0.2;
      
      for (let i = 0; i < count; i++) {
        birds.push({
          x: startX + offsets[i].dx,
          y: startY + offsets[i].dy,
          size: isMobile ? (Math.random() * 1.5 + 4.5) : (Math.random() * 2 + 7),
          speedX: baseSpeed + (Math.random() * 0.04 - 0.02),
          speedY: (Math.random() * 0.04 - 0.02) - 0.02,
          flapPhase: Math.random() * Math.PI * 2,
          flapSpeed: Math.random() * 0.04 + 0.08
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isMobile = canvas.width < 768;

      if (isDark) {
        // --- DARK MODE: starry night space ---
        
        // 1. Draw Twinkling Stars
        stars.forEach((star) => {
          star.phase += star.twinkleSpeed;
          const twinkleFactor = 0.4 + Math.sin(star.phase) * 0.6;
          const currentAlpha = Math.max(0.1, star.alpha * twinkleFactor);

          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

          if (star.colorType === "sky") {
            ctx.fillStyle = `rgba(14, 165, 233, ${currentAlpha})`;
          } else if (star.colorType === "purple") {
            ctx.fillStyle = `rgba(168, 85, 247, ${currentAlpha})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
          }
          ctx.fill();
        });

        // 2. Draw Crescent Moon (responsive size & position)
        const moonX = isMobile ? canvas.width - 60 : canvas.width - 120;
        const moonY = isMobile ? 80 : 120;
        const moonRad = isMobile ? 18 : 32;
        const moonInnerRad = isMobile ? 15 : 28;
        const moonOffX = isMobile ? 6 : 10;
        const moonOffY = isMobile ? 3 : 6;
        
        ctx.beginPath();
        // Outer arc
        ctx.arc(moonX, moonY, moonRad, -Math.PI * 0.3, Math.PI * 0.7);
        // Inner arc (creates crescent shape)
        ctx.arc(moonX - moonOffX, moonY - moonOffY, moonInnerRad, Math.PI * 0.7, -Math.PI * 0.3, true);
        ctx.closePath();
        
        ctx.fillStyle = "rgba(241, 245, 249, 0.95)";
        ctx.shadowColor = "rgba(255, 255, 255, 0.45)";
        ctx.shadowBlur = isMobile ? 12 : 22;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset

        // 3. Draw and Update Shooting Stars
        if (Math.random() < 0.0012 && shootingStars.length < 2) {
          shootingStars.push({
            x: Math.random() * canvas.width * 0.6,
            y: Math.random() * canvas.height * 0.4,
            length: Math.random() * 80 + 40,
            speed: Math.random() * 4 + 3,
            angle: Math.PI / 6 + Math.random() * (Math.PI / 12),
            alpha: 1,
          });
        }

        shootingStars.forEach((star, index) => {
          const dx = Math.cos(star.angle) * star.speed;
          const dy = Math.sin(star.angle) * star.speed;
          star.x += dx;
          star.y += dy;
          star.alpha -= 0.015;

          if (star.alpha <= 0 || star.x > canvas.width || star.y > canvas.height) {
            shootingStars.splice(index, 1);
            return;
          }

          ctx.beginPath();
          const grad = ctx.createLinearGradient(
            star.x,
            star.y,
            star.x - dx * (star.length / star.speed),
            star.y - dy * (star.length / star.speed)
          );

          grad.addColorStop(0, `rgba(255, 255, 255, ${star.alpha})`);
          grad.addColorStop(0.2, `rgba(14, 165, 233, ${star.alpha * 0.6})`);
          grad.addColorStop(1, "rgba(14, 165, 233, 0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;

          ctx.moveTo(star.x, star.y);
          ctx.lineTo(
            star.x - dx * (star.length / star.speed),
            star.y - dy * (star.length / star.speed)
          );
          ctx.stroke();
        });
      } else {
        // --- LIGHT MODE: clear sky with sun, clouds & birds ---
        
        // 1. Draw Pulsing Sun (responsive size & position)
        const sunX = isMobile ? canvas.width - 60 : canvas.width - 120;
        const sunY = isMobile ? 80 : 120;
        const sunMaxRadius = isMobile ? 55 : 110;
        
        sunPulsePhase += 0.004; // slow radial pulse
        const sunPulse = 0.92 + Math.sin(sunPulsePhase) * 0.08;
        const currentRadius = sunMaxRadius * sunPulse;
        
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, currentRadius);
        sunGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        sunGrad.addColorStop(0.2, "rgba(254, 240, 138, 0.6)"); // yellow-100
        sunGrad.addColorStop(0.5, "rgba(253, 224, 71, 0.22)"); // yellow-300
        sunGrad.addColorStop(1, "rgba(253, 224, 71, 0)");
        
        ctx.beginPath();
        ctx.arc(sunX, sunY, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = sunGrad;
        ctx.fill();

        // 2. Draw and Update Drifting Clouds
        clouds.forEach((cloud) => {
          cloud.x += cloud.speed;
          if (cloud.x > canvas.width + 180) {
            cloud.x = -180;
            cloud.y = Math.random() * canvas.height * 0.45 + 60;
          }

          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
          ctx.shadowColor = "rgba(15, 23, 42, 0.08)";
          ctx.shadowBlur = isMobile ? 12 : 20;
          ctx.shadowOffsetY = isMobile ? 2 : 4;

          const r = 26 * cloud.scale;
          ctx.arc(cloud.x, cloud.y, r, 0, Math.PI * 2);
          ctx.arc(cloud.x + r * 0.7, cloud.y - r * 0.4, r * 0.8, 0, Math.PI * 2);
          ctx.arc(cloud.x + r * 1.4, cloud.y, r * 0.7, 0, Math.PI * 2);
          ctx.arc(cloud.x + r * 0.7, cloud.y + r * 0.3, r * 0.6, 0, Math.PI * 2);
          
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;
        });

        // 3. Draw and Update Drifting/Flapping Birds
        birds.forEach((bird) => {
          bird.x += bird.speedX;
          bird.y += bird.speedY;
          bird.flapPhase += bird.flapSpeed;
          
          if (bird.x > canvas.width + 180) {
            bird.x = isMobile ? -60 : -180;
            bird.y = Math.random() * canvas.height * 0.2 + 80;
          }
          
          ctx.beginPath();
          ctx.strokeStyle = "rgba(15, 23, 42, 0.12)";
          ctx.lineWidth = isMobile ? 1.0 : 1.5;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          
          const flap = Math.sin(bird.flapPhase) * bird.size * 0.45;
          
          ctx.moveTo(bird.x - bird.size, bird.y - flap);
          ctx.quadraticCurveTo(bird.x - bird.size * 0.5, bird.y - bird.size * 0.35, bird.x, bird.y);
          ctx.quadraticCurveTo(bird.x + bird.size * 0.5, bird.y - bird.size * 0.35, bird.x + bird.size, bird.y - flap);
          ctx.stroke();
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <div 
      className={cn(
        "relative min-h-screen w-full overflow-hidden transition-colors duration-500",
        "bg-gradient-to-b from-sky-300 via-sky-50 to-white dark:bg-none dark:bg-black",
        className
      )}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-sky-400/20 blur-[130px] dark:bg-sky-500/5 transition-opacity" />
        <div className="absolute top-[25%] -left-40 h-[600px] w-[600px] rounded-full bg-purple-400/10 blur-[130px] dark:bg-purple-500/5 transition-opacity" />
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">{children}</div>
    </div>
  );
}
