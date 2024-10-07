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
    
    function start() {
        const player1 = new Player(prompt("Name of player1:"));
        const player2 = new Player(prompt("Name of player2:"));
        const players = [player1, player2];

        currentPlayerTurn = whoStartsGame(players);
        console.log(GameBoard.printBoardState());

        // GAME LOOP
        while (true) {
            console.log(`It's ${currentPlayerTurn.name} playing with the ${currentPlayerTurn.marker} marker.`);
            const selectedPosition = prompt(`Provide a position (e.g. 02 representing the row and column) for your ${currentPlayerTurn.marker} marker`);

            if (!isBoardCellFilled(selectedPosition)) {
                GameBoard.addMarkerToBoardCell(selectedPosition, currentPlayerTurn.marker);
            } else {
                console.log("This board cell is already filled, try again.");
                continue;
            }

            // Check winner combinations
            
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