import { Scene } from "phaser";

interface ObjectiveConfig {
  objSprite: Phaser.GameObjects.Image;
  nextLevelKey: string;
}

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  player: Phaser.GameObjects.Sprite;
  objectives: ObjectiveConfig[] = [];
  keys: any;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);

    // Input Events
    if (this.input.keyboard === null) {
      throw new Error("No keyboard detected!");
    }
    this.cursors = this.input.keyboard.createCursorKeys();

    const OBJ_TEXTURE = "objective";
    this.objectives.push(this.createObjective(100, 200, OBJ_TEXTURE, "Level1"));
    this.objectives.push(this.createObjective(200, 200, OBJ_TEXTURE, "Level2"));
    // this.objectives.push(this.createObjective(100, 500, OBJ_TEXTURE, "Level3"));

    this.player = this.add.sprite(0, 0, "robot");
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

    this.objectives.forEach((objConfig) => {
      const obj = objConfig.objSprite;
      if (
        Math.abs(obj.x - this.player.x) < 30 &&
        Math.abs(obj.y - this.player.y) < 30
      ) {
        obj.scale = 1;
        if (this.keys.SPACE.isDown) {
          console.log("SPACE IS DOWN");
          this.scene.start(objConfig.nextLevelKey, {});
        }
      } else {
        obj.scale = 0.6;
      }
    });
  }

  createObjective(x: number, y: number, texture: string, nextLevel: string) {
    const obj = this.add.image(x, y, texture);
    obj.scale = 0.6;

    const objConfig: ObjectiveConfig = {
      objSprite: obj,
      nextLevelKey: nextLevel,
    };

    return objConfig;
  }
}
