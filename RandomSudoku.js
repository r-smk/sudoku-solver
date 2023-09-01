// -------------- Helper functions here ----------------------

// Generates a random from [min, max]
function randomNumber(min, max) {
  if (max < min) {
    throw Error("Max Value Should not be less than Min");
  }

  return min + Math.floor(Math.random() * (max - min + 1));
}

// Shuffling the array elements inline.
function shuffleArray(arr) {
  const length = arr.length;
  for (let index = 0; index < length; index++) {
    const randomIndex = randomNumber(0, length - 1);
    const temp = arr[index];
    arr[index] = arr[randomIndex];
    arr[randomIndex] = temp;
  }
  return arr;
}

// shuffles the array [1,2,3...9] and returns it;
function getRandomSudokuRow() {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(arr);
  return arr;
}

function fillBoxWithRandomValues(sudokuBoard, boxRow, boxCol) {
  const row = boxRow * 3;
  const col = boxCol * 3;

  const values = getRandomSudokuRow();
  for (let i = 0; i < 9; i++) {
    const r = row + Math.floor(i / 3);
    const c = col + (i % 3);

    sudokuBoard[r][c] = values[i];
  }
}

function getSudokuCopy(sudoku) {
  const copy = [];
  for (const row of sudoku) {
    copy.push([...row]);
  }
  return copy;
}

// Here we are randomly choosing three boxes in each row respectively
// and filling each box randomly from 1 to 9.
function initThreeRandomBoxes(sudokuBoard) {
  const randomPositions = shuffleArray([0, 1, 2]);

  for (let row = 0; row < 3; row++) {
    fillBoxWithRandomValues(sudokuBoard, row, randomPositions[row]);
  }
}

function generateRandomSudoku(level = 1) {
  const sudokuBoard = [];

  // Initializing the 9*9 sudoku with all 0's
  for (let i = 0; i < 9; i++) {
    const row = new Array(9);
    for (let j = 0; j < 9; j++) {
      row[j] = 0;
    }
    sudokuBoard.push(row);
  }

  initThreeRandomBoxes(sudokuBoard);

  //   This will make the sudoku to be more random
  const values = getRandomSudokuRow();
  solveSudoku(sudokuBoard, 0, true, values);

  let sudokuBoardCopy = getSudokuCopy(sudokuBoard);
  generateSolvableSudoku(sudokuBoardCopy, level);

  // sudokuBoard is the solution
  // sudokuBoardCopy is the generated sudoku question
  return [sudokuBoard, sudokuBoardCopy];
}

function isSolvableSudoku(sudokuBoard) {
  const sudokuBoardCopy = getSudokuCopy(sudokuBoard);
  numOfSols = 0;
  solveSudoku(sudokuBoardCopy, 0);

  return numOfSols == 1;
}

function generateSolvableSudoku(sudokuBoard, level = 1) {
  const availableIndexes = new Array(81);

  // Initialising available indexes of sudoku
  // Availabe index means the cell doesn't contain 0 or not an empty cell.
  for (let index = 0; index < 81; index++) {
    availableIndexes[index] = index;
  }

  // Here I won't delete values from the availableIndexes array i will keep track with the variable "end"
  // "end" indicates the end of the availableIndexes array(even though it contains 81 elements)
  let end = availableIndexes.length - 1;

  // Shuffling it to make more random to pick
  shuffleArray(availableIndexes);

  // 99.99% end will not be 0
  while (level) {
    const randomIndex = randomNumber(0, end);
    const index = availableIndexes[randomIndex];

    const r = Math.floor(index / 9);
    const c = index % 9;
    const value = sudokuBoard[r][c];

    sudokuBoard[r][c] = 0;

    if (!isSolvableSudoku(sudokuBoard)) {
      sudokuBoard[r][c] = value;
      level--;
      continue;
    }

    // Swapping them
    const temp = availableIndexes[end];
    availableIndexes[end] = availableIndexes[randomIndex];
    availableIndexes[randomIndex] = temp;

    end--;
  }
}
