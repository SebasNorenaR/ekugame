import { Scene } from "phaser";

interface ObjectiveConfig {
  objSprite: Phaser.GameObjects.Image;
  nextLevelKey: string;
}

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  robot: Phaser.GameObjects.Sprite;
  objectives: ObjectiveConfig[] = [];
  keys: any;

  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);

    // this.msg_text = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
    //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
    //     stroke: '#000000', strokeThickness: 8,
    //     align: 'center'
    // });
    // this.msg_text.setOrigin(0.5);

    // this.input.once('pointerdown', () => {

    //     this.scene.start('GameOver');

    // });

    const OBJ_TEXTURE = "objective";
    this.objectives.push(this.createObjective(100, 200, OBJ_TEXTURE, "Level1"));
    this.objectives.push(this.createObjective(200, 200, OBJ_TEXTURE, "Level2"));
    // this.objectives.push(this.createObjective(100, 500, OBJ_TEXTURE, "Level3"));

    this.robot = this.add.sprite(0, 0, "robot");
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("robot", { frames: [0, 1] }),
      frameRate: 4,
      repeat: -1,
    });
    this.robot.setOrigin(0.5);
    this.robot.play("walk");
    this.robot.setPosition(100, 100);

    onkeydown = (ev: KeyboardEvent) => {
      // console.log(ev);
      if (ev.key.toLowerCase() === "w") {
        this.robot.y -= 5;
      }
      if (ev.key.toLowerCase() === "s") {
        this.robot.y += 5;
      }
      if (ev.key.toLowerCase() === "a") {
        this.robot.x -= 5;
        this.robot.scaleX = -1;
      }
      if (ev.key.toLowerCase() === "d") {
        this.robot.x += 5;
        this.robot.scaleX = 1;
      }
    };

    this.keys = this.input.keyboard?.addKeys("SPACE");
  }

  update(time: number, delta: number): void {
    // onkeydown((ev: KeyboardEvent) => {
    //   console.log(ev);
    // });
    this.objectives.forEach((objConfig) => {
      const obj = objConfig.objSprite;
      if (
        Math.abs(obj.x - this.robot.x) < 30 &&
        Math.abs(obj.y - this.robot.y) < 30
      ) {
        obj.scale = 1;
        if (this.keys.SPACE.isDown) {
          console.log("SPACE IS DOWN");
          this.scene.start(objConfig.nextLevelKey);
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
