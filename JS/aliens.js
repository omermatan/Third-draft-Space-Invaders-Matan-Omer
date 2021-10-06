
//-----------------------------------------------------------------------------
// Aliens management
//-----------------------------------------------------------------------------

// Global
const ALIEN_SPEED = 500; 
var gIntervalAliens; 
var gAlienCount = 35
var gIsAlienFreeze = false;
var gIsAlienFreeze = true; 

// Move direction: 1=right, 2=left, 3=down.
var gMoveDirection = 1;
// Uses to determan direction for aliens after down movement.
var gMoveDownCounter = 1;
 
// Creates the aliens and places them on board 
function addAliensToBoard(board) {
    for (var i = 0; i < (board.length/3); i++){
        for (var j = 0; j < (board[0].length/2); j++){
            var alien = { type: SKY, gameElement: ALIEN };
            if (i % 2 === 0) {
                alien.gameElement = ALIE2;
            }
            if (i % 2 === 0 && j % 3 === 0) {
                alien.gameElement = ALIE3;
            }
            board[i][j] = alien;
        }
    }
    return board;
} 

// Deals with the automathic movements of our aliens (when called by init()'s interval)
function aliensMoving(){
    console.log(gMoveDirection);
    switch (gMoveDirection) {
        case 1:
            renderBoard(shiftBoardRight(gBoard));
            break;
        case 2:
            renderBoard(shiftBoardLeft(gBoard));
            break;
        case 3:
            renderBoard(shiftBoardDown(gBoard));
            break;
    }

}
// Checks rather the aliens reached the board's RIGHT edge 
function aliensGotToRightEdge(){
    for (i = 0; i < gBoard.length; i ++) {
        if (gBoard[i][gBoard.length -1].gameElement === ALIEN || gBoard[i][gBoard.length -1].gameElement === ALIE2 ||
             gBoard[i][gBoard.length -1].gameElement === ALIE3) {
            return true
        }
    }
    return false;
}

// Checks rather the aliens reached the board's LEFT edge
function aliensGotToLeftEdge(){
    for (i = 0; i < gBoard.length; i ++) {
        if (gBoard[i][0].gameElement === ALIEN || gBoard[i][0].gameElement === ALIE3 || gBoard[i][0].gameElement === ALIE2) {
            return true;
        }
    }
    return false;
}

/** One aliens' movement to the RIGHT 
 * @returns a new board to render with the new aliens locations
 */
function shiftBoardRight(board) {
    if (aliensGotToRightEdge()) {
        gMoveDirection = 3;
        aliensMoving();
        return board;
    }

    var nextBoard = board;
    for (var i = (board.length - 2); i >= 0; i--){
        for (var j = (board[0].length -1); j >= 0; j--){
            switch (board[i][j].gameElement) {
                case ALIEN:
                    nextBoard[i][j + 1].gameElement = ALIEN;
                    nextBoard[i][j].gameElement = '';
                    break;
                case ALIE2:
                    nextBoard[i][j + 1].gameElement = ALIE2;
                    nextBoard[i][j].gameElement = '';
                    break;
                case ALIE3:
                    nextBoard[i][j + 1].gameElement = ALIE3;
                    nextBoard[i][j].gameElement = '';
                    break;
            }
        }
    }
    
    return nextBoard;
} 
/** One aliens' movement to the LEFT
 * @returns a new board to render with the new aliens locations
 */
function shiftBoardLeft(board) {
    if (aliensGotToLeftEdge()) {
        gMoveDirection = 3;
        aliensMoving();
        return board;
    }

    var nextBoard = board;
    for (var i = 0; i < (board.length - 2); i++){
        for (var j = 0; j < (board[0].length); j++){
            switch (board[i][j].gameElement) {
                case ALIEN:
                    nextBoard[i][j - 1].gameElement = ALIEN;
                    nextBoard[i][j].gameElement = '';
                    break;
                case ALIE2:
                    nextBoard[i][j - 1].gameElement = ALIE2;
                    nextBoard[i][j].gameElement = '';
                    break;
                case ALIE3:
                    nextBoard[i][j - 1].gameElement = ALIE3;
                    nextBoard[i][j].gameElement = '';
                    break;
            }
        }
    }
    
    return nextBoard;
} 
/** One aliens' movement DOWN 
 * @returns a new board to render with the new aliens locations
 */
function shiftBoardDown(board) {
    var nextBoard = board;
    for (var i = (board.length - 2); i >= 0; i--){
        for (var j = (board[0].length -1); j >= 0; j--){
            switch (board[i][j].gameElement) {
                case ALIEN:
                    nextBoard[i + 1][j].gameElement = ALIEN;
                    nextBoard[i][j].gameElement = '';
                    break;
                case ALIE2:
                    nextBoard[i + 1][j].gameElement = ALIE2;
                    nextBoard[i][j].gameElement = '';
                    break;
                case ALIE3:
                    nextBoard[i + 1][j].gameElement = ALIE3;
                    nextBoard[i][j].gameElement = '';
                    break;
            }
        }
    }
    gMoveDownCounter++;
    if (gMoveDownCounter%2 === 0) {
        gMoveDirection = 2;
    } else { gMoveDirection = 1};
    return nextBoard;
} 
 