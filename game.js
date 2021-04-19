/**
Project 2 - Team Mysterious - Web Programming
Project name: The Game of Life
Team members: Tin Huynh, Hyunki Lee, JiaWen Li, Sang Kim, Isaiah Smith

Version: 1.0 beta
*/

//Set rows and cols
var rows = 40;
var cols = 80;

var lockBoard = false;

//Initialize generation count
var generation = 0;
var genCount = -1;

//Initialize grid array
var grid;
var nextGen;

//Set timer
var timer;

//Initialize buttons
var startButton = document.getElementById('start');
var stopButton = document.getElementById('stop');
var clearButton = document.getElementById('clear');
var randomButton = document.getElementById("random");
var next1Gen = document.getElementById('next1');
var next23Gen = document.getElementById("next23");

//Load the game when the page is loaded
window.onload = setup();

//Initialize variables and start the games
function setup() {
    //Initialize grids
    grid = new Array(rows).fill(null).map(() => new Array(cols).fill(null));
    nextGen = new Array(rows).fill(null).map(() => new Array(cols).fill(null));

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

//Initialize lay out for the board
//Credit: https://codepen.io/RBSpatz/pen/rLyNLb-----
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
    //Set all table cell to dead
    for (var i = 0; i < rows; i++) {
    	for (var j = 0; j < cols; j++) {
    		var cell = document.getElementById(i + "_" + j).setAttribute("class", "dead");
    	}
    }

    //Fill all grid cell to 0
    for (var i = 0; i < rows; i++) {
    	grid[i].fill(0);
    	nextGen[i].fill(0);
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
    } else if(patternOption == 7){
        //Glider
        setCell(grid, row, col);
        setCell(grid, row, col-1);
        setCell(grid, row, col-2);
        setCell(grid, row-1, col);
        setCell(grid, row-2, col-1);
    } else if(patternOption == 8){
        //Lightweight Spaceship
        setCell(grid, row, col);
        setCell(grid, row, col-1);
        setCell(grid, row, col-2);
        setCell(grid, row, col-3);

        setCell(grid, row-1, col);
        setCell(grid, row-2, col);

        setCell(grid, row-3, col-1);
        setCell(grid, row-1, col-4);
        setCell(grid, row-3, col-4);
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

//Start game
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

//Go to the next generation
function set1Gen(){
	lockBoard=true;
	genCount = 1;
	while(genCount > 0){
		displayNextGen();
		genCount--;
	}
	stopGame();
}

//Go to the next 23 generation
function set23Gen(){
	lockBoard=true;
	genCount = 23;
	while(genCount > 0){
		displayNextGen();
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

//Credit: https://www.youtube.com/watch?v=deXzu0Eregs
function displayNextGen() {
	//Applying the rules and count neighbors
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			var numNeighbors = countNeighbors(i, j);
			if(grid[i][j] == 1 && numNeighbors < 2) {
		    	//If current cell is alive and numNeighbors is less than 2
		    	//Current cell will die in the next generation due to underpopulation
		    	nextGen[i][j] = 0;
		    } else if(grid[i][j] == 1 && numNeighbors > 3){
		    	//If current cell is alive and numNeighbors is more than 2
		    	//Current cell will die in the next generation due to overpopulation
		    	nextGen[i][j] = 0;
		    } else if(grid[i][j] == 0 && numNeighbors == 3){
		    	//If current cell is dead and numNeighbors equals to 3
		    	//Current cell will become alive in the next generation
		    	nextGen[i][j] = 1;
		    } else{
		    	//Otherwise, the current cell's state will stay the same
		    	nextGen[i][j] = grid[i][j];
		    }
		}
	}

	//Set cell dead or alive for the next generation
    for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			grid[i][j] = nextGen[i][j];
			if (grid[i][j] == 1) {
				document.getElementById(i + "_" + j).setAttribute("class", "live");
			} else {
				document.getElementById(i + "_" + j).setAttribute("class", "dead");
			}
		}
	}

    //Update generation count
    generation++;
    document.getElementById("generation").innerHTML = generation;
}//---------End Credit

//Credit: https://codepen.io/RBSpatz/pen/rLyNLb----------
function play() {
	lockBoard=true;
	displayNextGen();
	timer = setTimeout(play, 100);	
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
