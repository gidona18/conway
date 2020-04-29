import { memory } from "conway/conway_bg"
import { Universe, Cell } from "conway";

const SIZE = 96;
const CELL_SIZE = Math.floor(Math.min(window.innerWidth, window.innerHeight) / (SIZE * 1.25));  // px
const GRID_COLOR = "#eee8d5";
const DEAD_COLOR = "#fdf6e3";
const ALIVE_COLOR = "#268bd2";

// make the universe
const width = SIZE;
const height = SIZE;
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

const render = () => {
    drawGrid();
    drawCells();
}

let animationId = null;
const renderLoop = () => {
    universe.tick();
    render();
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
    render();
})

canvas.addEventListener("click", event => {
    stop();

    const boundingRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

    universe.toggle_cell(row, col);
    render();
});

const randButton = document.getElementById('rand');
randButton.textContent = "RAND";

randButton.addEventListener("click", event => {
    stop();
    universe.rand();
    render();
})

const killButton = document.getElementById('kill');
killButton.textContent = "KILL";

killButton.addEventListener("click", event => {
    stop();
    universe.kill();
    render();
})

// initial play
play();