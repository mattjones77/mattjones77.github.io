// Parameters

const HEIGHT = 550; // pixels
const FPS = 60; // Frames per Second
const GRID_SIZE = 9; // Number of cells

// Derived Dimensions
const WIDTH = HEIGHT;
const CELL_SQUARE = WIDTH / 9; // size of squares
const STROKE = CELL_SQUARE / 24; // stroke width
const CELL_WIDTH = CELL_SQUARE * 3; // width of 9x9 cell
// Colors

const COLOR_BOARD = "white";
const COLOR_BORDER = "royalblue";
const COLOR_DOT = "sienna";
const COLOR_COMP = "crimson";
const COLOR_COMP_LIT = "lightpink";
const COLOR_PLAY = "royalblue";
const COLOR_PLAY_LIT = "lightsteelblue";
const COLOR_TIE = "black";

// Game Canvas
var canv = document.getElementById("canvas");
canv.height = HEIGHT;
canv.width = WIDTH;
document.body.appendChild(canv);
var canvRect = canv.getBoundingClientRect();

// Context
var ctx = canv.getContext("2d");
ctx.lineWidth = STROKE;
ctx.textAlign = "center";
ctx.textBaseline = "middle";

// Variables

// Start a new game
newGame();

// Event handlers

canv.addEventListener("mousemove", highlightGrid);
canv.addEventListener("click", click);

// Game loop

setInterval(loop, 1000 / FPS);

function loop() {
  drawBoard();
  drawSquares();
}

function click(/** @type {MouseEvent} */ ev) {
  console.log("Click!");
}

function drawBoard() {
  ctx.fillStyle = COLOR_BOARD;
  ctx.strokeStyle = COLOR_BORDER;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeRect(STROKE / 2, STROKE / 2, WIDTH - STROKE, HEIGHT - STROKE);

  for (let i = 0; i < GRID_SIZE; i++) {
    // squares
    ctx.lineWidth = STROKE;
    drawLine(getGridX(i), 0, getGridX(i), WIDTH);
    drawLine(0, getGridY(i), WIDTH, getGridY(i));
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      ctx.lineWidth = STROKE * 1.5;
      ctx.strokeRect(
        i * CELL_WIDTH,
        j * CELL_WIDTH,
        i + 1 * CELL_WIDTH,
        j + 1 * CELL_WIDTH
      );
    }
  }
  ctx.lineWidth = STROKE * 2;
}

function drawGrid() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {}
  }
}

function drawSquare(x, y, width) {
  ctx.strokeRect(
    x + stroke / 2,
    y + stroke / 2,
    width - stroke,
    width - stroke
  );
}

function drawLine(x0, y0, x1, y1, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

// function drawScores() {
//     let colComp = playersTurn ? COLOR_COMP_LIT : COLOR_COMP;
//     let colPlay = playersTurn ? COLOR_PLAY : COLOR_PLAY_LIT;
//     drawText(TEXT_PLAY, WIDTH * 0.25, MARGIN * 0.25, colPlay, TEXT_SIZE_TOP);
//     drawText(scorePlay, WIDTH * 0.25, MARGIN * 0.6, colPlay, TEXT_SIZE_TOP * 2);
//     drawText(TEXT_COMP, WIDTH * 0.75, MARGIN * 0.25, colComp, TEXT_SIZE_TOP);
//     drawText(scoreComp, WIDTH * 0.75, MARGIN * 0.6, colComp, TEXT_SIZE_TOP * 2);

//     // gameover text
//     if (timeEnd > 0) {
//         timeEnd--;

//         // handle a tie
//         if (scoreComp == scorePlay) {
//             drawText(TEXT_TIE, WIDTH * 0.5, MARGIN * 0.6, COLOR_TIE, TEXT_SIZE_TOP);
//         } else {
//             let playerWins = scorePlay > scoreComp;
//             let color = playerWins ? COLOR_PLAY : COLOR_COMP;
//             let player = playerWins ? TEXT_PLAY : TEXT_COMP;
//             drawText(player, WIDTH * 0.5, MARGIN * 0.5, color, TEXT_SIZE_TOP);
//             drawText(TEXT_WIN, WIDTH * 0.5, MARGIN * 0.7, color, TEXT_SIZE_TOP);
//         }

//         // new game
//         if (timeEnd == 0) {
//             newGame();
//         }
//     }

// }

function drawSquares() {
  for (let row of squares) {
    for (let square of row) {
      square.drawFill();
    }
  }
}

function drawText(text, x, y, color, size) {
  ctx.fillStyle = color;
  ctx.font = size + "px Arial";
  ctx.fillText(text, x, y);
}

function getColor(player, light) {
  if (player) {
    return light ? COLOR_PLAY_LIT : COLOR_PLAY;
  } else {
    return light ? COLOR_COMP_LIT : COLOR_COMP;
  }
}

function getText(player, small) {
  if (player) {
    return small ? TEXT_PLAY_SML : TEXT_PLAY;
  } else {
    return small ? TEXT_COMP_SML : TEXT_COMP;
  }
}

function getGridX(col) {
  return CELL_SQUARE * col;
}

function getGridY(row) {
  return CELL_SQUARE * row;
}

function highlightGrid(/** @type {MouseEvent} */ ev) {
  // get mouse position relative to the canvas
  let x = ev.clientX - canvRect.left;
  let y = ev.clientY - canvRect.top;
  //    highlight the squares
  highlightSquare(x, y);
}

function highlightSquare(x, y) {
  for (let row of squares) {
    for (let square of row) {
      square.highlight = false;
    }
  }
  let rows = squares.length;
  let cols = squares[0].length;

  OUTER: for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (squares[i][j].contains(x, y)) {
        squares[i][j].highlight = true;
        break OUTER;
      }
    }
  }
}

function newGame() {
  squares = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    squares[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      squares[i][j] = new Square(
        getGridX(i),
        getGridY(j),
        CELL_SQUARE,
        CELL_SQUARE
      );
    }
  }
}

// create square object constructor

function Square(x, y, w, h) {
  this.w = w;
  this.h = h;
  this.left = x;
  this.right = x + w;
  this.top = y;
  this.bot = y + h;
  this.num = null;
  this.highlight = false;
  this.numSelected = 0;

  this.contains = function (x, y) {
    return x >= this.left && x < this.right && y >= this.top && y < this.bot;
  };

  this.highlight = function () {};

  this.drawFill = function () {
    // light background
    let color = this.highlight ? "lightgreen" : "lightsteelblue";
    ctx.fillStyle = color;
    ctx.fillRect(
      this.left + STROKE,
      this.top + STROKE,
      this.w - STROKE * 2,
      this.h - STROKE * 2
    );
  };
}
