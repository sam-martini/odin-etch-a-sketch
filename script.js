const gridContainer = document.querySelector('.grid-container');
const colorPicker = document.querySelector('#color-picker');
const eightGridBtn = document.querySelector('#eight-btn');
const sixteenGridBtn = document.querySelector('#sixteen-btn');
const thirtytwoGridBtn = document.querySelector('#thirtytwo-btn');
const sixtyfourGridBtn = document.querySelector('#sixtyfour-btn');
const randomBtn = document.querySelector('#random-btn');


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





// get each square from the grid using queryselectorAll 
// addeventlistener to all and look for a click
// call a function that changes the background color of the 
// target square by using a css variable

//  the color choice is stored in a variable that will change
//  depending on user input

let colorChoice = 'black';
let useRandomColor = false;

function changeBackground(e) {
    console.log(e.target);
    if (useRandomColor) {
        e.target.style.setProperty('--color-choice', randomColor());
    } else {
        e.target.style.setProperty('--color-choice', colorChoice);
    }
}

function getSquares() {
    const squares = gridContainer.querySelectorAll('.square');
    console.log(squares);

    squares.forEach(square => {
        square.addEventListener('click', changeBackground);
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
    getSquares();
}


const sizeButtons = [eightGridBtn, sixteenGridBtn, thirtytwoGridBtn, sixtyfourGridBtn];


sizeButtons.forEach(button => {
    button.addEventListener('click', newGrid);
})