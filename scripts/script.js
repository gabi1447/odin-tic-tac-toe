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

    function getMarkersArray() {
        return markersArray;
    }

    function popMarker(markerIndex) {
        markersArray.splice(markerIndex, 1);
    }

    return {
        getBoardState,
        getMarkersArray,
        popMarker
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