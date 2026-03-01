import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { Interactable } from "./Interactable";

export type SceneID = "CLASSROOM" | "COURTYARD" | "STREET" | "HOUSE";

export class SceneManager {
    public currentSceneId: SceneID = "CLASSROOM";

    public bgImage: HTMLImageElement;
    public classroomImage: HTMLImageElement;
    public courtyardImage: HTMLImageElement;
    public streetImage: HTMLImageElement;
    public houseImage: HTMLImageElement;

    public enemies: Enemy[] = [];
    public interactables: Interactable[] = [];

    // Callbacks passed from React/GameEngine
    private onSceneChange: (newScene: SceneID) => void;
    private onTaskCompleted: (taskId: string) => void;

    constructor(onSceneChange: (newScene: SceneID) => void, onTaskCompleted: (taskId: string) => void) {
        this.onSceneChange = onSceneChange;
        this.onTaskCompleted = onTaskCompleted;

        this.classroomImage = new Image();
        this.classroomImage.src = "/classroom_bg.png";

        this.courtyardImage = new Image();
        this.courtyardImage.src = "/college_bg.png";

        this.streetImage = new Image();
        this.streetImage.src = "/street_bg.png";

        this.houseImage = new Image();
        this.houseImage.src = "/house_bg.png";

        this.bgImage = this.classroomImage;

        this.loadClassroom();
    }

    public update(_deltaTime: number, player: Player, keys: Record<string, boolean>) {
        // Check interactions
        const canInteract = keys["f"] || keys["e"] || keys["enter"];
        let interactedThisFrame = false;

        for (const item of this.interactables) {
            if (!item.isCompleted && item.canInteract(player)) {
                if (canInteract && !interactedThisFrame) {
                    item.interact();
                    this.onTaskCompleted(item.id);
                    interactedThisFrame = true;

                    // Special logic for transitions or cat interaction
                    if (item.id === "door_to_courtyard") {
                        this.switchScene("COURTYARD", player);
                    } else if (item.id === "gate_to_street") {
                        this.switchScene("STREET", player);
                    } else if (item.id === "cat") {
                        // Cat interaction sequence
                        if (item.label === "Protect from rain with Umbrella") {
                            item.label = "Feed the Cat";
                            item.isCompleted = false; // Reset to allow second interaction
                        } else if (item.label === "Feed the Cat") {
                            // After feeding, we lose control (scripted event)
                            this.onTaskCompleted("killed_cat"); // Trigger transition to House in App.tsx
                        }
                    } else if (item.id === "bed") {
                        this.switchScene("CLASSROOM", player); // Restart game loop for now
                    }
                }
            }
        }

        // Reset interaction key state to prevent rapid-fire triggers if handled outside
        if (interactedThisFrame) {
            keys["f"] = false;
            keys["e"] = false;
            keys["enter"] = false;
        }
    }

    public draw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, player: Player) {
        // Draw Background
        if (this.bgImage.complete) {
            ctx.drawImage(this.bgImage, 0, 0, canvasWidth, canvasHeight);
        } else {
            ctx.fillStyle = "#222";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        // Draw Interactables
        for (const item of this.interactables) {
            const isNear = item.canInteract(player);
            item.draw(ctx, isNear);
        }
    }

    public switchScene(sceneId: SceneID, player: Player) {
        this.currentSceneId = sceneId;
        this.onSceneChange(sceneId);

        if (sceneId === "CLASSROOM") {
            this.bgImage = this.classroomImage;
            this.loadClassroom();
            player.x = 400; player.y = 300;
        } else if (sceneId === "COURTYARD") {
            this.bgImage = this.courtyardImage;
            this.loadCourtyard();
            player.x = 100; player.y = 500; // spawn at bottom left
        } else if (sceneId === "STREET") {
            this.bgImage = this.streetImage;
            this.loadStreet();
            player.x = 100; player.y = 500;
        } else if (sceneId === "HOUSE") {
            this.bgImage = this.houseImage;
            this.loadHouse();
            player.x = 400; player.y = 300;
        }
    }

    private loadClassroom() {
        this.enemies = []; // No enemies in classroom
        this.interactables = [
            new Interactable("desk", "Pick up notebook", 300, 200, 50, 40),
            new Interactable("chalkboard", "Read assignment", 200, 50, 200, 50),
            new Interactable("door_to_courtyard", "Exit to Courtyard", 700, 100, 60, 100)
        ];
    }

    private loadCourtyard() {
        this.interactables = [
            // Add a gate to leave the courtyard
            new Interactable("gate_to_street", "Walk home...", 700, 100, 80, 100)
        ];
        this.enemies = [
            new Enemy(300, 300),
            new Enemy(600, 400),
            new Enemy(500, 100)
        ];
    }

    private loadStreet() {
        this.enemies = [];
        this.interactables = [
            // Cat starts here
            new Interactable("cat", "Protect from rain with Umbrella", 400, 300, 40, 40)
        ];
    }

    private loadHouse() {
        this.enemies = [];
        this.interactables = [
            new Interactable("pc", "Turn on computer", 500, 200, 60, 60),
            new Interactable("clothes", "Pick up laundry", 600, 400, 50, 50),
            new Interactable("bed", "Go to sleep", 200, 300, 100, 200)
        ];
    }
}
