export class Player {
    public x: number;
    public y: number;
    public width: number = 30;
    public height: number = 50;

    public health: number = 100;
    public maxHealth: number = 100;

    private speed: number = 200;
    private sprintMultiplier: number = 1.5;
    private vx: number = 0;
    private vy: number = 0;

    public isDodging: boolean = false;
    private dodgeTimer: number = 0;
    private dodgeDuration: number = 0.3;
    private dodgeSpeed: number = 400;

    public isAttacking: boolean = false;
    private attackTimer: number = 0;
    private attackDuration: number = 0.4;
    public attackHitbox = { x: 0, y: 0, w: 0, h: 0 };
    public facingDir: { x: number, y: number } = { x: 0, y: 1 };

    public isPossessed: boolean = false;
    private possessionTimer: number = 0;
    private possessionDuration: number = 1.0;
    private possessionCooldownTimer: number = 0;
    private possessionCooldown: number = 5.0;
    public possessionHitbox = { x: 0, y: 0, radius: 0 };

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public handleInput(keys: Record<string, boolean>) {
        if (this.isDodging || this.isAttacking) return;
        if (this.isPossessed) return; // Creature takes full control

        let dirX = 0;
        let dirY = 0;

        if (keys["w"]) dirY -= 1;
        if (keys["s"]) dirY += 1;
        if (keys["a"]) dirX -= 1;
        if (keys["d"]) dirX += 1;

        // Normalize
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        if (length > 0) {
            dirX /= length;
            dirY /= length;
            this.facingDir = { x: dirX, y: dirY };
        }

        let currentSpeed = this.speed;
        if (keys["shift"]) currentSpeed *= this.sprintMultiplier;

        this.vx = dirX * currentSpeed;
        this.vy = dirY * currentSpeed;

        if (keys[" "] && length > 0) { // Space for dodge
            this.startDodge(dirX, dirY);
        }

        if (keys["enter"] || keys["e"]) { // E or Enter for attack
            this.startAttack();
        }

        if (keys["q"] && this.possessionCooldownTimer <= 0) {
            this.startPossession();
        }
    }

    public startPossession() {
        this.isPossessed = true;
        this.possessionTimer = this.possessionDuration;
        this.possessionCooldownTimer = this.possessionCooldown;
        // Boost speed significantly while possessed
        this.speed = 400;
    }

    private startDodge(dirX: number, dirY: number) {
        this.isDodging = true;
        this.dodgeTimer = this.dodgeDuration;
        this.vx = dirX * this.dodgeSpeed;
        this.vy = dirY * this.dodgeSpeed;
    }

    private startAttack() {
        this.isAttacking = true;
        this.attackTimer = this.attackDuration;
        this.vx = 0;
        this.vy = 0;

        // Position hitbox based on facing direction
        const range = 40;
        const boxSize = 40;
        this.attackHitbox = {
            x: this.x + (this.width / 2) + (this.facingDir.x * range) - (boxSize / 2),
            y: this.y + (this.height / 2) + (this.facingDir.y * range) - (boxSize / 2),
            w: boxSize,
            h: boxSize
        };
    }

    public update(deltaTime: number, enemies: any[] = []) {
        if (this.possessionCooldownTimer > 0) {
            this.possessionCooldownTimer -= deltaTime;
        }

        if (this.isPossessed) {
            this.possessionTimer -= deltaTime;

            // Autonomous movement towards the nearest enemy
            let closestDist = Infinity;
            let closestEnemy: any = null;
            for (const enemy of enemies) {
                if (enemy.isDead) continue;
                const dx = (enemy.x + enemy.width / 2) - (this.x + this.width / 2);
                const dy = (enemy.y + enemy.height / 2) - (this.y + this.height / 2);
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestEnemy = enemy;
                }
            }

            if (closestEnemy) {
                const dx = (closestEnemy.x + closestEnemy.width / 2) - (this.x + this.width / 2);
                const dy = (closestEnemy.y + closestEnemy.height / 2) - (this.y + this.height / 2);
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0) {
                    this.vx = (dx / dist) * this.speed;
                    this.vy = (dy / dist) * this.speed;
                    this.facingDir = { x: dx / dist, y: dy / dist };
                }
            } else {
                this.vx = 0;
                this.vy = 0;
            }

            // Update possession AoE hitbox
            this.possessionHitbox = {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                radius: 60
            };

            if (this.possessionTimer <= 0) {
                this.isPossessed = false;
                this.speed = 200; // Reset speed
            }
        }

        if (this.isDodging) {
            this.dodgeTimer -= deltaTime;
            if (this.dodgeTimer <= 0) this.isDodging = false;
        }

        if (this.isAttacking) {
            this.attackTimer -= deltaTime;
            if (this.attackTimer <= 0) this.isAttacking = false;
        }

        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Simple friction
        if (!this.isDodging && !this.isAttacking) {
            this.vx = 0;
            this.vy = 0;
        }

        // Bounds check
        this.x = Math.max(0, Math.min(800 - this.width, this.x)); // Assuming canvas is 800 wide
        this.y = Math.max(0, Math.min(600 - this.height, this.y)); // Assuming canvas is 600 tall
    }

    public takeHit(damage: number, knockbackDir: { x: number, y: number }) {
        if (this.isDodging) return; // i-frames

        this.health -= damage;
        this.x += knockbackDir.x * 20; // small knockback
        this.y += knockbackDir.y * 20;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        // Draw player shadow
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height, this.width / 2, this.height / 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw Possession aura
        if (this.isPossessed) {
            ctx.fillStyle = "rgba(100, 0, 150, 0.4)";
            ctx.beginPath();
            ctx.arc(this.possessionHitbox.x, this.possessionHitbox.y, this.possessionHitbox.radius, 0, Math.PI * 2);
            ctx.fill();

            // Shadow tendrils
            ctx.strokeStyle = "rgba(50, 0, 80, 0.8)";
            ctx.lineWidth = 3;
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
                const angle = (Date.now() / 200) + (i * Math.PI / 2);
                ctx.lineTo(this.x + this.width / 2 + Math.cos(angle) * 70, this.y + this.height / 2 + Math.sin(angle) * 70);
                ctx.stroke();
            }
        }

        // Draw Character (Ben)
        if (this.isPossessed) {
            ctx.fillStyle = "#1a0b2e"; // Dark creature color
        } else {
            ctx.fillStyle = this.isDodging ? "#5a5a9a" : "#2a4d69";
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw Attack Hitbox if attacking
        if (this.isAttacking) {
            ctx.fillStyle = "rgba(255, 50, 50, 0.5)";
            ctx.fillRect(this.attackHitbox.x, this.attackHitbox.y, this.attackHitbox.w, this.attackHitbox.h);
        }

        // Facing indicator
        ctx.fillStyle = "#fff";
        ctx.fillRect(
            this.x + this.width / 2 + this.facingDir.x * 15 - 2,
            this.y + this.height / 2 + this.facingDir.y * 15 - 2,
            4, 4
        );
    }
}
