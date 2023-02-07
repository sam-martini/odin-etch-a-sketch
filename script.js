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