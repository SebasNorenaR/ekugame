import { Scene } from "phaser";

const storyText = [
  "Year 2090.\n\n\nAI leaders are ruling the\n world.",
  "The CEO of Ekumen is not Gui,\nbut Dante, a true AGI.",
  "Someone hacked the president.\nWar started and Dante AGI\nin an attempt of maximizing\nhuman survival decides to\nlock down the people\nat the office.",
  "Andino, our hero, \n realized Dante AGI\nwent rogue, and is determined\nto take it down.",
  "Mich hid sections of the\nREADME.md on how to\ndeactivate it across\nthe office.",
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

    this.player = this.add.sprite(100, 600, "robot");
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
        color: "#ffffff",
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
  }

  update(time: number, delta: number): void {
    if (this.cursors.up.isDown) {
      this.player.y -= 5;
    } else if (this.cursors.down.isDown) {
      this.player.y += 5;
    } else if (this.cursors.left.isDown) {
      this.player.x -= 5;
      this.player.scaleX = -1;
    } else if (this.cursors.right.isDown) {
      this.player.x += 5;
      this.player.scaleX = 1;
    }
  }
}
