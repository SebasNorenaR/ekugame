import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    this.load.image("background", "assets/rogueAI.png");
    this.load.image("hq", "assets/hq.png");
    // main robot spritesheet
    this.load.spritesheet("robot", "assets/Andino.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // Pong paddle spritesheets
    this.load.spritesheet("andinoPong", "assets/andino_pong.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("dantePong", "assets/dante_pong.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.image("objective", "assets/objective2.png");

    this.load.image("ekumenLogo", "assets/ekumen_logo.png");
    this.load.image("storyBg", "assets/dialogue.png");
    this.load.image("ricochetRobot", "assets/ricochet_robot.jpg");
    this.load.image("readmepart", "assets/readmepart.jpg");

    this.load.image("pongBg", "assets/pingpong copy.png");
    this.load.image("arkanoidBg", "assets/arkanoid_bg.jpeg");
    this.load.image("winImage", "assets/win.jpg");
    this.load.spritesheet("arkanoidEnemy", "assets/arkanoid_enemy0.png", {
    frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("fabri", "assets/fabri.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("franco", "assets/franco.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("alon", "assets/alon.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.scene.start("Preloader");
  }
}
