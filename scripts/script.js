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
    let currentPlayerTurn;
    let winner;

    function start() {
        const player1 = new Player(prompt("Name of player1:"));
        const player2 = new Player(prompt("Name of player2:"));
        const players = [player1, player2];

        currentPlayerTurn = whoStartsGame(players);
        GameBoard.printBoardState();

        // GAME LOOP
        while (true) {
            console.log(`It's ${currentPlayerTurn.name}'s turn playing with the ${currentPlayerTurn.marker} marker.`);
            const selectedPosition = prompt(`Provide a position (e.g. 02 representing the row and column) for your ${currentPlayerTurn.marker} marker`);

            if (!isBoardCellFilled(selectedPosition)) {
                GameBoard.addMarkerToBoardCell(selectedPosition, currentPlayerTurn.marker);
            } else {
                console.log("This board cell is already filled, try again.");
                continue;
            }

            if (isThereWinner()) {
                const winnerObject = player1.marker === winner ? player1 : player2;
                console.log(`${winnerObject.name} wins as ${winnerObject.marker}`);
                break;
            }

            GameBoard.printBoardState();
            currentPlayerTurn = currentPlayerTurn === player1 ? player2 : player1;
        }
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

/* Game.start(); */