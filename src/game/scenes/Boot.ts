import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    this.load.image("background", "assets/bg.png");
    this.load.image("hq", "assets/hq_resized.png");
    // main robot spritesheet
    this.load.spritesheet("robot", "assets/Andino.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.image("objective", "assets/objective.png");
  }

  create() {
    this.scene.start("Preloader");
  }
}
