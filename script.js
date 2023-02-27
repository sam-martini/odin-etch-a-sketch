const root = document.querySelector(':root');
const gridContainer = document.querySelector('.grid-container');

const drawBtn = document.querySelector('.draw-btn');
const colorPicker = document.querySelector('.color-picker');
const rainbowBtn = document.querySelector('.rainbow-btn');
const eraserBtn = document.querySelector('.eraser-btn');
const blurBtn = document.querySelector('.blur-btn');
const gridShapeBtn = document.querySelector('.gridshape-btn');
const brighterBtn = document.querySelector('.brighter-btn');
const darkerBtn = document.querySelector('.darker-btn');

const clearBtn = document.querySelector('.clear-btn');
const gridBtn = document.querySelector('.grid-btn');
const eightGridBtn = document.querySelector('.eight-btn');
const sixteenGridBtn = document.querySelector('.sixteen-btn');
const thirtytwoGridBtn = document.querySelector('.thirtytwo-btn');
const sixtyfourGridBtn = document.querySelector('.sixtyfour-btn');

const sizeButtons = [eightGridBtn, sixteenGridBtn, thirtytwoGridBtn, sixtyfourGridBtn];

const shadowEl = document.querySelectorAll('.shadow-el');


let showGrid = true;
let pointerDown = false;
let colorChoice = '#1d2429';

let drawMode = false;
let useRandomColor = false;
let erase = false;
let blurMode = false;
let circleGrid = false;
let brighterMode = false;
let darkerMode = true;

let backgroundShadow = false;


/* About the changes (was too messy trying to apply different css filters)

1) create seperate 'filter' object for each square

2) add functions that get, set and reset filter values

3) update blur mode to gradually blur while mouse on

3) add mode that toggles the border-radius property of the squares

4) turn off 'mood' - runs slow */


function addFilterToSquare(square) {
    square.filter = {
        blur: 0, 
        brightness: 100, 
        sepia: 0
    };
}


function updateFilter(square, filterType, value) {
    square.filter[filterType] = value;
    applyFilter(square);
}

function resetFilters(square) {
    updateFilter(square, 'brightness', 100);
    updateFilter(square, 'blur', 0);
}

function applyFilter(square) {
    square.style.filter = `
    blur(${square.filter.blur}px) 
    brightness(${square.filter.brightness}%) 
    sepia(${square.filter.sepia}%)
    `;
}

function getProperty(obj, prop) {
    return obj[prop];
}



//      ----    drawing functions      ----     ----        ----

function drawPointerDown(e) {
    if (e.target.classList.contains('square')) {
        pointerDown = true;
        drawSquare(e.target);
    }
}

function drawPointerOver(e) {
    if (pointerDown && e.target.classList.contains('square')) {
        drawSquare(e.target);
    }
}

function drawPointerUp() {
    pointerDown = false;
}

function drawSquare(square) {
    resetFilters(square);
    if (erase) {
        square.style.backgroundColor = 'transparent';
    } else if (useRandomColor) {
        square.style.backgroundColor = randomColor();
    } else {
        square.style.backgroundColor = colorChoice;
    }
}



//      ----    shading functions       ----        ----        ----

function shadePointerDown(e) {
    if (e.target.classList.contains('square')) {
        pointerDown = true;
        shadeSquare(e.target);
    }
}

function shadePointerOver(e) {
    if (pointerDown && e.target.classList.contains('square')) {
        shadeSquare(e.target);
    }
}

function shadePointerUp() {
    pointerDown = false;
}

function shadeSquare(square) {
    //get the current brightness
    let currentBrightness = getProperty(square.filter, 'brightness');
    console.log(currentBrightness);
    //make a new brightness depending on what mode is selected
    let newBrightness;
    if (darkerMode) {
        newBrightness = currentBrightness - 5;
    } else {
        newBrightness = currentBrightness + 5;
    }
    //apply the new brightness
    updateFilter(square, 'brightness', newBrightness);
}



//      ----    blur functions       ----        ----        ----

function blurPointerDown(e) {
    if (e.target.classList.contains('square')) {
        pointerDown = true;
        blurSquare(e.target);
    }
}

function blurPointerOver(e) {
    if (pointerDown && e.target.classList.contains('square')) {
        blurSquare(e.target);
    }
}

function blurPointerUp() {
    pointerDown = false;
}

function blurSquare(square) {
    let currentBlur = getProperty(square.filter, 'blur');
    console.log(currentBlur);
    newBlur = currentBlur + .5;
    updateFilter(square, 'blur', newBlur);
}


//      ----    grid - shape       ----        ----        ----

function gridShapeOn() {
    const squares = gridContainer.querySelectorAll('.square');
    squares.forEach(square => {
        square.classList.add('morph-square');
    })
    
}

function gridShapeOff() {
    const squares = gridContainer.querySelectorAll('.square');
    squares.forEach(square => {
        square.classList.remove('morph-square');
    })
    
}


//      ----        Modes       ----        ----        ----

function toggleDrawMode() {
    drawBtn.classList.toggle('active-btn');
    drawMode =! drawMode;
    if (drawMode) {
        killFilterMode();
        gridContainer.addEventListener('pointerdown', drawPointerDown);
        gridContainer.addEventListener('pointerover', drawPointerOver);
        gridContainer.addEventListener('pointerup', drawPointerUp);
    } else {
        removeDrawListeners();
    }
}

function togglePicker() {
    killEraseMode();
    killRandomMode();
}

function toggleRandomMode() {
    useRandomColor = !useRandomColor;
    if (useRandomColor && !drawMode) {
        killEraseMode();
        activateBtn(rainbowBtn);
        toggleDrawMode();
    } else if (useRandomColor && drawMode) {
        killEraseMode();
        activateBtn(rainbowBtn);
    } else {
        deactivateBtn(rainbowBtn);
    }
}

function toggleEraseMode() {
    erase = !erase;
    if (erase && !drawMode) {
        killRandomMode();
        activateBtn(eraserBtn);
        toggleDrawMode();
    } else if (erase && drawMode) {
        killRandomMode();
        activateBtn(eraserBtn);
    } else {
        deactivateBtn(eraserBtn);
    }
}

function toggleBlurMode() {
    blurMode = !blurMode;
    if (blurMode) {
        killDrawMode();
        hideActiveMode();
        activateBtn(blurBtn);
        gridContainer.addEventListener('pointerdown', blurPointerDown);
        gridContainer.addEventListener('pointerover', blurPointerOver);
        gridContainer.addEventListener('pointerup', blurPointerUp);
    } else {
        showActiveMode();
        toggleDrawMode();
    }
}

function toggleGridShape() {
    circleGrid =! circleGrid;
    if (circleGrid) {
        activateBtn(gridShapeBtn);
        gridShapeOn();
    } else {
        deactivateBtn(gridShapeBtn);
        gridShapeOff();
    }
}

function toggleBrighterMode() {
    brighterMode = !brighterMode;
    if (brighterMode && darkerMode) {
        darkerMode = false;
        deactivateBtn(darkerBtn);
    }
    if (brighterMode) {
        activateBtn(brighterBtn);   
    } else {
        deactivateBtn(brighterBtn);
    }
    toggleShadeMode();
}

function toggleDarkerMode() {
    darkerMode = !darkerMode;
    if (darkerMode && brighterMode) {
        brighterMode = false;
        deactivateBtn(brighterBtn);
    }
    if (darkerMode) {
        activateBtn(darkerBtn);
    } else {
        deactivateBtn(darkerBtn);
    }
    toggleShadeMode();
}

function toggleShadeMode() {
    if (brighterMode || darkerMode) {
        killDrawMode();
        hideActiveMode();
        gridContainer.addEventListener('pointerdown', shadePointerDown);
        gridContainer.addEventListener('pointerover', shadePointerOver);
        gridContainer.addEventListener('pointerup', shadePointerUp);
    } else {
        showActiveMode();
        toggleDrawMode();
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
        addFilterToSquare(square);
        square.style.width = `calc(100% / ${columns})`;
        square.style.height = `calc(100% / ${rows})`;
        gridContainer.appendChild(square);
    }
}

function toggleGrid() {
    showGrid =! showGrid;
    if (showGrid) {
        activateBtn(gridBtn);
        root.style.setProperty('--grid-border', '.5px solid black');
    } else {
        deactivateBtn(gridBtn);
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





  
//      ----        Background Shadow      ----        ----        ----
/*
function shadowPointerDown(e) {
    if (e.target.classList.contains('square')) {
        backgroundShadow = true;
        shadowEl.forEach((el) => {
            el.classList.add('shadow-on');
        });
    }
}


function shadowPointerUp() {
    backgroundShadow = false;
    shadowEl.forEach((el) => {
        el.classList.remove('shadow-on');
    });
}
*/











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
        square.style.filter = 'blur(0)';
    })
}

function removeDrawListeners() {
    gridContainer.removeEventListener('pointerdown', drawPointerDown);
    gridContainer.removeEventListener('pointerover', drawPointerOver);
    gridContainer.removeEventListener('pointerup', drawPointerUp);
}

function killDrawMode() {
    drawMode = false;
    drawBtn.classList.remove('active-btn');
    removeDrawListeners();
}

function killFilterMode() {
    killBlurMode();
    killShadeMode();
}

function killShadeMode() {
    brighterMode = false;
    darkerMode = false;
    brighterBtn.classList.remove('active-btn');
    darkerBtn.classList.remove('active-btn');
    gridContainer.removeEventListener('pointerdown', shadePointerDown);
    gridContainer.removeEventListener('pointerover', shadePointerOver);
    gridContainer.removeEventListener('pointerup', shadePointerUp);
}

function killBlurMode() {
    blurMode = false;
    blurBtn.classList.remove('active-btn');
    gridContainer.removeEventListener('pointerdown', blurPointerDown);
    gridContainer.removeEventListener('pointerover', blurPointerOver);
    gridContainer.removeEventListener('pointerup', blurPointerUp);
}

function killEraseMode() {
    erase = false;
    eraserBtn.classList.remove('active-btn');
    resetPencil();
}

function killRandomMode() {
    useRandomColor = false;
    rainbowBtn.classList.remove('active-btn');
}

function hideActiveMode() {
    if (erase) {
        deactivateBtn(eraserBtn);
    }
    if (useRandomColor) {
        deactivateBtn(rainbowBtn);
    }
}

function showActiveMode() {
    if (erase) {
        activateBtn(eraserBtn);
    }
    if (useRandomColor) {
        activateBtn(rainbowBtn);
    }
}

function flipPencil() {
    drawBtn.style.backgroundImage = 'url("images/pencil-flipped.png")';
}

function resetPencil() {
    drawBtn.style.backgroundImage = 'url("images/pencil.png")';
}

function activateBtn(btn) {
    btn.classList.add('active-btn');
}

function deactivateBtn(btn) {
    btn.classList.remove('active-btn');
}







//      ----        event listeners         ----        ----       

drawBtn.addEventListener('click', toggleDrawMode);

colorPicker.addEventListener('input', (e) => {
    colorChoice = e.target.value;
    togglePicker();
})

rainbowBtn.addEventListener('click', toggleRandomMode);

eraserBtn.addEventListener('click', toggleEraseMode);

blurBtn.addEventListener('click', toggleBlurMode);

gridShapeBtn.addEventListener('click', toggleGridShape);

brighterBtn.addEventListener('click', toggleBrighterMode);

darkerBtn.addEventListener('click', toggleDarkerMode);



colorPicker.addEventListener('change', (e) => {
    colorChoice = e.target.value;
    togglePicker();
})

clearBtn.addEventListener('click', clearSquares);

gridBtn.addEventListener('click', toggleGrid);

sizeButtons.forEach(button => {
    button.addEventListener('click', newGrid);
})
/*
function mood() {
    gridContainer.addEventListener('pointerdown', shadowPointerDown);
    gridContainer.addEventListener('pointerup', shadowPointerUp);
}
*/




createGrid(16);
toggleDrawMode();
//mood();