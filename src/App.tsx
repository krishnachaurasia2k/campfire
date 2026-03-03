import { useState, useCallback, useRef } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { DialogueUI } from './components/DialogueUI';
import { RainSystem } from './components/RainSystem';
import { SkillBar } from './components/SkillBar';
import { GameEngine } from './game/GameEngine';
import type { SceneID } from './game/SceneManager';
import './App.css';

function App() {
  const [currentScene, setCurrentScene] = useState<SceneID>("CLASSROOM");
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showIntroDialogue, setShowIntroDialogue] = useState(true);

  const engineRef = useRef<GameEngine | null>(null);

  const introDialogue = [
    { name: "System", text: "You zone out. Everything feels grey and distant today." },
    { name: "System", text: "[F] or [Enter] to interact with objects with a yellow border." },
    { name: "System", text: "Try to pick up your notebook and read the assignment before leaving." }
  ];

  const handleSceneChange = useCallback((scene: SceneID) => {
    setCurrentScene(scene);
    if (scene === "COURTYARD") {
      console.log("Welcome to courtyard");
    }
  }, []);

  const handleTaskCompleted = useCallback((taskId: string) => {
    if (taskId === "killed_cat") {
      // Scripted Event
      triggerShapeshift();
      // Wait a moment then jump to House
      setTimeout(() => {
        if (engineRef.current) {
          engineRef.current.sceneManager.switchScene("HOUSE", engineRef.current.player);
          setCompletedTasks([]); // Reset tasks for house
        }
      }, 2000);
      return;
    }

    setCompletedTasks(prev => {
      if (!prev.includes(taskId)) return [...prev, taskId];
      return prev;
    });
  }, []);

  const handleEngineReady = useCallback((engine: GameEngine) => {
    engineRef.current = engine;
  }, []);

  const triggerShapeshift = () => {
    if (engineRef.current) {
      engineRef.current.triggerPossession();
    }
  };

  return (
    <div className="app-container">
      <header className="game-header">
        <h1>Reality ({currentScene})</h1>
        <p style={{ fontSize: '12px', color: '#666' }}>WASD to Move. SPACE to Dodge. E/Enter to attack. F to Interact. Q to Possess.</p>
      </header>

      <main className="game-stage">
        {currentScene === "STREET" && <RainSystem />}

        {/* Action / Skil UI */}
        <SkillBar onShapeshiftClick={triggerShapeshift} isImagination={false} />

        {/* Task List UI */}
        {currentScene === "CLASSROOM" && (
          <div style={{
            position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)',
            padding: '10px', borderRadius: '8px', zIndex: 10, textAlign: 'left',
            border: '1px solid #444', minWidth: '200px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#aaa' }}>Current Tasks</h4>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
              <li style={{ color: completedTasks.includes('desk') ? '#44cc44' : '#fff' }}>
                {completedTasks.includes('desk') ? '☑' : '☐'} Pick up Notebook
              </li>
              <li style={{ color: completedTasks.includes('chalkboard') ? '#44cc44' : '#fff' }}>
                {completedTasks.includes('chalkboard') ? '☑' : '☐'} Read Assignment
              </li>
              <li style={{ color: completedTasks.includes('door_to_courtyard') ? '#44cc44' : '#aaa' }}>
                ☐ Go to Courtyard
              </li>
            </ul>
          </div>
        )}

        {currentScene === "STREET" && (
          <div style={{
            position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)',
            padding: '10px', borderRadius: '8px', zIndex: 10, textAlign: 'left',
            border: '1px solid #444', minWidth: '200px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#aaa' }}>Street Tasks</h4>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
              <li style={{ color: '#fff' }}>
                Interact with the Cat (Umbrella / Food)
              </li>
            </ul>
          </div>
        )}

        {currentScene === "HOUSE" && (
          <div style={{
            position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)',
            padding: '10px', borderRadius: '8px', zIndex: 10, textAlign: 'left',
            border: '1px solid #444', minWidth: '200px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#aaa' }}>House Tasks</h4>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
              <li style={{ color: completedTasks.includes('clothes') ? '#44cc44' : '#fff' }}>
                {completedTasks.includes('clothes') ? '☑' : '☐'} Pick up Laundry
              </li>
              <li style={{ color: completedTasks.includes('pc') ? '#44cc44' : '#fff' }}>
                {completedTasks.includes('pc') ? '☑' : '☐'} Check Computer
              </li>
              <li style={{ color: (completedTasks.includes('pc') && completedTasks.includes('clothes')) ? '#aaa' : '#555' }}>
                ☐ Go to Sleep (Bed)
              </li>
            </ul>
          </div>
        )}

        {/* The Game Engine running in an HTML Canvas */}
        <GameCanvas
          onSceneChange={handleSceneChange}
          onTaskCompleted={handleTaskCompleted}
          onEngineReady={handleEngineReady}
          width={800}
          height={600}
        />

        {/* Dialogue System Floating over Canvas */}
        {showIntroDialogue && (
          <DialogueUI
            dialogue={introDialogue}
            onComplete={() => setShowIntroDialogue(false)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
