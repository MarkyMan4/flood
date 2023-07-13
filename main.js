const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let colors = ['#1259ff', 'red', 'yellow', 'ForestGreen', 'cyan', '#8f26ff', 'orange', 'violet'];
let cellsAcross = 20;
let cellsDown = 20;
let cellSize = canvas.width / cellsAcross;

let currentColor;

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.isFlooded = false;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, cellSize, cellSize);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

let cells = [];

document.addEventListener('mousedown', ev => {
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
    for(let i = 0; i < cellsDown; i++) {
        let row = [];

        for(let j = 0; j < cellsAcross; j++) {
            row.push(new Cell(j * cellSize, i * cellSize));
        }

        cells.push(row);
    }

    currentColor = cells[0][0];
    cells[0][0].isFlooded = true;

    // any cells touching the top left cell should be flooded to start
    floodCells(currentColor);
}

function drawCells() {
    cells.forEach(row => {
        row.forEach(cell => {
            cell.draw(ctx); 
        });
    });
}

initCells();
drawCells();
