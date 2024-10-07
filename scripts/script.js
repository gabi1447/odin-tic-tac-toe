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