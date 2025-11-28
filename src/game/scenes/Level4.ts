import { Scene } from "phaser";

export class Level4 extends Scene {
  exitBtn: Phaser.GameObjects.Text;
  winImage: Phaser.GameObjects.Image;
  statusText: Phaser.GameObjects.Text;
  instructionText: Phaser.GameObjects.Text;
  level1Won: boolean = false;
  level2Won: boolean = false;
  level3Won: boolean = false;
  allWon: boolean = false;

  constructor() {
    super({
      key: "Level4",
    });
  }

  create() {
    // Set background color
    this.cameras.main.setBackgroundColor("#1a1a2e");

    // Get win states from registry
    this.level1Won = this.registry.get("level1Won") || false;
    this.level2Won = this.registry.get("level2Won") || false;
    this.level3Won = this.registry.get("level3Won") || false;

    // Check if all levels are won
    this.allWon = this.level1Won && this.level2Won && this.level3Won;

    if (this.allWon) {
      // Show win image
      this.winImage = this.add.image(512, 384, "winImage");
      const scaleX = 900 / this.winImage.width;
      const scaleY = 650 / this.winImage.height;
      const scale = Math.min(scaleX, scaleY, 1);
      this.winImage.setScale(scale);

      this.instructionText = this.add
        .text(512, 700, "Congratulations! You won all levels!", {
          fontSize: "32px",
          color: "#00ff00",
          stroke: "#000000",
          strokeThickness: 8,
        })
        .setOrigin(0.5);
    } else {
      // Show status of each level
      this.statusText = this.add
        .text(512, 200, this.getStatusMessage(), {
          fontSize: "28px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 6,
          align: "center",
        })
        .setOrigin(0.5);

      this.instructionText = this.add
        .text(512, 500, "Complete all three levels to win!", {
          fontSize: "32px",
          color: "#ffff00",
          stroke: "#000000",
          strokeThickness: 8,
        })
        .setOrigin(0.5);
    }

    // Exit button
    this.exitBtn = this.add.text(20, 20, "exit", {
      fontSize: 38,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
    this.exitBtn.setInteractive({ useHandCursor: true });
    this.exitBtn.on("pointerdown", () => {
      this.scene.start("Game");
    });
    this.exitBtn.on("pointerover", () =>
      this.exitBtn.setStyle({ fill: "yellow" })
    );
    this.exitBtn.on("pointerout", () =>
      this.exitBtn.setStyle({ fill: "white" })
    );
  }

  getStatusMessage(): string {
    const status1 = this.level1Won ? "✓" : "✗";
    const status2 = this.level2Won ? "✓" : "✗";
    const status3 = this.level3Won ? "✓" : "✗";

    return `Level 1 (Pong): ${status1}\n\nLevel 2 (Breakout): ${status2}\n\nLevel 3 (Ricochet Robot): ${status3}`;
  }
}
