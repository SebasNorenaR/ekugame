import { Scene } from "phaser";

export class Level2 extends Scene {
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  exitBtn: Phaser.GameObjects.Text;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  bricks: Phaser.Physics.Arcade.StaticGroup;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  gameStarted: boolean = false;
  scoreText: Phaser.GameObjects.Text;
  livesText: Phaser.GameObjects.Text;
  instructionsTxt: Phaser.GameObjects.Text;
  score: number = 0;
  lives: number = 3;
  readmeImage: Phaser.GameObjects.Image;
  winMessage: Phaser.GameObjects.Text;
  hasWon: boolean = false;

  constructor() {
    super({
      key: "Level2",
      physics: {
        arcade: {
          gravity: { x: 0, y: 0 },
        },
      },
    });
  }

  create() {
    this.gameStarted = false;
    this.score = 0;
    this.lives = 3;
    this.hasWon = false;

    this.background = this.add.image(0, 0, "arkanoidBg");
    this.background.setOrigin(0);
    this.background.tint = 0xadadad;

    // Create Graphics
    let graphics = this.add.graphics();

    // Paddle texture (Horizontal)
    graphics.fillStyle(0x00ff00, 1); // Green paddle
    graphics.fillRect(0, 0, 120, 20);
    graphics.generateTexture("paddleBreakout", 120, 20);

    // Ball texture
    graphics.clear();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(0, 0, 20, 20);
    graphics.generateTexture("ballImg", 20, 20);

    // Brick texture
    graphics.clear();
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(0, 0, 60, 30);
    graphics.generateTexture("brickImg", 60, 30);

    graphics.destroy();

    // 2. Create Objects
    // Player Paddle (Bottom Center)
    this.player = this.physics.add.sprite(512, 700, "paddleBreakout");
    this.player.setImmovable(true);
    this.player.setCollideWorldBounds(true);
    this.player.tint = 0xfcc603;

    const ballParticles = this.add.particles(0, 0, "ekumenLogo", {
      speed: 100,
      scale: { start: 0.015, end: 0 },
      // blendMode: "ADD",
    });

    // Ball (Starts above paddle)
    this.ball = this.physics.add.sprite(512, 660, "ballImg");
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1, 1);
    this.ball.tint = 0xfcc603;

    ballParticles.startFollow(this.ball);

    // Disable collision on the bottom of the world so we can detect "Game Over" manually
    this.physics.world.checkCollision.down = false;

    // Bricks Group
    this.bricks = this.physics.add.staticGroup();
    this.createBricks();

    // 3. Input Events
    if (this.input.keyboard === null) {
      throw new Error("No keyboard detected!");
    }
    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.on("pointerdown", () => {
      if (!this.gameStarted) {
        this.launchBall();
        this.gameStarted = true;
        this.instructionsTxt.visible = false;
      }
    });

    // 4. Collisions
    this.physics.add.collider(
      this.ball,
      this.player,
      this.hitPaddle,
      undefined,
      this
    );
    this.physics.add.collider(
      this.ball,
      this.bricks,
      this.hitBrick,
      undefined,
      this
    );

    // Initial instruction
    this.instructionsTxt = this.add
      .text(512, 410, "Click to Start, Arrows to move", {
        fontSize: "40px",
        color: "#ffffffff",
        stroke: "#000000",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

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
    this.exitBtn.on("pointerover", () =>
      this.exitBtn.setStyle({ fill: "yellow" })
    );
    this.exitBtn.on("pointerout", () =>
      this.exitBtn.setStyle({ fill: "white" })
    );

    this.scoreText = this.add.text(800, 20, "Score: 0", {
      fontSize: "30px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
    });

    this.livesText = this.add.text(800, 60, "Lives: 3", {
      fontSize: "30px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
    });

    // Create readme image (initially hidden)
    this.readmeImage = this.add.image(512, 384, "readmepart");
    this.readmeImage.setVisible(false);
    this.readmeImage.setDepth(100); // Ensure it's on top
    const readmeScaleX = 900 / this.readmeImage.width;
    const readmeScaleY = 650 / this.readmeImage.height;
    const readmeScale = Math.min(readmeScaleX, readmeScaleY, 1);
    this.readmeImage.setScale(readmeScale);

    // Win message (initially hidden)
    this.winMessage = this.add
      .text(512, 700, "You Won! Press EXIT to continue", {
        fontSize: "32px",
        color: "#fefefeff",
        stroke: "#000000",
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setDepth(101)
      .setVisible(false);

    this.hasWon = false;
  }

  createBricks() {
    // Create a 10x5 grid of bricks
    const startX = 142; // Center alignment
    const startY = 150;

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 10; x++) {
        const brickX = startX + x * 80; // 60 width + 20 gap
        const brickY = startY + y * 50; // 30 height + 20 gap

        const brick = this.bricks.create(brickX, brickY, "brickImg");

        // Color tint based on row
        const colors = [0xff0000, 0xffa500, 0xffff00, 0xff0000, 0xff0000];
        brick.setTint(colors[y]);
        brick.refreshBody();
      }
    }
  }

  update(time: number, delta: number) {
    if (!this.gameStarted) {
      // Keep ball glued to paddle before launch
      this.ball.x = this.player.x;
      return;
    }

    // --- Player Controls (Left/Right only) ---
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-600);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(600);
    } else {
      this.player.setVelocityX(0);
    }

    // --- Death Logic ---
    // If ball falls below the screen height (768)
    if (this.ball.y > 800) {
      this.handleLifeLost();
    }
  }

  hitPaddle(ball: any, paddle: any) {
    let diff = 0;

    // Add ball spin based on where it hit the paddle
    if (ball.x < paddle.x) {
      // Hit left side
      diff = paddle.x - ball.x;
      ball.setVelocityX(-10 * diff);
    } else if (ball.x > paddle.x) {
      // Hit right side
      diff = ball.x - paddle.x;
      ball.setVelocityX(10 * diff);
    } else {
      // Hit dead center - add tiny random jitter to prevent vertical loops
      ball.setVelocityX(2 + Math.random() * 8);
    }
  }

  hitBrick(ball: any, brick: any) {
    brick.disableBody(true, true); // Hide and disable collision
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    // Win condition: Show win screen if score is more than 150
    if (this.score > 150 && !this.hasWon) {
      this.hasWon = true;
      this.showWinScreen();
    }
  }

  handleLifeLost() {
    this.lives--;
    this.livesText.setText("Lives: " + this.lives);
    this.gameStarted = false;

    // Stop objects
    this.ball.setVelocity(0, 0);
    this.player.setVelocity(0, 0);

    // Reset positions
    this.player.setPosition(512, 700);
    this.ball.setPosition(512, 660);

    if (this.lives <= 0) {
      this.resetGame();
    }
    this.instructionsTxt.visible = true;
  }

  resetGame() {
    this.score = 0;
    this.lives = 3;
    this.scoreText.setText("Score: 0");
    this.livesText.setText("Lives: 3");
    this.gameStarted = false;

    // Respawn bricks
    this.bricks.children.iterate((child: any) => {
      child.enableBody(true, child.x, child.y, true, true);
      return true;
    });

    this.player.setPosition(512, 700);
    this.ball.setPosition(512, 660);
    this.ball.setVelocity(0, 0);
  }

  launchBall() {
    const dirX = Math.random() < 0.5 ? -1 : 1;
    // Launch upwards
    this.ball.setVelocity(200 * dirX, -500);
  }

  showWinScreen() {
    // Stop the game
    this.gameStarted = false;
    this.ball.setVelocity(0, 0);
    this.player.setVelocity(0, 0);
    
    // Show win elements
    this.readmeImage.setVisible(true);
    this.winMessage.setVisible(true);
    this.instructionsTxt.setVisible(false);
    
    // Set win flag in registry
    this.registry.set("level2Won", true);
  }
}
