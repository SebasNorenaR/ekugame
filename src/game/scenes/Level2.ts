import { Scene } from "phaser";

export class Level2 extends Scene {
  msg_text: Phaser.GameObjects.Text;
  constructor() {
    super("Level2");
  }

  create() {
    this.msg_text = this.add.text(20, 20, "level 2", {
      fontFamily: "Arial Black",
      fontSize: 38,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
    // this.msg_text.setOrigin(0.5);
    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
