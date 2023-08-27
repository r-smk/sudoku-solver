const sudoku = document.querySelector(".sudoku");
const createNewSudokuBtn = document.getElementById("create-new");
const createNewSudokuBtnContainer = document.getElementById("create-container");
const create = document.getElementById("create");
const solve = document.getElementById("solve");

const createMode = document.querySelector(".create-mode");
const solveMode = document.querySelector(".solve-mode");

const numbersAndNotesDiv = document.getElementById("numbers-notes-container");

let currSelectedCell = null;
let numOfSols = 0;

// Arrow Keys
const ARROW_LEFT_KEY_CODE = 37;
const ARROW_UP_KEY_CODE = 38;
const ARROW_RIGHT_KEY_CODE = 39;
const ARROW_DOWN_KEY_CODE = 40;

// Delete Key Code
const DELETE_KEY_CODE = 46;

// keys
const SUDOKU_SOLUTIONS_KEY = "solutions";

// Creating an empty sudoku
function createEmptySudoku(sudokuArray) {
  sudoku.innerHTML = "";
  for (let row = 0; row < 9; row++) {
    const rowEl = document.createElement("div");
    rowEl.className = "row";
    for (let col = 0; col < 9; col++) {
      const cellEl = document.createElement("div");
      cellEl.className = "cell";
      cellEl.setAttribute("id", `${row}${col}`);
      if (sudokuArray) {
        const value = sudokuArray[row][col];
        if (value != 0) {
          cellEl.innerHTML = `<p>${value}</p>`;
        }
      }
      rowEl.appendChild(cellEl);
    }
    sudoku.appendChild(rowEl);
  }
}

// Return the cell with given ID
function getCell(row, col) {
  const id = `${row}${col}`;
  return document.getElementById(id);
}

function isCellInBox(i, start) {
  return start <= i && start + 2 >= i;
}

function getAllHighlightingCells(cell) {
  const row = parseInt(cell.getAttribute("id")[0]);
  const col = parseInt(cell.getAttribute("id")[1]);

  const cellsToBeHighlighted = [];

  // Get the box of the cell
  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 9; i++) {
    const expectedRow = boxStartRow + Math.floor(i / 3);
    const expectedCol = boxStartCol + (i % 3);

    if (expectedRow !== row || expectedCol !== col) {
      cellsToBeHighlighted.push(getCell(expectedRow, expectedCol));
    }
  }

  // Get the remaining row and col elements
  for (let i = 0; i < 9; i++) {
    // Checking with row
    if (!isCellInBox(i, boxStartRow)) {
      cellsToBeHighlighted.push(getCell(i, col));
    }

    // checking with col
    if (!isCellInBox(i, boxStartCol)) {
      cellsToBeHighlighted.push(getCell(row, i));
    }
  }

  return cellsToBeHighlighted;
}

// This function toggles the highlighting of cells
// We are making this toggle because we will call this function to remove the highlight and to add it.
// i.e., prev selected cell highlights will be removed by the same function and
// the current selected cell highlights will be added by the below function only.
function toggleHighlightingCells(cell) {
  const cellsToBeHighlighted = getAllHighlightingCells(cell);

  cellsToBeHighlighted.forEach((highlightedCell) => {
    highlightedCell.classList.toggle("highlight");
  });
  // We have to do the current cell because the cellsToBeHighlighted doesn't contain the "cell".
  cell.classList.toggle("highlight");
}

function selectNumber(value) {
  const number = document.getElementById(value);
  number.classList.add("selected");
}

function deselectNumber(value) {
  const number = document.getElementById(value);
  number.classList.remove("selected");
}

function selectCell(cell) {
  const prevValue = currSelectedCell.textContent;
  if (prevValue != "") {
    deselectNumber(prevValue);
  }
  currSelectedCell.classList.remove("select");
  toggleHighlightingCells(currSelectedCell);

  const value = cell.textContent;
  if (value != "") {
    selectNumber(value);
  }
  toggleHighlightingCells(cell);
  cell.classList.add("select");
  currSelectedCell = cell;
}

function eraseNumberInCell(cell) {
  cell.innerHTML = "";
}

// To check whether it is freezed cell or not
function isFreezedCell(cell) {
  return cell.classList.contains("freeze");
}

// Sudoku Handler
function sudokuClickHandler(event) {
  const cell = event.target.closest(".cell");
  if (cell) selectCell(cell);
  else return;
}

// Function to handle arrow keys when they are pressed
function arrowKeysHandler(keyCode) {
  const currCellRow = parseInt(currSelectedCell.getAttribute("id")[0]);
  const currCellCol = parseInt(currSelectedCell.getAttribute("id")[1]);

  if (keyCode === ARROW_UP_KEY_CODE && currCellRow > 0) {
    const cell = getCell(currCellRow - 1, currCellCol);
    selectCell(cell);
  } else if (keyCode === ARROW_DOWN_KEY_CODE && currCellRow < 8) {
    const cell = getCell(currCellRow + 1, currCellCol);
    selectCell(cell);
  } else if (keyCode === ARROW_LEFT_KEY_CODE && currCellCol > 0) {
    const cell = getCell(currCellRow, currCellCol - 1);
    selectCell(cell);
  } else if (keyCode === ARROW_RIGHT_KEY_CODE && currCellCol < 8) {
    const cell = getCell(currCellRow, currCellCol + 1);
    selectCell(cell);
  }
}

function validateHighlightedCells(cell) {
  const cellsToBeHighlighted = getAllHighlightingCells(cell);
  let isInvalid = false;

  cellsToBeHighlighted.forEach((highlightedCell) => {
    if (highlightedCell.textContent == "") {
      return;
    }

    if (highlightedCell.textContent == cell.textContent) {
      highlightedCell.classList.add("error");

      isInvalid = true;
    } else if (highlightedCell.classList.contains("error")) {
      const isInvalid = validateHighlightedCells(highlightedCell);

      if (!isInvalid) {
        highlightedCell.classList.remove("error");
      }
    }
  });

  return isInvalid;
}

// Function to handle number keys when pressed
function numberKeysHandler(key) {
  selectNumber(key);
  const prevValue = currSelectedCell.textContent;

  if (prevValue != "") deleteKeyFunction();

  if (prevValue == key) {
    deselectNumber(key);
    return;
  }

  currSelectedCell.innerHTML = `<p>${key}</p>`;

  const isInvalid = validateHighlightedCells(currSelectedCell);

  if (isInvalid) {
    currSelectedCell.classList.add("error");
  }
}

function isValidNumber(key) {
  const number = parseInt(key);
  return number > 0 && number <= 9;
}

function deleteKeyFunction() {
  deselectNumber(currSelectedCell.textContent);
  eraseNumberInCell(currSelectedCell);
  currSelectedCell.classList.remove("error");
  validateHighlightedCells(currSelectedCell);
}

// Handles when user presses a key
function keyHandler(keyEvent) {
  if (currSelectedCell === null) return;

  const keyCode = keyEvent.keyCode;
  const key = keyEvent.key;

  if (keyCode >= 37 && keyCode <= 40) {
    arrowKeysHandler(keyCode);
  } else if (isValidNumber(key) && !isFreezedCell(currSelectedCell)) {
    numberKeysHandler(key);
  } else if (keyCode === DELETE_KEY_CODE && !isFreezedCell(currSelectedCell)) {
    deleteKeyFunction();
  }
}

// Function which freezes filled cells in sudoku
function freezeSudokuFilledCells() {
  const cells = sudoku.querySelectorAll(".cell");

  cells.forEach((cell) => {
    if (cell.innerHTML != "") {
      cell.classList.add("freeze");
    }
  });
}

function getSudokuArray() {
  const cells = document.querySelectorAll(".cell");

  let sudokuArray = [];
  for (let row = 0; row < 9; row++) {
    let rowEls = [];
    for (let col = 0; col < 9; col++) {
      // Get the index of the cell.
      const index = row * 9 + col;

      // If it is empty then fill with 0 else the number.
      rowEls.push(parseInt(cells[index].textContent) || 0);
    }
    sudokuArray.push(rowEls);
  }

  return sudokuArray;
}

// --------------------------------- Solving the Sudoku Here ----------------------------------------
// --------------------------------------------------------------------------------------------------

// Note: Here sudoku mean sudoku array not the HTML element.

function checkRow(sudoku, row, value) {
  for (let i = 0; i < 9; i++) {
    if (sudoku[row][i] === value) {
      return true;
    }
  }
  return false;
}

// Returns true when the value is already present in col
function checkCol(sudoku, col, value) {
  for (let i = 0; i < 9; i++) {
    if (sudoku[i][col] === value) {
      return true;
    }
  }
  return false;
}

// Returns true when the value is already present in a box
function checkBox(sudoku, row, col, value) {
  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(col / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (sudoku[i][j] === value) {
        return true;
      }
    }
  }
  return false;
}

function solveSudoku(sudoku, index) {
  // if we reached the end then it is valid answer
  if (index == 81) {
    numOfSols++;
    if (numOfSols == 1) {
      localStorage.setItem(SUDOKU_SOLUTIONS_KEY, JSON.stringify(sudoku));
      return false;
    } else {
      return true;
    }
  }

  let row = Math.floor(index / 9);
  let col = index % 9;

  // If it already given value then move on to next one.
  if (sudoku[row][col] !== 0) {
    return solveSudoku(sudoku, index + 1);
  }

  for (let value = 1; value <= 9; value++) {
    // If the value already exists in either row or col or box
    // then continue for next value;
    if (
      checkRow(sudoku, row, value) ||
      checkCol(sudoku, col, value) ||
      checkBox(sudoku, row, col, value)
    ) {
      continue;
    }

    sudoku[row][col] = value;
    if (solveSudoku(sudoku, index + 1)) {
      return true;
    }
  }

  sudoku[row][col] = 0;
  return false;
}

// ---------------------- All Helper functions for solving sudoku ends here -------------------------
// --------------------------------------------------------------------------------------------------

function isValidSudoku(sudoku) {
  const sudokuArray = [...sudoku];
  numOfSols = 0;
  solveSudoku(sudokuArray, 0);

  if (numOfSols == 1) {
    return true;
  } else if (numOfSols > 1) {
    alert("Contains multiple solutions");
    return false;
  } else {
    alert("Invalid sudoku. Solution doesn't exist");
    return false;
  }
}

function initCurrentSelectedCell() {
  currSelectedCell = document.getElementById("00");
  const value = currSelectedCell.textContent;
  if (value != "") {
    selectNumber(value);
  }
  toggleHighlightingCells(currSelectedCell);
  currSelectedCell.classList.add("select");
}

function createNewSudokuBtnHandler() {
  createNewSudokuBtnContainer.classList.remove("show");
  createEmptySudoku();
  sudoku.classList.add("show");
  initCurrentSelectedCell();
  createMode.classList.add("show");
}

function createSudokuHandler() {
  const sudokuArray = getSudokuArray();
  if (!isValidSudoku(sudokuArray)) {
    return;
  }

  createMode.classList.remove("show");
  freezeSudokuFilledCells();
  initCurrentSelectedCell();
  solveMode.classList.add("show");
}

function fillSudoku() {
  const answer = JSON.parse(localStorage.getItem(SUDOKU_SOLUTIONS_KEY));

  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell, index) => {
    if (!cell.classList.contains("freeze")) {
      let row = Math.floor(index / 9);
      let col = index % 9;

      cell.innerHTML = `<p>${answer[row][col]}</p>`;
    }
  });
}

function numbersAndNotesDivHandler(event) {
  const div = event.target.closest("div");

  if (div == null) {
    return;
  }

  if (div.classList.contains("number") && !isFreezedCell(currSelectedCell)) {
    const key = div.textContent;
    numberKeysHandler(key);
  } else {
  }
}

function loadSudoku() {
  const sudokuArr = [
    [0, 7, 0, 5, 3, 0, 1, 0, 6],
    [0, 0, 2, 0, 0, 0, 0, 0, 7],
    [0, 0, 0, 0, 8, 0, 0, 0, 0],
    [0, 5, 0, 0, 0, 8, 0, 0, 0],
    [0, 0, 4, 6, 5, 0, 0, 3, 0],
    [0, 0, 0, 0, 0, 2, 6, 0, 0],
    [0, 0, 0, 0, 0, 6, 8, 0, 0],
    [9, 0, 0, 0, 0, 0, 0, 4, 0],
    [0, 2, 0, 1, 7, 0, 3, 0, 0],
  ];
  createNewSudokuBtnContainer.classList.remove("show");
  createEmptySudoku(sudokuArr);
  sudoku.classList.add("show");
  createSudokuHandler();
}

sudoku.addEventListener("click", sudokuClickHandler);
createNewSudokuBtn.addEventListener("click", createNewSudokuBtnHandler);
create.addEventListener("click", createSudokuHandler);
solve.addEventListener("click", fillSudoku);
numbersAndNotesDiv.addEventListener("click", numbersAndNotesDivHandler);

window.addEventListener("keydown", keyHandler);

loadSudoku();
