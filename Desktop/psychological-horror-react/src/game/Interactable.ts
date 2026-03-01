import { Player } from "./Player";

export class Interactable {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public id: string;
    public label: string;
    public isCompleted: boolean = false;

    private interactionRadius: number = 60;

    constructor(id: string, label: string, x: number, y: number, width: number, height: number) {
        this.id = id;
        this.label = label;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public canInteract(player: Player): boolean {
        if (this.isCompleted) return false;

        // Simple center distance check
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const px = player.x + player.width / 2;
        const py = player.y + player.height / 2;

        const dist = Math.sqrt((cx - px) ** 2 + (cy - py) ** 2);
        return dist < this.interactionRadius;
    }

    public interact() {
        this.isCompleted = true;
        console.log(`Interacted with: ${this.id}`);
    }

    public draw(ctx: CanvasRenderingContext2D, isNear: boolean) {
        if (this.isCompleted) return; // Don't draw or draw differently if done

        // Draw the interactable bounds (placeholder)
        ctx.strokeStyle = isNear ? "#ffff00" : "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Helper text
        if (isNear) {
            ctx.fillStyle = "#ffff00";
            ctx.font = "14px Courier";
            ctx.fillText(`[F] ${this.label}`, this.x, this.y - 10);
        }
    }
}
