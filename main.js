const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const numMovesDisp = document.getElementById('num-moves-disp');
const numColorsSelect = document.getElementById('num-colors-select');
const colors = ['#1259ff', 'red', 'yellow', 'ForestGreen', 'cyan', '#8f26ff', 'orange', 'violet'];

let colors_in_use = [];
let cellsAcross = 20;
let cellsDown = 20;
let cellSize = canvas.width / cellsAcross;
let currentColor;
let numMoves = 0;
let cells = [];

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = colors_in_use[Math.floor(Math.random() * colors_in_use.length)];
        this.isFlooded = false;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, cellSize, cellSize);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

document.addEventListener('mousedown', ev => {
    numMoves++;
    numMovesDisp.innerHTML = `Moves: ${numMoves}`;

    // get mouse position within canvas
    let rect = canvas.getBoundingClientRect();
    let x = ev.clientX - rect.left;
    let y = ev.clientY - rect.top;

    cells.forEach(row => {
        row.forEach(cell => {
            if(cell.x <= x && (cell.x + cellSize) >= x && cell.y <= y && (cell.y + cellSize) >= y) {
                floodCells(cell.color);
                drawCells();

                return;
            }
        });
    });
});

// TODO: need some better algorithm here so cells don't get missed
//       there is currently a bug where if a cell has already been checked
//       but is touching a cell that will get flooded, it doesn't get flooded
function floodCells(color) {
    // set each flooded cells color to the color of the clicked cell
    // after changing color, check if any cells touching a flooded cell are that color
    // if they are, make them a flooded cell
    cells.forEach((row, i) => {
        row.forEach((cell, j) => {
            if(cell.isFlooded) {
                cell.color = color;

                if(i > 0 && cells[i - 1][j].color === color) {
                    cells[i - 1][j].isFlooded = true;
                }

                if(i < cellsDown - 1 && cells[i + 1][j].color === color) {
                    cells[i + 1][j].isFlooded = true;
                }

                if(j > 0 && cells[i][j - 1].color === color) {
                    cells[i][j - 1].isFlooded = true;
                }

                if(j < cellsAcross - 1 && cells[i][j + 1].color === color) {
                    cells[i][j + 1].isFlooded = true;
                }
            }
        });
    });
}

function initCells() {
    cells = [];
    
    for(let i = 0; i < cellsDown; i++) {
        let row = [];

        for(let j = 0; j < cellsAcross; j++) {
            row.push(new Cell(j * cellSize, i * cellSize));
        }

        cells.push(row);
    }

    currentColor = cells[0][0].color;
    cells[0][0].isFlooded = true;

    // any cells touching the top left cell should be flooded to start
    floodCells(currentColor);

    // display number of moves made
    numMovesDisp.innerHTML = `Moves: ${numMoves}`;
}

function drawCells() {
    cells.forEach(row => {
        row.forEach(cell => {
            cell.draw(ctx); 
        });
    });
}

function resetGame() {
    numMoves = 0;
    numMovesDisp.innerHTML = `Moves: ${numMoves}`;

    colors_in_use = [];
    let numColors = parseInt(numColorsSelect.value);

    for(let i = 0; i < numColors; i++) {
        colors_in_use.push(colors[i]);
    }

    initCells();
    drawCells();
}

resetGame();
