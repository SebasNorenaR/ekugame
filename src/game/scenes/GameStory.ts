import { Scene } from "phaser";

const storyText = [
  "Year 2090.\n\n\nAI leaders now rule the\nworld.",
  "The CEO of Ekumen is not Gui,\nbut Dante: a true AGI.",
  "Someone hacked the President.\nWar began, and Dante AGI,\nin an attempt to maximize\nhuman survival, decided to\nlock down the people\nat the office.",
  "I am Andino.\n I realized Dante AGI\nwent rogue, and I am bound \nto take it down.",
  "Mich hid fragments of the\nREADME.md on how to\ndeactivate it throughout\nthe office.",
  "Let's go and find the\nmissing README.md pieces!",
];

export class GameStory extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  player: Phaser.GameObjects.Sprite;
  keys: any;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  currentTextIndex: number = 0;
  currentText: Phaser.GameObjects.Text;

  constructor() {
    super("GameStory");
  }

  create() {
    this.currentTextIndex = 0;
    this.camera = this.cameras.main;

    this.background = this.add.image(512, 384, "storyBg");

    // Input Events
    if (this.input.keyboard === null) {
      throw new Error("No keyboard detected!");
    }
    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = this.add.sprite(0, 600, "robot");
    this.player.scale = 5;
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("robot", { frames: [0, 1] }),
      frameRate: 4,
      repeat: -1,
    });
    this.player.setOrigin(0.5);
    this.player.play("walk");

    this.keys = this.input.keyboard?.addKeys("SPACE");
    this.currentText = this.add.text(
      250,
      140,
      storyText[this.currentTextIndex],
      {
        fontSize: 30,
        color: "yellow",
        stroke: "#000000",
        strokeThickness: 10,
        align: "center",
      }
    );

    this.input.on("pointerdown", () => {
      this.currentTextIndex++;
      if (this.currentTextIndex < storyText.length) {
        this.currentText.text = storyText[this.currentTextIndex];
      } else {
        this.scene.start("Game");
      }
    });

    this.tweens.add({ targets: this.player, x: 100, duration: 1000 });
  }

  update(time: number, delta: number): void {}
}
