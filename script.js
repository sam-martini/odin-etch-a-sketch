const root = document.querySelector(':root');

const gridContainer = document.querySelector('.grid-container');
const colorPicker = document.querySelector('#color-picker');
const randomBtn = document.querySelector('#random-btn');
const eraserBtn = document.querySelector('#eraser-btn');
const clearBtn = document.querySelector('#clear-btn');
const gridBtn = document.querySelector('#grid-btn');

const eightGridBtn = document.querySelector('#eight-btn');
const sixteenGridBtn = document.querySelector('#sixteen-btn');
const thirtytwoGridBtn = document.querySelector('#thirtytwo-btn');
const sixtyfourGridBtn = document.querySelector('#sixtyfour-btn');
const sizeButtons = [eightGridBtn, sixteenGridBtn, thirtytwoGridBtn, sixtyfourGridBtn];

let mouseDown = false;
let useRandomColor = false;
let erase = false;
let gridOn = false;
let colorChoice = 'black';






function createGrid(size) {
    const columns = size;
    const rows = size;
    const numberOfSquares = columns * rows;
    for (let i = 0; i < numberOfSquares; i++) {
        const square = document.createElement('div');
        square.className = 'square';
        square.style.width = `calc(100% / ${columns})`;
        square.style.height = `calc(100% / ${rows})`;
        gridContainer.appendChild(square);
    }
}

function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function clearSquares() {
    const squares = gridContainer.querySelectorAll('.square');
    squares.forEach(square => {
        square.style.backgroundColor = 'transparent';
    })
}

function toggleGrid() {
    if (gridOn) {
        root.style.setProperty('--grid-border', '.5px solid black');
    } else {
        root.style.setProperty('--grid-border', 'none');
    }
}




function drawMouseDown(e) {
    if (e.target.classList.contains('square')) {
        mouseDown = true;
        if (erase) {
            e.target.style.backgroundColor = 'transparent';
        } else if (useRandomColor) {
            e.target.style.backgroundColor = randomColor();
        } else {
            e.target.style.backgroundColor = colorChoice;
        }
    }
}

function drawMouseMove(e) {
    if (mouseDown && e.target.classList.contains('square')) {
        if (erase) {
            e.target.style.backgroundColor = 'transparent';
        } else if (useRandomColor) {
            e.target.style.backgroundColor = randomColor();
        } else {
            e.target.style.backgroundColor = colorChoice;
        }
    }
}

function drawMouseUp(e) {
    mouseDown = false;
}




function clearGrid() {
    while(gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
}

function newGrid(e) {
    const size = parseInt(this.value);
    clearGrid();
    createGrid(size);
}






gridContainer.addEventListener('mousedown', drawMouseDown);
gridContainer.addEventListener('mousemove', drawMouseMove);
gridContainer.addEventListener('mouseup', drawMouseUp);


colorPicker.addEventListener('change', (e) => {
    colorChoice = e.target.value;
})


randomBtn.addEventListener('click', () => {
    randomBtn.classList.toggle('active-btn');
    useRandomColor = !useRandomColor;
})


eraserBtn.addEventListener('click', () => {
    eraserBtn.classList.toggle('active-btn');
    erase = !erase;
});


clearBtn.addEventListener('click', clearSquares);


gridBtn.addEventListener('click', () => {
    gridBtn.classList.toggle('active-btn');
    gridOn = !gridOn;
    toggleGrid();
})


sizeButtons.forEach(button => {
    button.addEventListener('click', newGrid);
})




createGrid(16);