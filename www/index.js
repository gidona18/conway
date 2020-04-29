import { memory } from "wasm-game-of-life/wasm_game_of_life_bg"
import { Universe, Cell } from "wasm-game-of-life";

const CELL_SIZE = 4;  // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

// make the universe
const universe = Universe.new(128, 128);
const width = universe.width();
const height = universe.height();

// make the canvas, and add a 1px border around each cell
const canvas = document.getElementById("game-of-life-canvas")
canvas.width = (CELL_SIZE + 1) * width + 1;;
canvas.height = (CELL_SIZE + 1) * height + 1;;

const ctx = canvas.getContext('2d');

const drawGrid = () => {
    // begin drawing
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;
    // vertical lines
    for (let i = 0; i <= width; ++i) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }
    // horizontal lines
    for (let j = 0; j <= height; ++j) {
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }
    // draw
    ctx.stroke();
}


const getIndex = (row, col) => {
    return row * width + col;
}

const drawCells = () => {
    // allocate memory
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    // begin drawing
    ctx.beginPath();
    for (let row = 0; row < height; ++row) {
        for (let col = 0; col < width; ++col) {
            const idx = getIndex(row, col);
            ctx.fillStyle = cells[idx] === Cell.Dead
                ? DEAD_COLOR
                : ALIVE_COLOR;
            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE, CELL_SIZE);
        }
    }
    ctx.stroke();
}

const renderLoop = () => {
    universe.tick();
    drawGrid();
    drawCells();
    requestAnimationFrame(renderLoop);
};
requestAnimationFrame(renderLoop);