import { Scene } from "phaser";

export class Level3 extends Scene {
  exitBtn: Phaser.GameObjects.Text;
  ricochetImage: Phaser.GameObjects.Image;
  dialogueImage: Phaser.GameObjects.Image;
  instructionText: Phaser.GameObjects.Text;
  inputText: Phaser.GameObjects.Text;
  currentInput: string = "";

  constructor() {
    super({
      key: "Level3",
    });
  }

  create() {
    this.currentInput = "";

    // Set background color
    this.cameras.main.setBackgroundColor("#1a1a2e");

    // Display ricochet_robot.jpg image in the center
    this.ricochetImage = this.add.image(512, 384, "ricochetRobot");
    
    // Scale the image to fit nicely (adjust as needed based on actual image size)
    const scaleX = 800 / this.ricochetImage.width;
    const scaleY = 600 / this.ricochetImage.height;
    const scale = Math.min(scaleX, scaleY, 1); // Don't upscale beyond original size
    this.ricochetImage.setScale(scale);

    // Create dialogue image (initially hidden)
    this.dialogueImage = this.add.image(512, 384, "readmepart");
    this.dialogueImage.setVisible(false);
    // Scale dialogue image
    const dialogueScaleX = 900 / this.dialogueImage.width;
    const dialogueScaleY = 650 / this.dialogueImage.height;
    const dialogueScale = Math.min(dialogueScaleX, dialogueScaleY, 1);
    this.dialogueImage.setScale(dialogueScale);

    // Instruction text
    this.instructionText = this.add
      .text(512, 650, "Enter a number and press ENTER", {
        fontSize: "28px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Input display text
    this.inputText = this.add
      .text(512, 700, "Input: ", {
        fontSize: "32px",
        color: "#ffff00",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Exit button
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

    // Set up keyboard input
    if (this.input.keyboard) {
      this.input.keyboard.on("keydown", (event: KeyboardEvent) => {
        this.handleKeyDown(event);
      });
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    // Handle number input (0-9)
    if (event.key >= "0" && event.key <= "9") {
      this.currentInput += event.key;
      this.inputText.setText("Input: " + this.currentInput);
    }
    // Handle backspace
    else if (event.key === "Backspace") {
      this.currentInput = this.currentInput.slice(0, -1);
      this.inputText.setText("Input: " + this.currentInput);
    }
    // Handle enter key
    else if (event.key === "Enter") {
      this.checkInput();
    }
  }

  checkInput() {
    const inputNumber = Number.parseInt(this.currentInput);

    if (inputNumber === 12) {
      // Correct answer - show dialogue.png
      this.dialogueImage.setVisible(true);
      this.ricochetImage.setVisible(false);
      this.instructionText.setText("Correct! Press EXIT to continue");
      this.inputText.setVisible(false);
    } else {
      // Incorrect answer - show nothing (just reset input)
      this.currentInput = "";
      this.inputText.setText("Input: ");
      
      // Optional: flash the input text red briefly to indicate wrong answer
      this.inputText.setColor("#ff0000");
      this.time.delayedCall(200, () => {
        this.inputText.setColor("#ffff00");
      });
    }
  }
}

