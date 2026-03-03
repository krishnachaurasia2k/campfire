import { Player } from "./Player";
import { Enemy } from "./Enemy";

export class CombatSystem {
    public checkCollisions(player: Player, enemy: Enemy) {
        // Check if Player hits Enemy with normal attack
        if (player.isAttacking) {
            if (this.rectIntersect(
                player.attackHitbox.x, player.attackHitbox.y, player.attackHitbox.w, player.attackHitbox.h,
                enemy.x, enemy.y, enemy.width, enemy.height
            )) {
                enemy.takeHit(1, player.facingDir);
            }
        }

        // Check if Enemy is hit by Possession AoE
        if (player.isPossessed) {
            const dx = (enemy.x + enemy.width / 2) - player.possessionHitbox.x;
            const dy = (enemy.y + enemy.height / 2) - player.possessionHitbox.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < player.possessionHitbox.radius + (enemy.width / 2)) {
                // Continuous knockback and damage
                enemy.takeHit(0.5, { x: dx / dist, y: dy / dist });
            }
        }

        // Check if Enemy hits Player
        if (enemy.isAttacking && this.rectIntersect(
            enemy.attackHitbox.x, enemy.attackHitbox.y, enemy.attackHitbox.w, enemy.attackHitbox.h,
            player.x, player.y, player.width, player.height
        )) {
            // Protected while dodging or possessed
            if (!player.isDodging && !player.isPossessed) {
                player.takeHit(0.5, { x: 0, y: 0 }); // Constant drain, or implement a hit tracker
            }
        }
    }

    private rectIntersect(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number) {
        return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
    }
}
