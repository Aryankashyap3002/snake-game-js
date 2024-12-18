document.addEventListener('DOMContentLoaded', function () {
    const gameArena = document.querySelector('#game-arena');
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0;
    let gameStarted = false;
    let food = {x: 300, y: 200};
    let snake = [{x: 160, y: 200}, {x: 140, y: 200}, {x: 120, y: 200}];
    let intervalId;
    let gameSpeed = 200;

    let dx = cellSize;
    let dy = 0;

    function moveFood() {
        let newX, newY;
         
        do {
            newX = Math.floor(Math.random() * 30) * cellSize;
            newY = Math.floor(Math.random() * 30) * cellSize;
        } while(snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY))

        food = { x: newX, y: newY};
    }

    function updateSnake() {
        const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(newHead);

        if(newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            moveFood();

            if(gameSpeed > 50) {
                clearInterval(intervalId);
                gameSpeed -= 10;
                gameloop();
            }
        } else {
            snake.pop();
        }
    }

    function changeDirection(e) {
        const isGoingDown = dy === cellSize;
        const isGoingUp = dy === -cellSize;
        const isGoingRight = dx === cellSize;
        const isGoingLeft = dx === -cellSize;
    
        if (e.key === 'ArrowUp' && !isGoingDown) {
            dx = 0;
            dy = -cellSize;
        } else if (e.key === 'ArrowDown' && !isGoingUp) {
            dx = 0;
            dy = cellSize;
        } else if (e.key === 'ArrowLeft' && !isGoingRight) {
            dx = -cellSize;
            dy = 0;
        } else if (e.key === 'ArrowRight' && !isGoingLeft) {
            dx = cellSize;
            dy = 0;
        }
    }
    



    function drawDiv(x, y, className) {
        const divElement = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}px`;
        divElement.style.left = `${x}px`;
        return divElement;
    }

    function drawFoodAndSnake() {
        gameArena.innerHTML = '';

        snake.forEach(( snakeCell )=> {
            const snakeElement = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(snakeElement);
        })

        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);
    }

    function isGameOver() {
        for (let i = 1; i < snake.length; i++) {
            if(snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                return true;
            }
        }

        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x >= arenaSize;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y >= arenaSize;

        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function gameloop() {
        intervalId = setInterval(() => {
            if(isGameOver()) {
                clearInterval(intervalId);
                gameStarted = false;
                alert(`Game Over, Your score is ${score}`);
                return;
            }
            updateSnake();
            drawFoodAndSnake();
            drawScoreBoard();
        }, gameSpeed)
    }

    function runGame() {
        if(!gameStarted) {
            gameStarted = true;
            document.addEventListener('keydown', changeDirection);
            gameloop();
        }
    }

    function drawScoreBoard() {
        const scoreBoard = document.querySelector('#score-board');
        scoreBoard.textContent = `Score : ${score}`;

    }

    function initiateGame() {
        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'score-board';
        document.body.insertBefore(scoreBoard, gameArena);


        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-button');

        document.body.appendChild(startButton);

        startButton.addEventListener('click', function () {
            startButton.style.display = 'none';

            runGame();
        })




        

    }

    initiateGame();

})

