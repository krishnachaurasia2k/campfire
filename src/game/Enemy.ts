export class Enemy {
    public x: number;
    public y: number;
    public width: number = 40;
    public height: number = 60;
    public isDead: boolean = false;

    public health: number = 50;
    private speed: number = 100;

    public state: "IDLE" | "CHASE" | "ATTACK" = "IDLE";
    private detectionRange: number = 300;
    private attackRange: number = 40;

    public isAttacking: boolean = false;
    private attackTimer: number = 0;
    public attackHitbox = { x: 0, y: 0, w: 0, h: 0 };

    private flashTimer: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public update(deltaTime: number, player: any) {
        if (this.isDead) return;

        if (this.flashTimer > 0) this.flashTimer -= deltaTime;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (this.state === "IDLE") {
            if (dist < this.detectionRange) {
                this.state = "CHASE";
            }
        } else if (this.state === "CHASE") {
            if (dist < this.attackRange) {
                this.state = "ATTACK";
                this.startAttack(player);
            } else if (dist > this.detectionRange * 1.5) {
                this.state = "IDLE";
            } else {
                // Move towards player
                this.x += (dx / dist) * this.speed * deltaTime;
                this.y += (dy / dist) * this.speed * deltaTime;
            }
        } else if (this.state === "ATTACK") {
            this.updateAttack(deltaTime);
        }
    }

    private startAttack(player: any) {
        this.isAttacking = true;
        this.attackTimer = 1.0; // 1 second attack duration

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Spawn Hitbox towards player
        const boxSize = 50;
        this.attackHitbox = {
            x: this.x + (this.width / 2) + ((dx / dist) * this.attackRange) - (boxSize / 2),
            y: this.y + (this.height / 2) + ((dy / dist) * this.attackRange) - (boxSize / 2),
            w: boxSize,
            h: boxSize
        };
    }

    private updateAttack(deltaTime: number) {
        this.attackTimer -= deltaTime;
        if (this.attackTimer <= 0) {
            this.isAttacking = false;
            this.state = "CHASE"; // Re-evaluate next frame
        }
    }

    public takeHit(damage: number, knockback: { x: number, y: number }) {
        this.health -= damage;
        this.flashTimer = 0.2;
        this.x += knockback.x * 20;
        this.y += knockback.y * 20;

        if (this.health <= 0) {
            this.isDead = true;
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if (this.isDead) return;

        // Shadow
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height, this.width / 2, this.height / 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body (Reddish if enemy, white if hit flashing)
        ctx.fillStyle = this.flashTimer > 0 ? "#ffffff" : "#4a1c1c";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Attack Hitbox
        if (this.isAttacking && this.attackTimer > 0.5) { // Show active hitbox in first half of animation
            ctx.fillStyle = "rgba(255, 100, 0, 0.5)";
            ctx.fillRect(this.attackHitbox.x, this.attackHitbox.y, this.attackHitbox.w, this.attackHitbox.h);
        }
    }
}
