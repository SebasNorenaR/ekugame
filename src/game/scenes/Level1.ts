import { Scene } from "phaser";

export class Level1 extends Scene {
  msg_text: Phaser.GameObjects.Text;
  constructor() {
    super("Level1");
  }

  create() {
    this.msg_text = this.add.text(512, 384, "level 1", {
      fontFamily: "Arial Black",
      fontSize: 38,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
    this.msg_text.setOrigin(0.5);
    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
