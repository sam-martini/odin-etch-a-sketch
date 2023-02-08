const gridContainer = document.querySelector('.grid-container');
const colorPicker = document.querySelector('#color-picker');
const eightGridBtn = document.querySelector('#eight-btn');
const sixteenGridBtn = document.querySelector('#sixteen-btn');
const thirtytwoGridBtn = document.querySelector('#thirtytwo-btn');
const sixtyfourGridBtn = document.querySelector('#sixtyfour-btn');


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

function changeBackground(e) {
    console.log(e.target);
    e.target.style.setProperty('--color-choice', colorChoice);
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