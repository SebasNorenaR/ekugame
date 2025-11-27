import { Scene } from "phaser";

export class GameStory extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  player: Phaser.GameObjects.Sprite;
  keys: any;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("GameStory");
  }

  create() {
    this.camera = this.cameras.main;

    this.background = this.add.image(512, 384, "background");

    // Input Events
    if (this.input.keyboard === null) {
      throw new Error("No keyboard detected!");
    }
    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = this.add.sprite(0, 0, "robot");
    this.player.scale = 5;
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("robot", { frames: [0, 1] }),
      frameRate: 4,
      repeat: -1,
    });
    this.player.setOrigin(0.5);
    this.player.play("walk");
    this.player.setPosition(100, 100);

    this.keys = this.input.keyboard?.addKeys("SPACE");
  }

  update(time: number, delta: number): void {
    // onkeydown((ev: KeyboardEvent) => {
    //   console.log(ev);
    // });
    if (this.cursors.up.isDown) {
      //this.player.setVelocityY(-400);
      this.player.y -= 5;
    } else if (this.cursors.down.isDown) {
      // this.player.setVelocityY(400);
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
