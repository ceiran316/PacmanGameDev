const CTX = canvas.getContext("2d");

const WALL_COLOUR = "blue";
const MAZE_COLS = 19;
const MAZE_ROWS = 22;
const WALL_HEIGHT = 30;
const WALL_WIDTH = 30;
const MAZE_BLOCK_GAP = 0;

//Ball
const ballColour = 'yellow';
ballRadius = 13;

//Ball start position
var ballX = canvas.width / 2;
var ballY = canvas.height - 163;

// keys
const keyUp = 38; // up arrow
const keyDown = 40; // down arrow
const keyLeft = 37; // left arrow
const keyRight = 39; // right arrow

// Key press states
let upPressed = false;
let downPressed = false;
let rightPressed = false;
let leftPressed = false;

// Amount (speed) to move ball x and y
let ballDX = 3;
let ballDY = 3;

// An array representing the maze grid, this is for 20 cols x 15 rows
// wall blocks are represented by 1s
let mazeGrid = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
                1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1,
                1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1,
                1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1,
                1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 
                0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0,
                1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 
                1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,  
                1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1,
                0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 
                1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
                1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 
                1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 
                1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1,
                1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 
                1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];


function drawMaze() {
    //CTX.lineWidth = '2';
    //CTX.strokeStyle = blue;
    // fill colour for wall bricks, defined above
    CTX.fillStyle = WALL_COLOUR;
    
    // Rows
    for(let r = 0; r < MAZE_ROWS; r++) {
        // Cols
        for(let c = 0; c < MAZE_COLS; c++) {
            // Calculate array position by converting c,r to 1D array
            let gridIndex = c + (MAZE_COLS * r);
            // Draw a block if array value is 1
            if (mazeGrid[gridIndex] == 1) {
                // calculate x,y for rectangle
                let reCTX = WALL_WIDTH * c;
                let rectY = WALL_HEIGHT * r;
                // calculate block width and height - leaving a gap
                let rectW = WALL_WIDTH - MAZE_BLOCK_GAP;
                let rectH = WALL_HEIGHT - MAZE_BLOCK_GAP;
                // Draw the block
                CTX.fillRect(reCTX, rectY, rectW, rectH);
            }
        }
    }
}

// Game loop
function gameLoop() {
    // clear the canvas
    CTX.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawBall();
    moveBall();
    // speed the animation of the game according to the device speed
    requestAnimationFrame(gameLoop);
}

function drawBall() {
    CTX.fillStyle = ballColour;
    CTX.beginPath();
    CTX.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    CTX.fill();
    CTX.closePath();    
}

document.addEventListener('keydown',
// anonymous function
function(event){
    if(event.keyCode == keyRight) {
        rightPressed = true;
    } else if(event.keyCode == keyLeft) {
        leftPressed = true;
    } else if(event.keyCode == keyUp) {
        upPressed = true;
    } else if(event.keyCode == keyDown) {
        downPressed = true;
    }
},
// options (none)
false);

document.addEventListener('keyup',
// anonymous function
function(event){
    if(event.keyCode == keyRight) {
        rightPressed = false;
    } else if(event.keyCode == keyLeft) {
        leftPressed = false;
    } else if(event.keyCode == keyUp) {
        upPressed = false;
    } else if(event.keyCode == keyDown) {
        downPressed = false;
    }
},
// options (none)
false);

// Move the ball by the specified amount if a key is pressed
function moveBall() {
    if(rightPressed) {
        ballX += ballDX;
    }
    else if(leftPressed) {
        ballX -= ballDX;
    }
    else if(upPressed){
        ballY -= ballDY;
    }
    else if(downPressed) {
        ballY += ballDY;
    }
}

function testCollision(ballX, ballY) {
    // Get col and row in grid
    let ballCol = Math.floor(ballX / WALL_WIDTH);
    let ballRow = Math.floor(ballY / WALL_HEIGHT);
    
    // Get array index
    let index = ballCol + (MAZE_COLS * ballRow);
    
    // test if collision
    if (mazeGrid[index] == 1) {
        return true;
    } else {
        return false;    
    }
}

function moveBall() {
    // if key is pressed and new position will not result in a collision
    if(rightPressed && !testCollision(ballX + ballDX + ballRadius, ballY)) {
        ballX += ballDX;
    }
    else if(leftPressed && !testCollision(ballX - ballDX - ballRadius, ballY)) {
        ballX -= ballDX;
    }
    else if(upPressed && !testCollision(ballX, ballY - ballDY - ballRadius)){
        ballY -= ballDY;
    }
    else if(downPressed && !testCollision(ballX, ballY + ballDY + ballRadius)) {
        ballY += ballDY;
    }    
}

// Start the game
gameLoop();

