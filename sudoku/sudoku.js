// Parameters

const HEIGHT = 550; // pixels
const FPS = 60; // Frames per Second
const GRID_SIZE = 9; // Number of cells

// Derived Dimensions
const WIDTH = HEIGHT;
const CELL_SQUARE = WIDTH / 9; // size of squares
const STROKE = CELL_SQUARE / 96; // stroke width
const CELL_WIDTH = CELL_SQUARE * 3; // width of 9x9 cell


// Colors
const COLOR_BOARD = "white";
const COLOR_BORDER = "black";
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
newGame(null);

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
  revealNumber();
}

// Drawing Functions

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

function revealNumber() {
  let rows = squares.length;
  let cols = squares[0].length;

  OUTER: for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (squares[i][j].highlight) {
        squares[i][j].clicked = true;
        break OUTER;
      }
    }
  }
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
      if ( squares[i][j].contains(x, y)) {
        squares[i][j].highlight = true;
        break OUTER;
      }
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function newGame(game) {
  squares = [];
  sudoku = newSudoku(game);
  for (let i = 0; i < GRID_SIZE; i++) {
    squares[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      squares[i][j] = new Square(
        getGridX(i),
        getGridY(j),
        CELL_SQUARE,
        CELL_SQUARE,
        sudoku.get(i, j)
      )
      
      squares[i][j].clicked = true;
    }
  }
}

// File Load

let input = document.querySelector('input');


input.addEventListener('change', () => { 
  let files = input.files; 

  if (files.length == 0) return; 
 
  const file = files[0]; 

  let reader = new FileReader(); 

  reader.onload = (e) => { 
      const file = e.target.result; 
      const lines = file.split(/\r\n|\n/); 
      console.log(lines.join('\n')); 
      newGame(lines);

  }; 

  reader.onerror = (e) => alert(e.target.error.name); 

  reader.readAsText(file); 
}); 

// set up sudoku numbers

function newSudoku(game) {
  arr = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    arr[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      if (game === null){
        arr[i][j] = getRandomInt(9);
      }
      else {
        arr[i][j] = game[i][j];
      }
    }
  }
  return new Sudoku(arr);
}

function Sudoku(arr) {
  this.arr = arr;

  this.get = function (x, y) {
    return arr[x][y];
  };

  this.checkMatches = function (rowNum, colNum, num) {
    // checks a column for matches
    console.log("----- CHECKING ROW -----");
    for (let i = 0; i < 9; i++) {
      console.log(arr[i][rowNum]);
      if (arr[i][rowNum] == num && i != rowNum) {
        return true;
      }
    }
    // checks a row for matches
    console.log("----- CHECKING COL -----");
    for (let j = 0; j < 9; j++) {
      console.log(arr[colNum][j]);
      if (arr[colNum][j] == num && j != colNum) {
        return true;
      }
    }

     // checks a cell for matches
     console.log("----- CHECKING CELL -----");
     for (let k = 0; k < 3; k++) {
      for (let l = 0; l < 3; l++ ){
        //  colNum - (colNum % 3) + k, rowNum - (rowNum % 3) + l); The magic code
         console.log(arr[colNum - (colNum % 3) + k][ rowNum - (rowNum % 3) + l]);
         if (arr[colNum - (colNum % 3) + k][ rowNum - (rowNum % 3) + l] == num && k != colNum && l != rowNum) {
         return true;
         }
      }
     }
  return false; // no match
  };
}

// create square object constructor

function Square(x, y, w, h, num) {
  this.w = w;
  this.h = h;
  this.left = x;
  this.right = x + w;
  this.top = y;
  this.bot = y + h;
  this.num = num;
  this.highlight = false;
  this.clicked = false;

  this.contains = function (x, y) {
    if (x >= this.left && x < this.right && y >= this.top && y < this.bot){
      if (!this.clicked) {this.num = this.getSmall(x, y);}
      return true
  };
  };

  this.getSmall = function(x, y) {
    if (y < this.h/3 + this.top){
      if( x < this.w/3 + this.left){
        return 1;
      } else if (x < (this.w/3 * 2) + this.left) {
        return 2;
      } else return 3;

    } else  if (y < (this.h/3 * 2) + this.top){
      if( x < this.w/3 + this.left){
        return 4;
      } else if (x < (this.w/3 * 2) + this.left) {
        return 5;
      } else return 6;

    } else{
      if( x < this.w/3 + this.left){
        return 7;
      } else if (x < (this.w/3 * 2) + this.left) {
        return 8;
      } else return 9;
  }
};


  this.drawFill = function () {
    let color = this.highlight ? "lightgreen" : "ivory";

    ctx.fillStyle = color;
    ctx.fillRect(
      this.left + STROKE,
      this.top + STROKE,
      this.w - STROKE * 2,
      this.h - STROKE * 2
    );

    // if (this.highlight && !this.clicked) {
    //   // draw numbers
    //   drawText(
    //     this.num,
    //     this.left + this.w / 2,
    //     this.top + this.h / 2,
    //     "grey",
    //     30
    //   );
    // }
    // if (this.clicked) {
    //   // draw numbers
    //   drawText(
    //     this.num,
    //     this.left + this.w / 2,
    //     this.top + this.h / 2,
    //     "black",
    //     30
    //   );
    // }
    drawText(
      this.num,
      this.left + this.w / 2,
      this.top + this.h / 2,
      "black",
      30
    );
  };
}
