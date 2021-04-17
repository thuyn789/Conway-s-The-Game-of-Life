//Set rows and cols
var rows = 40;
var cols = 100;

var lockBoard = false;

//Initialize generation count
var generation = 0;
var genCount = -1;

//Initialize grid array
var grid = new Array(rows);
var nextGrid = new Array(rows);

//Set timer
var timer;
var reproductionTime = 100;

//Initialize buttons
var startButton = document.getElementById('start');
var stopButton = document.getElementById('stop');
var clearButton = document.getElementById('clear');
var randomButton = document.getElementById("random");
var next1Gen = document.getElementById('next1');
var next23Gen = document.getElementById("next23");

// Load the game when the page is loaded
window.onload = setup();

// Initialize variables and start the games
function setup() {
    //Initialize first grid
    for (var i = 0; i < rows; i++)
    {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }

    //Initialize table
    initializeTable();
    resetGrids();

    //Initialize buttons
    startButton.onclick = startGame;
    stopButton.onclick = stopGame;
    clearButton.onclick = clearTable;
    randomButton.onclick = randomizeTable;
    next1Gen.onclick = set1Gen;
    next23Gen.onclick = set23Gen;
}

// Lay out the board
// Credit: https://codepen.io/RBSpatz/pen/rLyNLb-----
function initializeTable() {
    var gridContainer = document.getElementById('gridContainer');
    
    var table = document.createElement("table");
    
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {//
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = patternHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}//--------End Credit

//Clear all cell and set them to dead
function resetGrids() {
    //Fill all grid cell to 0
    for (var i = 0; i < rows; i++) {
        grid[i].fill(0);
        nextGrid[i].fill(0);
    }

    //Set all table cell to dead
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "_" + j).setAttribute("class", "dead");
        }
    }

    //Set Generation to 0
    generation = 0;
    document.getElementById("generation").innerHTML = generation;
}

//Get desired pattern from player
function getPatternOption(){
    //Prevent from choosing if the game is running
    if(lockBoard){
        return;
    }

    //Get data from the drop down selection
    var pattern = document.getElementById('patterns');
    return parseInt(pattern.value);
}

//This function will handle pattern input from player
function patternHandler() {
    if(lockBoard){
        return;
    }

    //Get the id of the cell that was clicked
    var rowcol = this.id.split("_");
    var row = parseInt(rowcol[0]);
    var col = parseInt(rowcol[1]);

    var patternOption = getPatternOption();

    //Set pattern for the game based on player's selection
    if(patternOption == 2){
        //Still Life: Block
        setCell(grid, row, col);
        setCell(grid, row, col-1);
        setCell(grid, row-1, col);
        setCell(grid, row-1, col-1);
    } else if(patternOption == 3){
        //Still Life: Beehive
        setCell(grid, row, col);
        setCell(grid, row, col-1);
        setCell(grid, row-1, col-2);
        setCell(grid, row-2, col);
        setCell(grid, row-2, col-1);
        setCell(grid, row-1, (col+1));
    } else if(patternOption == 4){
        //Oscillators: Blinker
        setCell(grid, row, col);
        setCell(grid, row, col-1);
        setCell(grid, row, col-2);
    } else if(patternOption == 5){
        //Oscillators: Beacon
        setCell(grid, row, col);
        setCell(grid, row, col-1);
        setCell(grid, row-1, col);

        setCell(grid, row-3, col-2);
        setCell(grid, row-3, col-3);
        setCell(grid, row-2, col-3);
    } else if(patternOption == 6){
        //Oscillators: Toad
        setCell(grid, row, col);
        setCell(grid, row, col-1);
        setCell(grid, row, col-2);

        setCell(grid, row+1, col-1);
        setCell(grid, row+1, col-2);
        setCell(grid, row+1, col-3);
    } else{
        setCell(grid, row, col);
    }

}

//This function will set the cell dead to alive and alive to dead
function setCell(arr, row, col){
    if(row <= 0 || row <= 0){
        return;
    }
    if(arr[row][col] == 1) {
        var cell = document.getElementById(row + "_" + col).setAttribute("class", "dead");
        arr[row][col] = 0;
    } else if (arr[row][col] == 0) {
        var cell = document.getElementById(row + "_" + col).setAttribute("class", "live");
        arr[row][col] = 1;
    }
}

// Start game
function startGame() {
    if (lockBoard) {
        return;
    }

    lockBoard = true;
    play();
    
}
//Stop/pause game
function stopGame(){
    lockBoard = false;
    clearTimeout(timer);
}

// clear the table
function clearTable() {
    lockBoard = false;  
    clearTimeout(timer);
    resetGrids();
}


function play() {
    computeNextGen();
    
    if (lockBoard) {
        timer = setTimeout(play, reproductionTime);
    }
}

//Go to the next generation
function set1Gen(){
    lockBoard=true;
    genCount = 1;
    while(genCount > 0){
        play();
        genCount--;
    }
    stopGame();

}

//Go to the next 23 generation (roughly)
function set23Gen(){
    lockBoard=true;
    genCount = 23;
    while(genCount > 0){
        play();
        genCount--;
    }
    stopGame();
}

//This function will randomize the table
function randomizeTable() {
    if (lockBoard) {
        return;
    }

    resetGrids();

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = Math.floor(Math.random() * 2);
            if (grid[i][j] == 1) {
                var cell = document.getElementById(i + "_" + j).setAttribute("class", "live");
            }
        }
    }
}
//// Credit: https://codepen.io/RBSpatz/pen/rLyNLb----------
function copyAndResetGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

function updateView() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "_" + j);
            if (grid[i][j] == 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}

function computeNextGen() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    
    // copy NextGrid to grid, and reset nextGrid
    copyAndResetGrid();
    // copy all 1 values to "live" in the table
    updateView();

    //Update generation count
    generation++;
    document.getElementById("generation").innerHTML = generation;

}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

function applyRules(row, col) {
    var numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
        if (numNeighbors == 3) {
            nextGrid[row][col] = 1;
        }
    }
}

function countNeighbors(row, col) {
    var count = 0;
    if (row-1 >= 0) {
        if (grid[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < cols) {
        if (grid[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (grid[row][col-1] == 1) count++;
    }
    if (col+1 < cols) {
        if (grid[row][col+1] == 1) count++;
    }
    if (row+1 < rows) {
        if (grid[row+1][col] == 1) count++;
    }
    if (row+1 < rows && col-1 >= 0) {
        if (grid[row+1][col-1] == 1) count++;
    }
    if (row+1 < rows && col+1 < cols) {
        if (grid[row+1][col+1] == 1) count++;
    }
    return count;
}//---------End Credit

