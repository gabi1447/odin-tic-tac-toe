const GeneralModule = (function() {
    function getRandomNumber(totalRange) {
        return Math.floor(Math.random() * totalRange);
    }

    return {
        getRandomNumber
    }
})();

const GameBoard = (function() {
    let currentBoardState = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    let markersArray = ['x', 'o'];

    function getBoardState() {
        return currentBoardState;
    }

    function printBoardState() {
        const board = currentBoardState;
        console.log(`${board[0]}\n${board[1]}\n${board[2]}`);
    }

    function addMarkerToBoardCell(stringPosition, playerMarker) {
        let [row, col] = stringPosition.split("");
        if (isPositionValid(+row, +col)) {
            currentBoardState[+row][+col] = playerMarker;
        }
    }

    function isPositionValid(row, col) {
        if (row >= 0 && row < 3 && col >= 0 && col < 3) {
            return true;
        }
        return false;
    }

    function getMarkersArray() {
        return markersArray;
    }

    function popMarker(markerIndex) {
        markersArray.splice(markerIndex, 1);
    }

    return {
        getBoardState,
        addMarkerToBoardCell,
        getMarkersArray,
        popMarker, 
        printBoardState
    }
})();

const Game = (function() {
    const renderEvent = new Event('renderBoard');

    let currentPlayerTurn;
    let winner;
    let gameStarted = false;

    function start() {
        gameStarted = true;
        let selectedPosition;
        const gameInfo = document.querySelector(".game-info");

        const player1 = new Player(prompt("Name of player1:"));
        const player2 = new Player(prompt("Name of player2:"));
        const players = [player1, player2];

        currentPlayerTurn = whoStartsGame(players);
        GameBoard.printBoardState();

        // GAME LOOP
        async function asyncGameLoop() {
            if (gameStarted) {
                // Render marker in boardCell with a click event
                console.log(`It's ${currentPlayerTurn.name}'s turn playing with the ${currentPlayerTurn.marker} marker.`);
                gameInfo.textContent = `It's ${currentPlayerTurn.name}'s turn playing with the ${currentPlayerTurn.marker.toUpperCase()} marker.`;
                selectedPosition = await DomEvents.registerClickOnBoardCell();
    
                if (!isBoardCellFilled(selectedPosition)) {
                    GameBoard.addMarkerToBoardCell(selectedPosition, currentPlayerTurn.marker);
                    document.dispatchEvent(renderEvent);
                } else {
                    console.log("This board cell is already filled, try again.");
                    gameInfo.textContent = "This board cell is already filled, try again.";
                    asyncGameLoop();
                }
    
                if (isThereWinner()) {
                    const winnerObject = player1.marker === winner ? player1 : player2;
                    console.log(`${winnerObject.name} wins as ${winnerObject.marker}`);
                    gameInfo.textContent = `${winnerObject.name} wins as ${winnerObject.marker}`;
                    gameStarted = false;
                    asyncGameLoop();
                } else if (isBoardFilled()) {
                    console.log(`There's a Tie between ${player1.name} and ${player2.name}`);
                    gameInfo.textContent = `There's a Tie between ${player1.name} and ${player2.name}`;
                    gameStarted = false;
                    asyncGameLoop();
                }
    
                GameBoard.printBoardState();
                currentPlayerTurn = currentPlayerTurn === player1 ? player2 : player1;
                setTimeout(asyncGameLoop, 0);
            }
        }
        asyncGameLoop();
    }

    function isBoardFilled() {
        const board = GameBoard.getBoardState();
        for (let i = 0; i < board.length; i++) {
            if (board[i].some(cell => {
                return cell === 0;
            })) {
                return false;
            }
        }
        return true;
    }

    function isBoardCellFilled(selectedPosition) {
        const [row, col] = selectedPosition.split("");
        const board = GameBoard.getBoardState();

        return board[+row][+col] === 0 ? false : true;
    }

    function whoStartsGame(arrayObjectPlayers) {
        const randomIndex = GeneralModule.getRandomNumber(arrayObjectPlayers.length);
        return arrayObjectPlayers[randomIndex];
    }

    function isThereWinner() {
        const board = GameBoard.getBoardState();

        // Possible winning combinations
        const possibleWinningCombinations = {
            row1: board[0],
            row2: board[1],
            row3: board[2],
            col1: [board[0][0], board[1][0], board[2][0]],
            col2: [board[0][1], board[1][1], board[2][1]],
            col3: [board[0][2], board[1][2], board[2][2]],
            diagonal1: [board[0][0], board[1][1], board[2][2]], 
            diagonal2: [board[0][2], board[1][1], board[2][0]], 
        }
        return checkWinningCombination(possibleWinningCombinations);
    }

    function checkWinningCombination(combinations) {
        for (key in combinations) {
            if (combinations[key].every(cell => {
                return cell === 'x';
            })) {
                winner = 'x';
                return true;
            } else if (combinations[key].every(cell => {
                return cell === 'o';
            })) {
                winner = 'o';
                return true;
            }
        }
        return false;
    }

    return {
        start
    }
})();

function Player(playerName) {
    const name = playerName;
    const marker = generateMarker();

    function generateMarker() {
        const markers = GameBoard.getMarkersArray()
        if (markers.length == 2) {
            const randomIndex = GeneralModule.getRandomNumber(2);
            playerMarker = markers[randomIndex];
            GameBoard.popMarker(randomIndex);
            return playerMarker;
        } else {
            return GameBoard.getMarkersArray()[0];
        }
    }

    return {
        name,
        marker
    }
}

const DomEvents = (function() {
    const rowColToCellIds = {
        0: {
            0: 'one',
            1: 'two',
            2: 'three'
        },
        1: {
            0: 'four',
            1: 'five',
            2: 'six'
        },
        2: {
            0: 'seven',
            1: 'eight',
            2: 'nine'
        }
    }

    const cellIdToRowCol = {
        one: '00',
        two: '01',
        three: '02',
        four: '10',
        five: '11',
        six: '12',
        seven: '20',
        eight: '21',
        nine: '22'
    }

    function startGame() {
        Game.start();
    }

    function attachStartEventListener() {
        const startButton = document.querySelector('#start');
        startButton.addEventListener("click", startGame);
    }

    function registerClickOnBoardCell() {
        return new Promise((resolve) => {
            const boardContainer = document.querySelector('.board-container');
            boardContainer.addEventListener("click", (event) => {
                if (event.target.className === 'board-cell') {
                    const stringRowCol = cellIdToRowCol[event.target.id];
                    resolve(stringRowCol);
                }
            })
        });
    }

    function renderBoardState() {
        const board = GameBoard.getBoardState();
        let boardCell;
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board.length; col++) {
                if (board[row][col] !== 0) {
                    const boardCellId = rowColToCellIds[row][col];
                    boardCell = document.querySelector(`#${boardCellId}`);
                    boardCell.textContent = board[row][col];
                }
            }
        }
    }

    function attachRenderBoardEvent() {
        document.addEventListener("renderBoard", renderBoardState);
    }

    function attachEventListeners() {
        attachStartEventListener();
        attachRenderBoardEvent();
    }

    return {
        attachEventListeners,
        registerClickOnBoardCell
    }
})();

DomEvents.attachEventListeners();