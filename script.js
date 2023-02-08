const gridContainer = document.querySelector('.grid-container');
const colorPicker = document.querySelector('#color-picker');
const eightGridBtn = document.querySelector('#eight-btn');
const sixteenGridBtn = document.querySelector('#sixteen-btn');
const thirtytwoGridBtn = document.querySelector('#thirtytwo-btn');
const sixtyfourGridBtn = document.querySelector('#sixtyfour-btn');
const randomBtn = document.querySelector('#random-btn');
const gridBtn = document.querySelector('#grid-btn');
const root = document.querySelector(':root');


function clearGrid() {
    while(gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
}
// create a function that takes in a number and generates a grid with that number of even squares
// per side. 
function createGrid(size) {
    const columns = size;
    const rows = size;
    const numberOfSquares = columns * rows;
    // create grid elements based on number of total squares. add class of 'square' to each one
    for (let i = 0; i < numberOfSquares; i++) {
        const square = document.createElement('div');
        square.className = 'square';
        // set the same width/height of each item based on size of parent container
        square.style.width = `calc(100% / ${columns})`;
        square.style.height = `calc(100% / ${rows})`;
        // append to page
        gridContainer.appendChild(square);
    }
}





// get each square from the grid using queryselectorAll.
// add eventlisteners to all squares.
// when the mouse is clicked down, set mousedown to true.
// change the background color of the 
// target square by using a css variable.
// do the same if mousedown is true and the mouse enters the square.
// when the mouse is unclicked, set mousedown back to false.

//  the color choice is stored in a variable that will change
//  depending on user input.

// if random color is set to true, use that. 
// otherwise use the color choice variable.

let colorChoice = 'black';
let useRandomColor = false;
let mouseDown = false;


function paintSquares() {
    const squares = gridContainer.querySelectorAll('.square');
    
    squares.forEach(square => {
        square.addEventListener('mousedown', (e) => {
            mouseDown = true;
            if (useRandomColor) {
                e.target.style.setProperty('--color-choice', randomColor());
            } else {
                e.target.style.setProperty('--color-choice', colorChoice);
            }
        });

        square.addEventListener('mouseenter', (e) => {
            if (mouseDown) {
                if (useRandomColor) {
                    e.target.style.setProperty('--color-choice', randomColor());
                } else {
                    e.target.style.setProperty('--color-choice', colorChoice);
                }
            }
        });

        square.addEventListener('mouseup', () => {
            mouseDown = false;
        });
    });
}





// get the value of the color picker by adding an event listener
// to it and asign its value to the colorChoice variable


function pickColor(e) {
    colorChoice = e.target.value;
}

colorPicker.addEventListener('change', pickColor);




// make a function that randomly generates a color
// add an event listener to the random button that will toggle on/off
//  add a variable that keeps track of its true/false value

// add an if/else statement to the changeBackground function so that when random is true,
// it calls the randomColor function as the --color-choice property
// if not then it uses the colorChoice variable.


function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

randomBtn.addEventListener('click', () => {
    useRandomColor = !useRandomColor;
})






// add event listeners to the grid-size buttons
// call a function that clears the grid, creates a grid with 
// the size of the buttons value and then get the squares by calling the getSquares function

function newGrid(e) {
    const size = parseInt(this.value);
    clearGrid();
    createGrid(size);
    paintSquares();
}


const sizeButtons = [eightGridBtn, sixteenGridBtn, thirtytwoGridBtn, sixtyfourGridBtn];


sizeButtons.forEach(button => {
    button.addEventListener('click', newGrid);
})




// add a button that when clicked, toggles the grid on/off 
// set a css variable to the square border property
let gridOn = false;
function showGrid() {
    if (gridOn) {
        root.style.setProperty('--border', '.5px solid black');
    } else {
        root.style.setProperty('--border', 'none');
    }
}



gridBtn.addEventListener('click', () => {
    gridOn = !gridOn;
    showGrid();
})