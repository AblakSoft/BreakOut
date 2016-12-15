var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
draw();

var score = 0;
var lives = 3;

var ballX = canvas.width/2;
var ballY = canvas.height-30;
var dx = -2;
var dy = -4;
var ballRadius = 10;
var color = getRandomColor();
//var color = "#eee";

var paddleWidth = 75;
var paddleHeight = 10;
var paddleX = (canvas.width-paddleWidth)/2;

var leftPressed = false;
var rightPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++){
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++){
        bricks[c][r] = {x: 0, y:0}
    }
}

document.addEventListener("keydown", keyDownHandler,false);
document.addEventListener("keyup", keyUpHandler,false);
document.addEventListener("mousemove", mouseMoveHandle, false);

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    collisionDetection();
    ballX += dx;
    ballY += dy;
    if(score == brickRowCount * brickColumnCount){
        alert("You won!");
        document.location.reload(true);
    }
    requestAnimationFrame(draw,5);
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = color;
    ctx.fillText("Score: "+ score, 8, 20);
}

function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = color;
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].x != canvas.width && bricks[c][r].y != canvas.height){
                bricks[c][r].x = (c * (brickWidth + brickPadding))  + brickOffsetLeft;
                bricks[c][r].y = (r * (brickHeight + brickPadding)) + brickOffsetTop;
            } 
            ctx.beginPath();
            ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
    }
}

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.x < ballX + ballRadius && b.x+brickWidth > ballX - ballRadius && b.y < ballY + ballRadius && b.y + brickHeight > ballY - ballRadius){
                dy = -dy;
                b.x = canvas.width;
                b.y = canvas.height;
                score++;
            }
        }
    }
}

function drawPaddle() {
    if(leftPressed){
        if(paddleX - 5 > 0) paddleX -= 5;
    }else if(rightPressed){
        if(paddleX + paddleWidth + 5 < canvas.width) paddleX += 5;
    }
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight,paddleWidth,paddleHeight);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    if(ballY + dy < ballRadius) {
        dy = -dy;
    }else if(ballY + dy > canvas.height-ballRadius){
        if(ballX > paddleX && ballX < paddleX + paddleWidth && ballY + ballRadius >= canvas.height - paddleHeight){
            dy = -dy;
        }else{
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                ballX = canvas.width/2;
                ballY = canvas.height-30;
                dx = -2;
                dy = -4
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    if(ballX + dx < ballRadius || ballX + dx > canvas.width-ballRadius){
        dx = -dx;
    }
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandle(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth/2;
    }
}

function getRandomColor() {
    var chars = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += chars[randomInt(0,chars.length-1)];
    }
    return color;
}

function randomInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
}