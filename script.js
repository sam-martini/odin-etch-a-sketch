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
        e.target.style.filter = 'brightness(1)';
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
        e.target.style.filter = 'brightness(1)';
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
    //reduce the brightness value by 0.1, capped at a minimum of 0 to prevent it from becoming negative.
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



//      ----        modes       ----        ----        ----

function toggleDrawMode() {
    drawBtn.classList.toggle('active-btn');
    drawMode =! drawMode;
    if (drawMode) {
        killShadeBtns();
        shadeMode = false;
        gridContainer.removeEventListener('mousedown', shadeMouseDown);
        gridContainer.removeEventListener('mouseover', shadeMouseOver);
        gridContainer.removeEventListener('mouseup', shadeMouseUp);
        
        gridContainer.addEventListener('mousedown', drawMouseDown);
        gridContainer.addEventListener('mouseover', drawMouseOver);
        gridContainer.addEventListener('mouseup', drawMouseUp);
    } else {
        gridContainer.removeEventListener('mousedown', drawMouseDown);
        gridContainer.removeEventListener('mouseover', drawMouseOver);
        gridContainer.removeEventListener('mouseup', drawMouseUp);
    }
}

function toggleShadeMode() {
    shadeBtn.classList.toggle('active-btn');
    shadeMode = !shadeMode;
    checkShade();
    if (shadeMode) {
        drawBtn.classList.remove('active-btn');
        drawMode = false;
        gridContainer.removeEventListener('mousedown', drawMouseDown);
        gridContainer.removeEventListener('mouseover', drawMouseOver);
        gridContainer.removeEventListener('mouseup', drawMouseUp);

        gridContainer.addEventListener('mousedown', shadeMouseDown);
        gridContainer.addEventListener('mouseover', shadeMouseOver);
        gridContainer.addEventListener('mouseup', shadeMouseUp);
    } else {
        toggleDrawMode();
    }
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



//  Lighter / Darker Buttons

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

function checkShade() {
    if (shadeMode && darkerShade) {
        darkerBtn.classList.add('active-btn');
    }
    if (shadeMode && lighterShade) {
        lighterBtn.classList.add('active-btn');
    }
}

function killShadeBtns() {
    lighterBtn.classList.remove('active-btn');
    darkerBtn.classList.remove('active-btn');
    shadeBtn.classList.remove('active-btn');
}


//      ----        event listeners         ----        ----       

drawBtn.addEventListener('click', toggleDrawMode);
shadeBtn.addEventListener('click', toggleShadeMode);


lighterBtn.addEventListener('click', lighterClick);
darkerBtn.addEventListener('click', darkerClick);

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
    showGrid = !showGrid;
    toggleGrid();
})

sizeButtons.forEach(button => {
    button.addEventListener('click', newGrid);
})





createGrid(8);
toggleDrawMode();