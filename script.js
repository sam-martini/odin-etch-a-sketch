const gridContainer = document.querySelector('.grid-container');

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

createGrid(8);





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

getSquares();