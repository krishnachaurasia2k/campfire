import React, { useEffect, useRef } from 'react';

interface Raindrop {
    x: number;
    y: number;
    length: number;
    speed: number;
}

export const RainSystem: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        const raindrops: Raindrop[] = [];
        const maxDrops = 150;

        for (let i = 0; i < maxDrops; i++) {
            raindrops.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 15 + 10
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(174,194,224,0.5)';
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';

            raindrops.forEach(drop => {
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x + drop.length * 0.2, drop.y + drop.length);
                ctx.stroke();

                drop.y += drop.speed;
                drop.x += drop.speed * 0.2; // slight angle

                if (drop.y > canvas.height) {
                    drop.y = -20;
                    drop.x = Math.random() * canvas.width;
                }
            });

            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 5
            }}
        />
    );
};
