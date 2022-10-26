//x er diagonalt, "j" i en dobel for loop
//y er horisontalt, "i" i en dobel loop
//Globals

let tickRate = 1000;

//_________________________________________________________
//Controller

const getSize = () => {
  let size = document.getElementById("boardsize-input");
  board.rows = size.value;
  board.cols = size.value;
};

const startGame = () => {
  getSize();

  snake.snakeHead.x = parseInt(board.cols / 2);
  snake.snakeHead.y = parseInt(board.cols / 2);
  console.log(snake.snakeHead.x);

  //spawn board must be on botom
  new boardView("board").drawBoard();
};

document.getElementById("boardsize-comit").addEventListener("click", startGame);
//_________________________________________________________
//Model

const board = {
  rows: 10,
  cols: 10,
};

const snake = {
  snakeHead: { x: 0, y: 0 },
  bodyparts: [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ],
};

const apple = {
  position: { x: 6, y: 9 },
};

//_________________________________________________________
//View

function boardView(boardId) {
  const boardElement = document.getElementById(boardId);

  const isSamePosition = (p1, p2) => p1.x === p2.x && p1.y === p2.y;

  let rowIndex = 0;

  const createDiv = (className) => {
    let row = document.getElementById(rowIndex.toString());
    let node = document.createElement("div");
    node.classList.add(className);
    node.classList.add("square");
    row.classList.add("row");
    row.appendChild(node);
  };

  const drawSquare = (x, y) => {
    if (isSamePosition(snake.snakeHead, { x, y })) {
      createDiv("snake-head");
    } else if (isSamePosition(apple.position, { x, y })) {
      createDiv("apple");
    } else {
      let isRegular = true;

      snake.bodyparts.forEach((element) => {
        if (isSamePosition(element, { x, y })) {
          createDiv("snake-body");
          isRegular = false;
        }
      });
      if (isRegular) {
        createDiv("regular");
      }
    }
  };

  this.drawBoard = () => {
    clearBoard();
    for (let i = 0; i < board.rows; i++) {
      rowIndex = i;
      let rowDiv = document.createElement("div");
      rowDiv.setAttribute("id", i.toString());
      boardElement.appendChild(rowDiv);
      for (let j = 0; j < board.cols; j++) {
        drawSquare(j, i);
      }
    }
  };

  const clearBoard = () => {
    boardElement.innerHTML = "";
  };
}

new boardView("board").drawBoard();
