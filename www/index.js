import { memory } from "conway/conway_bg"
import { Universe, Cell } from "conway";

const CELL_SIZE = 8;  // px
const GRID_COLOR = "#eee8d5";
const DEAD_COLOR = "#fdf6e3";
const ALIVE_COLOR = "#268bd2";

// make the universe
const width = Math.floor((window.innerWidth * .75) / CELL_SIZE);
const height = Math.floor((window.innerHeight * .75) / CELL_SIZE);
const universe = Universe.new(width, height);


// make the canvas, and add a 1px border around each cell
const canvas = document.getElementById("conway-canvas")
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

const bitIsSet = (n, arr) => {
    const byte = Math.floor(n / 8);
    const mask = 1 << (n % 8);
    return (arr[byte] & mask) === mask;
}

const drawCells = () => {
    // allocate memory
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, (width * height) / 8);

    // begin drawing
    ctx.beginPath();
    for (let row = 0; row < height; ++row) {
        for (let col = 0; col < width; ++col) {
            const idx = getIndex(row, col);
            ctx.fillStyle = bitIsSet(idx, cells)
                ? ALIVE_COLOR
                : DEAD_COLOR;
            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE, CELL_SIZE);
        }
    }
    ctx.stroke();
}

let animationId = null;
const renderLoop = () => {
    universe.tick();
    drawGrid();
    drawCells();
    animationId = requestAnimationFrame(renderLoop);
};

const playStopButton = document.getElementById('play-stop');

const play = () => {
    playStopButton.textContent = "STOP";
    renderLoop();
}

const stop = () => {
    playStopButton.textContent = "PLAY";
    cancelAnimationFrame(animationId);
    animationId = null;
}

const isStopped = () => {
    return animationId === null;
}

playStopButton.addEventListener("click", event => {
    if (isStopped()) {
        play();
    } else {
        stop();
    }
})

const nextButton = document.getElementById('next');
nextButton.textContent = "NEXT";

nextButton.addEventListener("click", event => {
    stop();
    universe.tick();
    drawGrid();
    drawCells();
})

canvas.addEventListener("click", event => {
    const boundingRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

    universe.toggle_cell(row, col);
    drawGrid();
    drawCells();
});











// initial play
play();