var player = [];	// Array which holds player values. I.E. X, Y, Speed, Colour
var context; 		// Canvas context (2d)
var cHeight; 		// Canvas height
var cWidth; 		// Canvas width
var pSize = 6;		// Player size in pixels
var grid = []; 		// Array which holds what is contained in each grid piece
var interval;		// Variable to hold main recurring function (main)s
var game = {time: 0, winner: 0};
var score = [0,0,0];

$(document).ready(function() {
	//Calls bindKeys which will bind keystrokes to functions
	$(document).keydown(function(e){ 
       bindKeys(e); 
    });

    mycanvas = document.getElementById("tronCanvas");
    context = mycanvas.getContext('2d');
	if (mycanvas.width % pSize) mycanvas.width = (Math.floor(mycanvas.width / pSize)) * pSize; //Make grid width divisible by player size
	if (mycanvas.height % pSize) mycanvas.height = (Math.floor(mycanvas.height / pSize)) * pSize; //Make grid height divisible by player size
	if ((mycanvas.width / pSize) % 2 == 0) mycanvas.width -= pSize; //Make grid block height odd
	if ((mycanvas.height / pSize) % 2 == 0) mycanvas.height -= pSize; //Make grid block width odd
    cWidth = mycanvas.width;
    cHeight = mycanvas.height;
	createGrid();
	createPlayers();
	intro();
});

function main() {
	drawBackground();
	for (i=1; i<player.length; i++) {
		drawPlayer(i);
		movePlayer(i);
	}
	
	if (player[1].status == 0 || player[2].status == 0) {
		if (player[1].status == 0 && player[2].status == 0) {
			game.winner = 0;
		} else if (player[1].status == 0) {
			game.winner = 2;
			score[game.winner]++;
		} else if (player[2].status == 0) {
			game.winner = 1;
			score[game.winner]++;
		}
		stop();
	}
}

// 0: Empty
// 1-4: Player
function createGrid() {
	y = Math.floor(cHeight / pSize);
	grid = new Array(y);
	x = Math.floor(cWidth / pSize);
	for (i=0; i<=x; i++) {
		grid[i] = new Array(y);
		for (j=0; j<=y; j++) {
			grid[i][j] = 0;
		}
	}
	grid[1][0] = x; //grid[1][0] represents how many blocks wide the arena is
	grid[0][1] = y; //grid[0][1] represents how many blocks high the arena is
}

function createPlayers() {
	x1 = Math.floor(grid[1][0] * 0.175);
	x2 = grid[1][0] - x1;
	y = Math.floor(grid[0][1] / 2);
	player = [
			{},
			{x: x1, y: y, xSpeed: 1, ySpeed: 0, colour: "#f00", status: 1},
			{x: x2, y: y, xSpeed: -1, ySpeed: 0, colour: "#00f", status: 1}
	];
}

function intro() {
	drawBackground();
	writeText("HTML5 Tron", 20, 240, 100);
	writeText("Press Space to Start", 20, 205, 140);

	writeText("Player 1", 20, 125, 200);
	writeText("W: Up", 20, 125, 235);
	writeText("S: Down", 20, 125, 260);
	writeText("A: Left", 20, 125, 285);
	writeText("D: Right", 20, 125, 310);


	writeText("Player 2", 20, 385, 200);
	writeText("↑: Up", 20, 385, 235);
	writeText("↓: Down", 20, 385, 260);
	writeText("←: Left", 20, 385, 285);
	writeText("→: Right", 20, 385, 310);
}

function movePlayer(i) {
	player[i].x += player[i].xSpeed;
	player[i].y += player[i].ySpeed;

	if (player[i].x <= 0 || player[i].x > grid[1][0] || player[i].y <= 0 || player[i].y > grid[0][1] || grid[player[i].x][player[i].y]) {  // If any collisions
		player[i].status = 0;
	} else { // Only move player if player alive
		grid[player[i].x][player[i].y] = i;
	}
}

function drawPlayer(i) {
	context.fillStyle = player[i].colour;
	context.fillRect((player[i].x * pSize) - pSize, (player[i].y * pSize) - pSize, pSize, pSize);
	context.stroke();
}

function drawBackground() {
	context.lineWidth = 1;
	context.fillStyle = "#dddddd";
	context.fillRect(0, 0, cWidth, cHeight);
	x = grid[1][0];
	y = grid[0][1];
	for (i=1; i<=x; i++) {
		for (j=1; j<=y; j++) {
			if (grid[i][j]) {
				context.fillStyle = player[grid[i][j]].colour;
				context.fillRect((i * pSize) - pSize, (j * pSize) - pSize, pSize, pSize);
			}
		}
	}
	writeText("Player 1: " + score[1], 15, 10, 25);
	writeText("Player 2: " + score[2], 15, 10, 50);
}

function start() {
	context.clearRect(0, 0, cWidth, cHeight);
	createGrid();
	createPlayers();
	drawBackground();
	clearInterval(interval);
	interval = setInterval("main()", 40);
}

function stop() {
	clearInterval(interval);
	
	if (game.winner) { 
	writeText("Player " + game.winner + " wins!", 20, 225, 100);
	} else {
	writeText("It's a draw!", 20, 250, 100);	
	}
	
	writeText("Press Space to restart", 20, 205, 140);
}

function writeText(txt, sze, x, y) {
	context.font = sze + "px tahoma";
	context.fillStyle = "#000000";
	context.fillText(txt, x, y);
}

/////___Keys___/////
function bindKeys(e) {
	switch (e.keyCode) {
		case 32:
			keySpace();
			break;
		case 38:
			keyUp();
			break;
		case 40:
			keyDown();
			break;
		case 37:
			keyLeft();
			break;
		case 39:
			keyRight();
			break;
		case 87:
			keyW();
			break;
		case 83:
			keyS();
			break;
		case 65:
			keyA();
			break;
		case 68:
			keyD();
			break;			
	}
}

function keyUp() {
	if (player[2].xSpeed) {
		player[2].xSpeed = 0;
		player[2].ySpeed = -1;
	}
}

function keyDown() {
	if (player[2].xSpeed) {
		player[2].xSpeed = 0;
		player[2].ySpeed = 1;
	}
}

function keyLeft() {
	if (player[2].ySpeed) {
	player[2].xSpeed = -1;
	player[2].ySpeed = 0;
	}
}

function keyRight() {
	if (player[2].ySpeed) {
	player[2].xSpeed = 1;
	player[2].ySpeed = 0;
	}
}

function keyW() {
	if (player[1].xSpeed) {
		player[1].xSpeed = 0;
		player[1].ySpeed = -1;
	}
}

function keyS() {
	if (player[1].xSpeed) {
		player[1].xSpeed = 0;
		player[1].ySpeed = 1;
	}
}

function keyA() {
	if (player[1].ySpeed) {
	player[1].xSpeed = -1;
	player[1].ySpeed = 0;
	}
}

function keyD() {
	if (player[1].ySpeed) {
	player[1].xSpeed = 1;
	player[1].ySpeed = 0;
	}
}

function keySpace() {
	start();
}