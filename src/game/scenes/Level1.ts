import { Scene } from "phaser";

export class Level1 extends Scene {
  msg_text: Phaser.GameObjects.Text;
  exitBtn: Phaser.GameObjects.Text;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  computer: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  gameStarted: boolean = false;
  scoreText: Phaser.GameObjects.Text;
  playerScore: number = 0;
  computerScore: number = 0;
  instructionsTxt: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "Level1",
      physics: {
        arcade: {
          gravity: { x: 0, y: 0 },
        },
      },
    });
  }

  create() {
    // this.msg_text = this.add.text(20, 20, "level 1", {
    //   fontSize: 38,
    //   color: "#ffffff",
    //   stroke: "#000000",
    //   strokeThickness: 8,
    //   align: "center",
    // });

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

    this.exitBtn.on("pointerover", () => {
      this.exitBtn.setStyle({ fill: "yellow" });
    });

    this.exitBtn.on("pointerout", () => {
      this.exitBtn.setStyle({ fill: "white" });
    });

    // Create Graphics (so we don't need image files)
    let graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1);

    // Paddle texture (10x100)
    graphics.fillRect(0, 0, 20, 100);
    graphics.generateTexture("paddleImg", 20, 100);

    // Ball texture (20x20)
    graphics.clear();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(0, 0, 20, 20);
    graphics.generateTexture("ballImg", 20, 20);
    graphics.destroy(); // Clean up graphics object

    // Create Objects
    // Player (Left side)
    this.player = this.physics.add.sprite(50, 300, "paddleImg");
    this.player.setImmovable(true);
    this.player.setCollideWorldBounds(true);

    // Computer (Right side)
    this.computer = this.physics.add.sprite(974, 300, "paddleImg");
    this.computer.setImmovable(true);
    this.computer.setCollideWorldBounds(true);

    // Ball
    this.ball = this.physics.add.sprite(512, 369, "ballImg");
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1, 1); // Perfect elastic bounce

    // Middle Line (Dashed)
    let line = this.add.graphics();
    line.lineStyle(4, 0xffffff, 0.2);
    line.beginPath();
    line.moveTo(512, 0);
    line.lineTo(512, 768);
    line.strokePath();

    // Input Events
    if (this.input.keyboard === null) {
      throw new Error("No keyboard detected!");
    }
    this.cursors = this.input.keyboard.createCursorKeys();

    // Start game on click
    this.input.on("pointerdown", () => {
      if (!this.gameStarted) {
        this.launchBall();
        this.gameStarted = true;
      }
    });

    // Collisions
    this.physics.add.collider(this.ball, this.player, this.hitPaddle);
    this.physics.add.collider(this.ball, this.computer, this.hitPaddle);

    // 6. Score Text
    this.scoreText = this.add
      .text(512, 50, "0 - 0", {
        fontSize: "50px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    // Initial instruction
    this.instructionsTxt = this.add
      .text(512, 410, "Click to Start", {
        fontSize: "40px",
        color: "#ffffffff",
        stroke: "#000000",
        strokeThickness: 8,
      })
      .setOrigin(0.5);
  }

  update(time: number, delta: number) {
    if (!this.gameStarted) return;

    // --- Player Controls ---
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-400);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(400);
    } else {
      this.player.setVelocityY(0);
    }

    // --- Computer AI ---
    // Simple AI: Move paddle towards ball Y
    if (this.ball.y < this.computer.y) {
      this.computer.setVelocityY(-250); // Speed limit creates difficulty
    } else if (this.ball.y > this.computer.y) {
      this.computer.setVelocityY(250);
    } else {
      this.computer.setVelocityY(0);
    }

    // --- Scoring Logic ---
    // Ball goes past player (Computer scores)
    if (this.ball.x < 20) {
      this.computerScore++;
      this.updateScore();
      this.stopSesion();
    }
    // Ball goes past computer (Player scores)
    else if (this.ball.x > 1010) {
      this.playerScore++;
      this.updateScore();
      this.stopSesion();
    }
  }

  hitPaddle(ball: any, paddle: any) {
    // Add a little randomness or speed increase on hit to make it interesting
    ball.setVelocityX(ball.body.velocity.x * 1.05); // Speed up slightly

    // Add spin effect based on where it hit the paddle
    let diff = 0;
    if (ball.y < paddle.y) {
      // Ball hit top half
      diff = paddle.y - ball.y;
      ball.setVelocityY(-10 * diff);
    } else if (ball.y > paddle.y) {
      // Ball hit bottom half
      diff = ball.y - paddle.y;
      ball.setVelocityY(10 * diff);
    }
  }

  stopSesion() {
    this.ball.setVelocity(0);
    this.ball.setPosition(512, 369);
    this.player.y = 369;
    this.computer.y = 369;
    this.gameStarted = false;

    this.player.setVelocity(0, 0);
    this.player.setPosition(50, 369);

    this.computer.setVelocity(0, 0);
    this.computer.setPosition(974, 369);
    this.instructionsTxt.visible = true;
  }

  launchBall() {
    this.instructionsTxt.visible = false;
    // Randomize start direction
    const dirX = Math.random() < 0.5 ? -1 : 1;
    const dirY = Math.random() < 0.5 ? -1 : 1;

    const speed = 300;
    this.ball.setVelocity(speed * dirX, speed * dirY);
  }

  updateScore() {
    this.scoreText.setText(this.playerScore + " - " + this.computerScore);
  }
}
