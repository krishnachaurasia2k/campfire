import { Player } from "./Player";
import { CombatSystem } from "./CombatSystem";
import { SceneManager } from "./SceneManager";
import type { SceneID } from "./SceneManager";

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isRunning: boolean = false;
  private lastTime: number = 0;

  public player: Player;
  public combatSystem: CombatSystem;
  public sceneManager: SceneManager;

  private onSceneChange: (scene: SceneID) => void;
  private onTaskCompleted: (task: string) => void;

  constructor(
    canvas: HTMLCanvasElement,
    onSceneChange: (scene: SceneID) => void,
    onTaskCompleted: (task: string) => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.onSceneChange = onSceneChange;
    this.onTaskCompleted = onTaskCompleted;

    // Initialize systems
    this.combatSystem = new CombatSystem();
    this.sceneManager = new SceneManager(this.onSceneChange, this.onTaskCompleted);

    // Initialize entities
    this.player = new Player(400, 300); // Start in center of classroom
  }

  public triggerPossession() {
    this.player.startPossession();
  }

  public start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  public stop() {
    this.isRunning = false;
  }

  private loop(currentTime: number) {
    if (!this.isRunning) return;

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Prevent huge deltaTimes if tab is unfocused
    if (deltaTime > 0.1) {
      requestAnimationFrame((t) => this.loop(t));
      return;
    }

    this.update(deltaTime);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }

  private update(deltaTime: number) {
    this.player.update(deltaTime, this.sceneManager.enemies);

    // Filter out dead enemies
    this.sceneManager.enemies = this.sceneManager.enemies.filter(e => !e.isDead);

    for (const enemy of this.sceneManager.enemies) {
      enemy.update(deltaTime, this.player);
      this.combatSystem.checkCollisions(this.player, enemy);
    }
  }

  public handleInput(keys: Record<string, boolean>) {
    this.player.handleInput(keys);
    this.sceneManager.update(0.016, this.player, keys); // Update interaction checks
  }

  private draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Reality Scene Background (via Scene Manager)
    this.sceneManager.draw(this.ctx, this.canvas.width, this.canvas.height, this.player);

    // Draw enemies
    for (const enemy of this.sceneManager.enemies) {
      enemy.draw(this.ctx);
    }

    // Draw player
    this.player.draw(this.ctx);
  }
}
