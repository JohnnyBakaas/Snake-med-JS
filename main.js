//x er diagonalt, "j" i en dobel for loop
//y er horisontalt, "i" i en dobel loop
//Globals

const keyCodeW = 87;
const keyCodeA = 65;
const keyCodeS = 83;
const keyCodeD = 68;

let tickrate = 200;

let ingame = false;

const isSamePosition = (p1, p2) => p1.x === p2.x && p1.y === p2.y;

//_________________________________________________________
//Controller

let velocity = {
  x: 0,
  y: 0,
};

const moveSnakeHead = () => {
  snake.snakeHead.x += velocity.x;
  snake.snakeHead.y += velocity.y;
};

const moveSnakeBodyparts = () => {
  if (snake.bodyparts.length == 0) {
  } else {
    for (let i = snake.bodyparts.length - 1; -1 < i; i--) {
      if (i == 0) {
        snake.bodyparts[i].x = snake.snakeHead.x;
        snake.bodyparts[i].y = snake.snakeHead.y;
      } else {
        snake.bodyparts[i].x = snake.bodyparts[i - 1].x;
        snake.bodyparts[i].y = snake.bodyparts[i - 1].y;
      }
    }
  }
};

const appleEatenCheck = () => {
  if (isSamePosition(snake.snakeHead, apple.position)) {
    return true;
  }
  return false;
};

const spawnApple = () => {
  const x = Math.floor(Math.random() * board.cols);
  const y = Math.floor(Math.random() * board.cols);
  if (isSamePosition(snake.snakeHead, { x, y })) {
    return spawnApple();
  }
  for (let i = 0; i < snake.bodyparts.length; i++) {
    if (isSamePosition(snake.bodyparts[i], { x, y })) {
      return spawnApple();
    }
  }

  apple.position = { x, y };
};

//position new bodypart start
let storedPositionX = undefined;
let storedPositionY = undefined;
const newSnakeBodyPartSavePosition = () => {
  storedPositionX = snake.bodyparts[snake.bodyparts.length - 1].x;
  storedPositionY = snake.bodyparts[snake.bodyparts.length - 1].y;

  //Fuck it!
  const arr = [];
  for (let i = 0; i < snake.bodyparts.length - 1; i++) {
    console.log("loop", i);
    arr.push(snake.bodyparts[i]);
  }
  //const obj = { x: 0, y: 0 };
  //arr.push(obj);
  console.log(snake.bodyparts);
};
const newSnakeBodyParLoadPosition = () => {
  snake.bodyparts.push({ x: storedPositionX, y: storedPositionY });
};
//position new bodypart end

//get WASD from user

const keyPressedHandler = (e) => {
  switch (e.key) {
    case "ArrowLeft":
      left();
      break;
    case "ArrowRight":
      right();
      break;
    case "ArrowUp":
      up();
      break;
    case "ArrowDown":
      down();
      break;
  }
};

//start up \/
const getSize = () => {
  let size = document.getElementById("boardsize-input");
  board.rows = size.value;
  board.cols = size.value;
};

const startGame = () => {
  getSize();
  ingame = true;
  snake.snakeHead.x = parseInt(board.cols / 2);
  snake.snakeHead.y = parseInt(board.cols / 2);

  //spawn board must be last
  new boardView("board").drawBoard();
  if (ingame) {
    console.log("funger plz");
    setInterval(newTick, tickrate);
  }
};

const newTick = () => {
  newSnakeBodyPartSavePosition();
  moveSnakeBodyparts();
  moveSnakeHead();
  if (appleEatenCheck()) {
    //TODO: sjekk at du ikke har vunnet dipshit
    spawnApple();
    new boardView("board").drawBoard();
    newSnakeBodyParLoadPosition();
  } else {
    new boardView("board").drawBoard();
  }
};

//experimental
const up = () => {
  velocity.y = -1;
  velocity.x = 0;
};
const down = () => {
  velocity.y = 1;
  velocity.x = 0;
};
const right = () => {
  velocity.x = 1;
  velocity.y = 0;
};
const left = () => {
  velocity.x = -1;
  velocity.y = 0;
};

//experimental
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
    { x: -1, y: 0 },
    { x: -2, y: 0 },
  ],
};

const apple = {
  position: { x: 1, y: 1 },
};

//_________________________________________________________
//View

function boardView(boardId) {
  const boardElement = document.getElementById(boardId);

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

let asdf = [];

window.addEventListener("keydown", keyPressedHandler);
