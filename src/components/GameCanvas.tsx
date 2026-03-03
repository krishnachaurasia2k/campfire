import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../game/GameEngine';

interface GameCanvasProps {
    onSceneChange: (scene: any) => void;
    onTaskCompleted: (task: string) => void;
    onEngineReady: (engine: GameEngine) => void;
    width?: number;
    height?: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
    onSceneChange,
    onTaskCompleted,
    onEngineReady,
    width = 800,
    height = 600
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<GameEngine | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialize GameEngine
        const engine = new GameEngine(canvasRef.current, onSceneChange, onTaskCompleted);
        engine.start();
        engineRef.current = engine;

        onEngineReady(engine);

        // Track keys
        const keys: Record<string, boolean> = {};

        const handleKeyDown = (e: KeyboardEvent) => {
            keys[e.key.toLowerCase()] = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keys[e.key.toLowerCase()] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // This loop lets react/dom drive input tracking, but GameEngine runs its own raf loop.
        // It's a decoupled approach. 
        const inputLoop = setInterval(() => {
            if (engineRef.current) {
                engineRef.current.handleInput(keys);
            }
        }, 1000 / 60);

        return () => {
            if (engineRef.current) {
                engineRef.current.stop();
            }
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            clearInterval(inputLoop);
        };
    }, [onSceneChange, onTaskCompleted, onEngineReady]); // Only on mount/callbacks change

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
                border: '2px solid #333',
                borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                imageRendering: 'pixelated'
            }}
        />
    );
};
