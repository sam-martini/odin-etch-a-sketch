const root = document.querySelector(':root');

const gridContainer = document.querySelector('.grid-container');
const colorPicker = document.querySelector('#color-picker');
const randomBtn = document.querySelector('#random-btn');
const eraserBtn = document.querySelector('#eraser-btn');
const clearBtn = document.querySelector('#clear-btn');
const gridBtn = document.querySelector('#grid-btn');
const shadeBtn = document.querySelector('#shade-btn');
const drawBtn = document.querySelector('#draw-btn');

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












function shade(e) {
    if (e.target.classList.contains('square')) {
        const square = e.target;
        const color = window.getComputedStyle(square).getPropertyValue('background-color');
        console.log(color);
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








let shadeMode = false;
let drawMode = false;

function toggleDrawMode() {
    drawBtn.classList.toggle('active-btn');
    drawMode =! drawMode;
    if (shadeMode) {
        shadeBtn.classList.toggle('active-btn');
        shadeMode = !shadeMode;
    }
    if (drawMode) {
        gridContainer.removeEventListener('click', shade);
        
        gridContainer.addEventListener('mousedown', drawMouseDown);
        gridContainer.addEventListener('mousemove', drawMouseMove);
        gridContainer.addEventListener('mouseup', drawMouseUp);
    } else {
        gridContainer.removeEventListener('mousedown', drawMouseDown);
        gridContainer.removeEventListener('mousemove', drawMouseMove);
        gridContainer.removeEventListener('mouseup', drawMouseUp);
    }
}

function toggleShadeMode() {
    shadeBtn.classList.toggle('active-btn');
    shadeMode = !shadeMode;
    if (shadeMode) {
        drawBtn.classList.toggle('active-btn');
        drawMode = !drawMode;
        gridContainer.removeEventListener('mousedown', drawMouseDown);
        gridContainer.removeEventListener('mousemove', drawMouseMove);
        gridContainer.removeEventListener('mouseup', drawMouseUp);

        gridContainer.addEventListener('click', shade);
    } else {
        toggleDrawMode();
    }
}

drawBtn.addEventListener('click', toggleDrawMode);
shadeBtn.addEventListener('click', toggleShadeMode);


toggleDrawMode();




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