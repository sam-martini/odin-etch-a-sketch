const root = document.querySelector(':root');
const gridContainer = document.querySelector('.grid-container');

const clearBtn = document.querySelector('#clear-btn');
const drawBtn = document.querySelector('#draw-btn');
const colorPicker = document.querySelector('#color-picker');
const randomBtn = document.querySelector('#random-btn');
const eraserBtn = document.querySelector('#eraser-btn');

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

let shadeMode = false;
let drawMode = false;

let darkerShade = true;
let lighterShade = false;





//      ----    drawing functions      ----     ----        ----

function drawMouseDown(e) {
    if (e.target.classList.contains('square')) {
        resetBrightness(e.target);
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

function drawMouseOver(e) {
    if (mouseDown && e.target.classList.contains('square')) {
        resetBrightness(e.target);
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



//      ----    shading functions       ----        ----        ----

function shadeMouseDown(e) {
    mouseDown = true;
    //get the current square
    let square = e.target;
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

function shadeMouseOver(e) {
    if (mouseDown) {
        let square = e.target;
        let currentBrightness = getFilterValue(square);
        let newBrightness;
        if (darkerShade) {
            newBrightness = Math.max(currentBrightness - 0.1, 0); 
        } else {
            newBrightness = Math.max(currentBrightness + 0.1, 0);
        }
        e.target.style.filter = `brightness(${newBrightness})`;
    }
}

function shadeMouseUp(e) {
    mouseDown = false;
}





//      ----        Modes       ----        ----        ----

function toggleDrawMode() {
    drawBtn.classList.toggle('active-btn');
    drawMode =! drawMode;
    if (drawMode) {
        killShadeMode();
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
        disableBtns();
        checkCurrentShade();
        gridContainer.addEventListener('mousedown', shadeMouseDown);
        gridContainer.addEventListener('mouseover', shadeMouseOver);
        gridContainer.addEventListener('mouseup', shadeMouseUp);
    } else {
        toggleDrawMode();
    }
}

function toggleEraseMode() {
    if (!erase && shadeMode) {
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
    if (shadeMode) {
        toggleDrawMode();
    }
}

function toggleRandomMode() {
    if (!useRandomColor && shadeMode){
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
    if (shadeMode) {
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

function killShadeMode() {
    shadeMode = false;
    lighterBtn.classList.remove('active-btn');
    darkerBtn.classList.remove('active-btn');
    shadeBtn.classList.remove('active-btn');
    gridContainer.removeEventListener('mousedown', shadeMouseDown);
    gridContainer.removeEventListener('mouseover', shadeMouseOver);
    gridContainer.removeEventListener('mouseup', shadeMouseUp);
}

function killDrawMode() {
    drawMode = false;
    drawBtn.classList.remove('active-btn');
    removeDrawListeners();
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

shadeBtn.addEventListener('click', toggleShadeMode);
lighterBtn.addEventListener('click', lighterClick);
darkerBtn.addEventListener('click', darkerClick);

colorPicker.addEventListener('input', (e) => {
    colorChoice = e.target.value;
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