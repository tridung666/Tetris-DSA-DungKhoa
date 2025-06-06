export default class View {
    static colors = {
        I: "#00ffff",
        J: "#0000ff",
        L: "#ff7f00",
        O: "#ffff00",
        S: "#00ff00",
        T: "#800080",
        Z: "#ff0000",
    };

    constructor({ element, width, height, rows, columns }) {
        //Render game
        this.element = element;
        this.width = width;
        this.height = height;
    
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext("2d");
    
        this.playfieldBorderWidth = 4;
        this.playfieldX = this.width / 4;
        this.playfieldY = this.playfieldBorderWidth;
        this.playfieldWidth = (this.width * 2) / 4;
        this.playfieldHeight = this.height - this.playfieldBorderWidth * 2;
        this.playfieldInnerWidth =
          this.playfieldWidth - this.playfieldBorderWidth * 2;
        this.playfieldInnerHeight =
          this.playfieldHeight - this.playfieldBorderWidth * 2;
    
        this.blockWidth = this.playfieldInnerWidth / columns;
        this.blockHeight = this.playfieldInnerHeight / rows;
        // Render on Right Side
        this.panelX = this.playfieldWidth + 185;
        this.panelY = 0;
        // Render on Left Side
        this.panelX1 = 0;
        this.panelY1 = 0; // Updated position for high score panel
    
        this.panelWidth =  500;
        
        // adjusted size to fit the screen properly
        this.panelHeight = this.height;
    
        this.element.appendChild(this.canvas);
        //End render
    
        //For game logic
        this.isGameActive = false;
        //show name in welcome message
        this.userInput = "";
    
        document.getElementById("name").addEventListener("input", (event) => {
          this.userInput = event.target.value;
          this.renderWelcomeScreen();
        });
    
        document.getElementById("name").focus();
        //end show name
      }


    on(event, handler) {
        document.addEventListener(event, handler);
    }

    renderWelcomeScreen() {
        this.context.clearRect(0, 0, this.width, this.height);

        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = "white";
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText("WELCOME", this.width / 2, this.height / 2 - 30);

        this.context.fillText("Enter your name ", this.width / 2, this.height / 2);

        this.context.fillText(this.userInput, this.width / 2, this.height / 2 + 30);

        const inputName = document.getElementById("name-background");
        inputName.style.display = "block";

        //<----- Render background ----->//
        const background = document.getElementById("background");
        background.style.display = "block";
        //<----- End Render background ----->//
    }

    renderStartScreen() {
        this._clearScreen();

        this.context.fillStyle = "white";
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText("TUTORIAL", this.width / 2, this.height / 3);

        // Render tutorial text below the "Press ENTER to Start" text
        this.context.font = '13px "Press Start 2P"';
        this.context.textAlign = "left";
        this.context.textBaseline = "middle";

        this.context.fillText(
            "* Use the 🡸|🡺 to move left and right",
            this.width / 2 - 230,
            this.height / 2
        );

        this.context.fillText(
            "* Use the ↑ to rotate 90° clockwise ",
            this.width / 2 - 230,
            this.height / 2 + 30
        );

        this.context.fillText(
            "* Use Space to drop down",
            this.width / 2 - 230,
            this.height / 2 + 60
        );

        this.context.fillText(
            "* Use C to hold the Piece",
            this.width / 2 - 230,
            this.height / 2 + 90
        );

        this.context.fillText(
            "* Use U to undo",
            this.width / 2 - 230,
            this.height / 2 + 120
        );

        this.context.fillText(
            "* Use R to restart",
            this.width / 2 - 230,
            this.height / 2 + 150
        );

        const background = document.getElementById("background");
        background.style.display = "none";
    }

    renderChoosingDifficulty() {
        this.isGameActive = false;
        this._clearScreen();

        this.context.fillStyle = "white";
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText("Choose Difficulty", this.width / 2, this.height / 3);

        this.context.font = '16px "Press Start 2P"';
        this.context.fillText("Press E for EASY", this.width / 2, this.height / 2);

        this.context.fillText(
            "Press N for NORMAL",
            this.width / 2,
            this.height / 2 + 40
        );

        this.context.fillText(
            "Press H for HARD",
            this.width / 2,
            this.height / 2 + 80
        );

        // Listen to user input
        const handleKeydown = (event) => {
            if (!this.isGameActive) {
                if (event.key.toLowerCase() === "e" || event.key === "Enter") {
                    document.dispatchEvent(
                        new CustomEvent("difficultySelected", { detail: "easy" })
                    );
                } else if (event.key.toLowerCase() === "n") {
                    document.dispatchEvent(
                        new CustomEvent("difficultySelected", { detail: "normal" })
                    );
                } else if (event.key.toLowerCase() === "h") {
                    document.dispatchEvent(
                        new CustomEvent("difficultySelected", { detail: "hard" })
                    );
                }
            }
        };

        // Add the event listener
        document.addEventListener("keydown", handleKeydown);
    }
    renderMainScreen(state) {
        this.isGameActive = true;
        this._clearScreen();
        this._renderHighScore(state);
        this._renderBorder();
        this._renderPlayfield(state);
        this._renderGrid(); // render the grid after playfield
        this._renderPanel(state);
    }
    renderPauseScreen() {
        this._clearScreen("rgba(0, 0, 0, 0.75)");

        this.context.fillStyle = "white";
        this.context.font = '16px "Press Start 2P"';
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText("PAUSE", this.width / 2, this.height / 2 - 48);
        this.context.fillText(
            "Press ENTER to Resume",
            this.width / 2,
            this.height / 2
        );
        this.context.fillText(
            "Press R to Restart",
            this.width / 2,
            this.height / 2 + 48
        );
        this.context.fillText(
            "Press M to MUTE ALL",
            this.width / 2,
            this.height / 2 + 96
        );

        // This allows when in rendering pause screen then background is hidden
        const background = document.getElementById("background");
        background.style.display = "none";

        //<----- Render highscore ----->//
        // This allows when in rendering pause screen then highscore box is blur
        const highscore = document.getElementById("highscore-box");
        highscore.style.opacity = "0.2";

        // This allows when in render pause screen then highscore box is blur
        const highscore_2 = document.getElementById("highscore-box-2");
        highscore_2.style.opacity = "0.2";
        //<----- End Render highscore ----->//
    }
    bubbleSort(arr) {
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - i - 1; j++) {
                if (arr[j]._score < arr[j + 1]._score) {
                    let tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                }
            }
        }
        return arr;
    }

    renderEndScreen({ scoreArr }) {
        //<----- Render highscore-box and background ----->//
        const highscoreBox = document.getElementById("highscore-box");
        highscoreBox.style.display = "none";

        const highscoreBox_2 = document.getElementById("highscore-box-2");
        highscoreBox_2.style.display = "none";

        const highscoreBox_3 = document.getElementById("highscore-box-3");
        highscoreBox_3.style.display = "block";

        const inputName = document.getElementById("name-background");
        inputName.style.display = "block";

        const background_3 = document.getElementById("background-3");
        background_3.style.display = "block";

        const background = document.getElementById("background");
        background.style.display = "none";

        const background_2 = document.getElementById("background-2");
        background_2.style.display = "none";
        //<----- End Render highscore-box and background ----->//

        this._clearScreen();
        this.bubbleSort(scoreArr);
        this.context.fillStyle = "white";
        this.context.font = '15px "Press Start 2P"';
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText("GAME OVER", this.width / 2, this.height / 2 - 100);

        this.context.fillText(
            `Name: ${scoreArr[0]._name}`,
            this.width / 2 - 110,
            this.height / 2 - 50
        );

        this.context.fillText(
            `Score: ${scoreArr[0]._score}`,
            this.width / 2 + 110,
            this.height / 2 - 50
        );

        this.context.fillText(
            `Name: ${scoreArr[1]._name}`,
            this.width / 2 - 110,
            this.height / 2
        );

        this.context.fillText(
            `Score: ${scoreArr[1]._score}`,
            this.width / 2 + 110,
            this.height / 2
        );

        this.context.fillText(
            `Name: ${scoreArr[2]._name}`,
            this.width / 2 - 110,
            this.height / 2 + 50
        );

        this.context.fillText(
            `Score: ${scoreArr[2]._score}`,
            this.width / 2 + 110,
            this.height / 2 + 50
        );

        this.context.fillText(
            "Press ENTER to Restart",
            this.width / 2,
            this.height / 2 + 200
        );
    }

    _clearScreen(color = "black") {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    _renderBorder() {
        // Define the border
        const borderX = this.playfieldX - this.playfieldBorderWidth;
        const borderY = this.playfieldY - this.playfieldBorderWidth;
        const borderWidth = this.playfieldWidth + this.playfieldBorderWidth * 2 - 8;
        const borderHeight =
            this.playfieldHeight + this.playfieldBorderWidth * 2 - 8;

        this.context.strokeStyle = "white";
        this.context.lineWidth = this.playfieldBorderWidth;
        this.context.strokeRect(borderX, borderY, borderWidth, borderHeight);
    }

    // Left Side of Play Field
    _renderHighScore({ scoreArr }) {
        let scoreArr1 = [
            {
                _name: scoreArr[0]._name,
                _score: scoreArr[0]._score,
            },
            {
                _name: scoreArr[1]._name,
                _score: scoreArr[1]._score,
            },
            {
                _name: scoreArr[2]._name,
                _score: scoreArr[2]._score,
            },
            {
                _name: scoreArr[3]._name,
                _score: scoreArr[3]._score,
            },
            {
                _name: scoreArr[4]._name,
                _score: scoreArr[4]._score,
            },
        ];

        this.bubbleSort(scoreArr1);
        this.context.textAlign = "start";
        this.context.textBaseline = "top";
        this.context.fillStyle = "white";
        this.context.font = '14px "Press Start 2P"';

        // Title
        this.context.fillText("High Scores", this.panelX1, this.panelY1 + 10);

        // Content
        this.context.fillStyle = "#EBC931";

        // 1st
        this.context.fillText("1st", this.panelX1, this.panelY1 + 40);
        this.context.fillText(
            `Name:${scoreArr1[0]._name}`,
            this.panelX1,
            this.panelY1 + 60
        );
        this.context.fillText(
            `Score: ${scoreArr1[0]._score}`,
            this.panelX1,
            this.panelY1 + 80
        );

        // 2nd
        this.context.fillStyle = "#c0c0c0";
        this.context.fillText("2nd", this.panelX1, this.panelY1 + 110);
        this.context.fillText(
            `Name:${scoreArr1[1]._name}`,
            this.panelX1,
            this.panelY1 + 130
        );
        this.context.fillText(
            `Score: ${scoreArr1[1]._score}`,
            this.panelX1,
            this.panelY1 + 150
        );

        // 3rd
        this.context.fillStyle = "#cc6600";
        this.context.fillText("3rd", this.panelX1, this.panelY1 + 180);
        this.context.fillText(
            `Name:${scoreArr1[2]._name}`,
            this.panelX1,
            this.panelY1 + 200
        );
        this.context.fillText(
            `Score: ${scoreArr1[2]._score}`,
            this.panelX1,
            this.panelY1 + 220
        );
    }

    _renderPlayfield({ playfield, activePiece, ghostPiece }) {
        for (let y = 0; y < playfield.length; y++) {
          const line = playfield[y];
    
          for (let x = 0; x < line.length; x++) {
            const block = playfield[y][x];
    
            if (block) {
              this._renderBlock({
                x: this.playfieldX + x * this.blockWidth,
                y: this.playfieldY + y * this.blockHeight,
                width: this.blockWidth,
                height: this.blockHeight,
                color: View.colors[block.type],
              });
            }
          }
        }
    
        // Active Piece
        this._renderPiece(activePiece, {
          x: this.playfieldX,
          y: this.playfieldY,
          width: this.blockWidth,
          height: this.blockHeight,
        });
    
        // Ghost Piece
        this._renderPiece(ghostPiece, {
          x: this.playfieldX,
          y: this.playfieldY,
          width: this.blockWidth,
          height: this.blockHeight,
          color: "rgba(127,127,127,0.5)",
        }); // Render the ghost piece in a different style
    
        const inputName = document.getElementById("name-background");
        inputName.style.display = "none";
    
        //<----- Render highscore-box ----->//
        const highscore = document.getElementById("highscore-box");
        highscore.style.opacity = "1";
    
        const highscore_2 = document.getElementById("highscore-box-2");
        highscore_2.style.opacity = "1";
        //<----- End Render highscore-box ----->//
      }

    _renderPanel({ level, score, lines, nextPieces, holdPiece }) {
        this.context.textAlign = "start";
        this.context.textBaseline = "top";
        this.context.fillStyle = "white";
        this.context.font = '13px "Press Start 2P"';
    
        this.context.fillText(
            `Level: ${level}`,
            this.panelX + 15,
            this.panelY + 10
        );
        this.context.fillText(
            `Score: ${score}`,
            this.panelX + 15,
            this.panelY + 34
        );
        this.context.fillText(
            `Lines: ${lines}`,
            this.panelX + 15,
            this.panelY + 58
        );
        this.context.fillText("Next:", this.panelX + 15, this.panelY + 106);
        this.context.fillText("Hold:", this.panelX + 15, this.panelY + 202);
    
        if (nextPieces) {
            this._renderNextPieces(nextPieces);
        }
    
        if (holdPiece) {
            this._renderPiece(holdPiece, {
                x: this.panelX + 15,
                y: this.panelY + 226,
                width: this.blockWidth * 0.5,
                height: this.blockHeight * 0.5,
                color: View.colors[holdPiece.type]
            });
        }
    }

    _renderNextPieces(nextPieces) {
        if (!nextPieces || !nextPieces.items) {
            return;
        }
    
        const pieces = nextPieces.items.slice(0, 3);
        
        pieces.forEach((piece, index) => {
            if (!piece || !piece.blocks) {
                return;
            }
            
            // Render pieces horizontally with adjusted spacing
            this._renderPiece(piece, {
                x: this.panelX + 7

                 + (index * 60),  // Horizontal spacing
                y: this.panelY + 130,                // Fixed vertical position
                width: this.blockWidth * 0.4,
                height: this.blockHeight * 0.4
                ,
                color: View.colors[piece.type]
            });
        });
    }
    _renderPiece(
        piece,
        { x, y, width = this.blockWidth, height = this.blockHeight, color = null }
      ) {
        for (let block of piece) {
          if (block) {
            this._renderBlock({
              x: x + block.x * width,
              y: y + block.y * height,
              width,
              height,
              color: color || View.colors[block.type],
            });
          }
        }
      }


    _renderBlock({ x, y, width, height, color, lineWidth }) {
        this.context.fillStyle = color;
        this.context.strokeStyle = "black";
        this.context.lineWidth = lineWidth;
    
        // Draw the main block
        this.context.fillRect(x, y, width, height);
    
        // Apply an "outer" shadow by drawing a 1px outline
        this.context.shadowColor = "rgba(0, 0, 0, 0.9)";
        this.context.shadowBlur = 0;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.strokeRect(x, y, width, height);
    
        // Apply an "inner" shadow effect
        // Draw four thin, clear rectangles around the inside of the main block to simulate an "inset" shadow
        this.context.shadowColor = "rgba(255, 255, 255, 0.2)";
        this.context.fillRect(x + 1, y, width - 2, 1); // top
        this.context.fillRect(x + 1, y + height - 1, width - 2, 1); // bottom
        this.context.fillRect(x, y + 1, 1, height - 2); // left
        this.context.fillRect(x + width - 1, y + 1, 1, height - 2); // right
    
        // Reset shadow properties
        this.context.shadowColor = "transparent";
    }
    _renderGrid() {
        this.context.strokeStyle = "white";
        this.context.lineWidth = 0.5;

        // Vertical lines
        for (let i = 0; i <= this.playfieldInnerWidth; i += this.blockWidth) {
            this.context.beginPath();
            this.context.moveTo(this.playfieldX + i, this.playfieldY);
            this.context.lineTo(
                this.playfieldX + i,
                this.playfieldY + this.playfieldInnerHeight
            );
            this.context.stroke();
        }

        // Horizontal lines
        for (let i = 0; i <= this.playfieldInnerHeight; i += this.blockHeight) {
            this.context.beginPath();
            this.context.moveTo(this.playfieldX, this.playfieldY + i);
            this.context.lineTo(
                this.playfieldX + this.playfieldInnerWidth,
                this.playfieldY + i
            );
            this.context.stroke();
        }
    }
}

