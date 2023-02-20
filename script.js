const root = document.querySelector(':root');
const gridContainer = document.querySelector('.grid-container');

const clearBtn = document.querySelector('#clear-btn');
const drawBtn = document.querySelector('#draw-btn');
const colorPicker = document.querySelector('#color-picker');
const randomBtn = document.querySelector('#random-btn');
const eraserBtn = document.querySelector('#eraser-btn');

const blurBtn = document.querySelector('#blur-btn');
const shadeBtn = document.querySelector('#shade-btn');
const lighterBtn = document.querySelector('#lighter-btn');
const darkerBtn = document.querySelector('#darker-btn');

const gridBtn = document.querySelector('#grid-btn');

const eightGridBtn = document.querySelector('#eight-btn');
const sixteenGridBtn = document.querySelector('#sixteen-btn');
const thirtytwoGridBtn = document.querySelector('#thirtytwo-btn');
const sixtyfourGridBtn = document.querySelector('#sixtyfour-btn');
const sizeButtons = [eightGridBtn, sixteenGridBtn, thirtytwoGridBtn, sixtyfourGridBtn];




let showGrid = false;
let mouseDown = false;
let useRandomColor = false;
let erase = false;
let colorChoice = 'black';

let blurMode = false;
let shadeMode = false;
let drawMode = false;

let darkerShade = true;
let lighterShade = false;





//      ----    drawing functions      ----     ----        ----

function drawMouseDown(e) {
    if (e.target.classList.contains('square')) {
        mouseDown = true;
        drawSquare(e.target);
    }
}

function drawMouseOver(e) {
    if (mouseDown && e.target.classList.contains('square')) {
        resetBrightness(e.target);
        drawSquare(e.target);
    }
}

function drawMouseUp() {
    mouseDown = false;
}

function drawSquare(square) {
    resetBrightness(square);
    if (erase) {
        square.style.backgroundColor = 'transparent';
    } else if (useRandomColor) {
        square.style.backgroundColor = randomColor();
    } else {
        square.style.backgroundColor = colorChoice;
    }
}



//      ----    shading functions       ----        ----        ----

function shadeMouseDown(e) {
    if (e.target.classList.contains('square')) {
        mouseDown = true;
        shadeSquare(e.target);
    }
}

function shadeMouseOver(e) {
    if (mouseDown && e.target.classList.contains('square')) {
        shadeSquare(e.target);
    }
}

function shadeMouseUp() {
    mouseDown = false;
}

function shadeSquare(square) {
    //get the current brightness
    let currentBrightness = getFilterValue(square);
    //reduce the brightness value by 0.1, capped to prevent it from becoming negative or over 1.
    let newBrightness;
    if (darkerShade) {
        newBrightness = Math.max(currentBrightness - 0.1, 0); 
    } else {
        newBrightness = Math.min(currentBrightness + 0.1, 1);
    }
    //apply the new brightness
    square.style.filter = `brightness(${newBrightness})`;
}



//      ----    blur functions       ----        ----        ----

function blurMouseDown(e) {
    if (e.target.classList.contains('square')) {
        mouseDown = true;
        blurSquare(e.target);
    }
}

function blurMouseOver(e) {
    if (mouseDown && e.target.classList.contains('square')) {
        blurSquare(e.target);
    }
}

function blurMouseUp() {
    mouseDown = false;
}

function blurSquare(square) {
    square.style.filter = 'blur(2px)';
}



//      ----        Modes       ----        ----        ----

function toggleDrawMode() {
    drawBtn.classList.toggle('active-btn');
    drawMode =! drawMode;
    if (drawMode) {
        killShadeMode();
        killBlurMode();
        enableBtns();
        gridContainer.addEventListener('mousedown', drawMouseDown);
        gridContainer.addEventListener('mouseover', drawMouseOver);
        gridContainer.addEventListener('mouseup', drawMouseUp);
    } else {
        disableBtns();
        removeDrawListeners();
    }
}

function toggleShadeMode() {
    shadeBtn.classList.toggle('active-btn');
    shadeMode = !shadeMode;
    if (shadeMode) {
        killDrawMode();
        killBlurMode();
        disableBtns();
        checkCurrentShade();
        gridContainer.addEventListener('mousedown', shadeMouseDown);
        gridContainer.addEventListener('mouseover', shadeMouseOver);
        gridContainer.addEventListener('mouseup', shadeMouseUp);
    } else {
        toggleDrawMode();
    }
}

function toggleBlurMode() {
    blurBtn.classList.toggle('active-btn');
    blurMode = !blurMode;
    if (blurMode) {
        killDrawMode();
        killShadeMode();
        disableBtns();
        gridContainer.addEventListener('mousedown', blurMouseDown);
        gridContainer.addEventListener('mouseover', blurMouseOver);
        gridContainer.addEventListener('mouseup', blurMouseUp);
    } else {
        toggleDrawMode();
    }
}

function toggleEraseMode() {
    if (!erase && shadeMode || !erase && blurMode) {
        erase = true;
    }
    if (erase) {
        eraserBtn.classList.add('active-btn');
        flipPencil();
    } else {
        eraserBtn.classList.remove('active-btn');
        resetPencil();
    }
    if (useRandomColor) {
        killRandomMode();
    }
    if (shadeMode || blurMode) {
        toggleDrawMode();
    }
}

function toggleRandomMode() {
    if (!useRandomColor && shadeMode || !useRandomColor && blurMode) {
        useRandomColor = true;
    }
    if (useRandomColor) {
        randomBtn.classList.add('active-btn');
        resetPencil();
    } else {
        randomBtn.classList.remove('active-btn');
    }
    if (erase) {
        killEraseMode();
    }
    if (shadeMode || blurMode) {
        toggleDrawMode();
    }
}

function togglePicker() {
    killEraseMode();
    killRandomMode();
    if (shadeMode || blurMode) {
        toggleDrawMode();
    }
}


//  Toggle Lighter / Darker Buttons

function lighterClick(e) {
    if (shadeMode && darkerShade) {
        lighterBtn.classList.toggle('active-btn');
        darkerBtn.classList.remove('active-btn');
        darkerShade = false;
        lighterShade = true;
    }

}

function darkerClick(e) {
    if (shadeMode && lighterShade) {
        darkerBtn.classList.toggle('active-btn');
        lighterBtn.classList.remove('active-btn');
        darkerShade = true;
        lighterShade = false;
    }
}

function checkCurrentShade() {
    if (shadeMode && darkerShade) {
        darkerBtn.classList.add('active-btn');
    }
    if (shadeMode && lighterShade) {
        lighterBtn.classList.add('active-btn');
    }
}






//      ----        grid functions      ----        ----        ----

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

function toggleGrid() {
    if (showGrid) {
        root.style.setProperty('--grid-border', '.5px solid black');
    } else {
        root.style.setProperty('--grid-border', 'none');
    }
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








//      ----        helper functions        ----        ----     

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

function getFilterValue(element) {
    //extract the numeric value in between the parantheses of the 'filter' property.
    let value = parseFloat(getComputedStyle(element).getPropertyValue('filter').split('(')[1].split(')')[0]);
    return value;
}

function resetBrightness(square) {
    square.style.filter = 'brightness(1)';
}

function removeDrawListeners() {
    gridContainer.removeEventListener('mousedown', drawMouseDown);
    gridContainer.removeEventListener('mouseover', drawMouseOver);
    gridContainer.removeEventListener('mouseup', drawMouseUp);
}

function killDrawMode() {
    drawMode = false;
    drawBtn.classList.remove('active-btn');
    removeDrawListeners();
}

function killShadeMode() {
    shadeMode = false;
    lighterBtn.classList.remove('active-btn');
    darkerBtn.classList.remove('active-btn');
    shadeBtn.classList.remove('active-btn');
    gridContainer.removeEventListener('mousedown', shadeMouseDown);
    gridContainer.removeEventListener('mouseover', shadeMouseOver);
    gridContainer.removeEventListener('mouseup', shadeMouseUp);
}

function killBlurMode() {
    blurMode = false;
    blurBtn.classList.remove('active-btn');
    gridContainer.removeEventListener('mousedown', blurMouseDown);
    gridContainer.removeEventListener('mouseover', blurMouseOver);
    gridContainer.removeEventListener('mouseup', blurMouseUp);
}

function killEraseMode() {
    erase = false;
    eraserBtn.classList.remove('active-btn');
}

function killRandomMode() {
    useRandomColor = false;
    randomBtn.classList.remove('active-btn');
}

function flipPencil() {
    drawBtn.style.backgroundImage = 'url("images/pencil-flipped.png")';
}

function resetPencil() {
    drawBtn.style.backgroundImage = 'url("images/pencil.png")';
}

function disableBtns() {
    eraserBtn.classList.add('disabled-btn');
    randomBtn.classList.add('disabled-btn');
}

function enableBtns() {
    eraserBtn.classList.remove('disabled-btn');
    randomBtn.classList.remove('disabled-btn');
}







//      ----        event listeners         ----        ----       

drawBtn.addEventListener('click', toggleDrawMode);

randomBtn.addEventListener('click', () => {
    useRandomColor = !useRandomColor;
    toggleRandomMode();
})

eraserBtn.addEventListener('click', () => {
    erase = !erase;
    toggleEraseMode();
});

blurBtn.addEventListener('click', toggleBlurMode);

shadeBtn.addEventListener('click', toggleShadeMode);
lighterBtn.addEventListener('click', lighterClick);
darkerBtn.addEventListener('click', darkerClick);

colorPicker.addEventListener('input', (e) => {
    colorChoice = e.target.value;
    togglePicker();
})

colorPicker.addEventListener('change', (e) => {
    colorChoice = e.target.value;
    togglePicker();
})

clearBtn.addEventListener('click', clearSquares);

gridBtn.addEventListener('click', () => {
    gridBtn.classList.toggle('active-btn');
    showGrid = !showGrid;
    toggleGrid();
})

sizeButtons.forEach(button => {
    button.addEventListener('click', newGrid);
})





createGrid(16);
toggleDrawMode();