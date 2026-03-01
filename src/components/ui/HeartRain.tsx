"use client";

import { useEffect, useRef } from "react";

interface Heart {
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
    color: string;
    drift: number;
    rotation: number;
    rotationSpeed: number;
    shimmer: number;
    shimmerSpeed: number;
}

const ELEGANT_COLORS = [
    "rgba(180, 200, 230, VAL)",   // soft sapphire blue
    "rgba(210, 225, 245, VAL)",   // pearl blue
    "rgba(238, 228, 210, VAL)",   // champagne cream
    "rgba(200, 215, 240, VAL)",   // mist blue
    "rgba(220, 210, 230, VAL)",   // lavender pearl
    "rgba(255, 250, 240, VAL)",   // ivory white
];

function createHeart(canvasWidth: number, startFromTop = false): Heart {
    const colorTemplate = ELEGANT_COLORS[Math.floor(Math.random() * ELEGANT_COLORS.length)];
    const baseOpacity = 0.18 + Math.random() * 0.38;
    const color = colorTemplate.replace("VAL", baseOpacity.toFixed(2));

    return {
        x: Math.random() * canvasWidth,
        y: startFromTop ? -(Math.random() * 200) : -20 - Math.random() * 500,
        size: 8 + Math.random() * 18,
        speed: 0.6 + Math.random() * 1.2,
        opacity: baseOpacity,
        color,
        drift: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        shimmer: Math.random() * Math.PI * 2,
        shimmerSpeed: 0.02 + Math.random() * 0.03,
    };
}

function drawHeart(ctx: CanvasRenderingContext2D, heart: Heart) {
    ctx.save();
    ctx.translate(heart.x, heart.y);
    ctx.rotate(heart.rotation);

    const s = heart.size;

    // Shimmer effect: slight opacity pulse
    const shimmerOpacity = heart.opacity * (0.75 + 0.25 * Math.sin(heart.shimmer));

    // Glossy gradient
    const grad = ctx.createRadialGradient(-s * 0.2, -s * 0.3, s * 0.05, 0, 0, s);
    const baseColor = heart.color.replace(/[\d.]+\)$/, `${shimmerOpacity.toFixed(2)})`);
    const highlightColor = heart.color.replace(/[\d.]+\)$/, `${Math.min(1, shimmerOpacity * 1.6).toFixed(2)})`);
    const shadowColor = heart.color.replace(/[\d.]+\)$/, `${(shimmerOpacity * 0.4).toFixed(2)})`);

    grad.addColorStop(0, highlightColor);
    grad.addColorStop(0.4, baseColor);
    grad.addColorStop(1, shadowColor);

    ctx.fillStyle = grad;
    ctx.shadowColor = `rgba(180, 210, 255, ${(shimmerOpacity * 0.5).toFixed(2)})`;
    ctx.shadowBlur = s * 0.8;

    // Draw heart shape
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(-s * 0.05, s * 0.1, -s * 0.5, -s * 0.1, -s * 0.5, -s * 0.15);
    ctx.bezierCurveTo(-s * 0.5, -s * 0.5, 0, -s * 0.35, 0, -s * 0.05);
    ctx.bezierCurveTo(0, -s * 0.35, s * 0.5, -s * 0.5, s * 0.5, -s * 0.15);
    ctx.bezierCurveTo(s * 0.5, -s * 0.1, s * 0.05, s * 0.1, 0, s * 0.3);
    ctx.fill();

    // Glossy highlight
    ctx.beginPath();
    ctx.ellipse(-s * 0.18, -s * 0.2, s * 0.15, s * 0.1, -0.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${(shimmerOpacity * 0.45).toFixed(2)})`;
    ctx.shadowBlur = 0;
    ctx.fill();

    ctx.restore();
}

const TOTAL_HEARTS = 38;

export default function HeartRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const heartsRef = useRef<Heart[]>([]);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Init hearts spread throughout the screen
        heartsRef.current = Array.from({ length: TOTAL_HEARTS }, (_, i) =>
            createHeart(canvas.width, i < TOTAL_HEARTS / 2)
        );

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            heartsRef.current.forEach((heart, i) => {
                heart.y += heart.speed;
                heart.x += heart.drift;
                heart.rotation += heart.rotationSpeed;
                heart.shimmer += heart.shimmerSpeed;

                drawHeart(ctx, heart);

                // Reset when off-screen bottom
                if (heart.y > canvas.height + 40) {
                    heartsRef.current[i] = createHeart(canvas.width, false);
                }
            });

            rafRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 10,
            }}
            aria-hidden="true"
        />
    );
}
