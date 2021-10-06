//-----------------------------------------------------------------------------
// Game management functions
//-----------------------------------------------------------------------------

// Square board size
const BOARD_SIZE = 14; 

// Cell images
const HERO_IMG      = '<img src="img/hero.png" />';
const ALIEN_IMG     = '<img src="img/alien.png" />';
const LASER_IMG     = '<img src="img/Laser.png" />';
const BOOM_IMG      = '<img src="img/boom.png" />';
const BIRD_IMG      = '<img src="img/bird.png" />';
const BIRDDEAD_IMG  = '<img src="img/birdDead.png" />'; 
const LAND_IMG      = '<img src="img/land.png" />'; 
const STAR_IMG      = '<img src="img/star.png" />';
const ALIEN2_IMG    = '<img src="img/alientwo.png" />';
const ALIEN3_IMG    = '<img src="img/alienthree.png" />'; 
const HEROHID_IMG   = '<img src="img/herohidden.png" />'; 
const ALIENLASER_IMG   = '<img src="img/alienLaser.png" />'; 


// Game elements
const HERO  = '♆'; 
const HEROHIDDEN ='H'
const ALIEN = '👽A'; 
const ALIE2 = '👽B'; 
const ALIE3 = '👽C'; 
const LASER = '⤊'; 
const BIRD  = '#'
const STAR  = '*'

// Cell backgrounds
const SKY    = 'sky';
const EARTH  = 'earth';
const PLAYER = 'player';

// Global
var gBoard;
var gPaused = false;       // indicates if game is paused
var gGamerPos = {i:2,j:3}; // position of gamer
 
/**
 * Initializes the game. Called when the page is loaded or when "restart" is clicked.
 */
function init() {
	heroScore = 0;
    renderBoard(createBoard());
 	gIntervalAliensID = setInterval(() => {
		aliensMoving();
		endGameVerifier();
	}, 1100);
	
} 

/**
 * Create and returns the board with aliens on top, ground at bottom 
 * use the functions: createCell, createHero, createAliens  
 * 
 * @returns a matrix that represents the board (DOM).
 */
function createBoard() {
    // Create the Matrix
	var board = createMat(BOARD_SIZE, BOARD_SIZE);

	// Put SKY everywhere and EARTH on the bottom
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {

			// Put SKY in a regular cell
			var cell = { type: SKY, gameElement: '' };
			board[i][j] = cell;

			// Place Walls at edges
			if (i === (board.length - 1)) {
				cell.type = EARTH;
				cell.gameElement = EARTH;
			}
		}
	}

    gBoard = board;
	// Following functions are called to deal with creating the game elements
    addHeroToBoard(board);
    addAliensToBoard(board);
	addBirdsToBoard(board);
    gBoard = board;

    return board;
}

/**
 * Renders the board as an HTML table on the page.
 * 
 * @param board The board DOM
 */
function renderBoard(board) {
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];
			
			var cellClass = getClassName({ i, j })

			cellClass += (currCell.type === SKY) ? ' sky' : ' earth';
			strHTML += `\t<td class="cell ${cellClass}">\n`;
		
			switch (currCell.gameElement) {
				case HERO:
					strHTML += HERO_IMG;
					break;
				case ALIEN:
					strHTML += ALIEN_IMG;
					break;	
				case ALIE2:
					strHTML += ALIEN2_IMG;
					break;
				case ALIE3:
					strHTML += ALIEN3_IMG;
					break;
				case BIRD:
					strHTML += BIRD_IMG;
					break;	
				case EARTH:
					strHTML += LAND_IMG;
					break;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

/**
 * Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN} 
 */
function createCell(gameObject = null) { 
    return { 
        type: SKY, 
        gameObject: gameObject
	}
}

/**
 * @returns the number of aliens
 */
function countAliens() {
	var count = 0;
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard.length; j++) {
			if (gBoard[i][j].gameElement === ALIEN) {
				count++;
			}
		}
	}

	return count;
}

/**
 * @returns true if aliens reached the earth
 */
function aliensOnEarth() {
	for (var j = 0 ; j < (gBoard.length - 1); j++){
		var i =	(gBoard.length - 2);
		if (gBoard[i][j].gameElement === ALIEN) {
			return true;
		}
	}
	return false;
}

/**
 * Checks if the game ended (either victory or aliens reached earth) and displays
 * end of game messages as needed.
 */
function endGameVerifier() {
	var alienCount = countAliens(); 

	renderScore(alienCount);

	if (alienCount === 0) {
		victory();
		clearInterval(gIntervalAliensID);
		return;
	}
	
	if (aliensOnEarth()) {
		earthIsLost();
		clearInterval(gIntervalAliensID);
		return;
	}
}

// Displays the victory message.
function victory() {
	displayMessage('VICTORY! Thank you! you SAVED EARTH!');
}

//Displays loosing message.
function earthIsLost() {
	displayMessage('You LOST! Aliens landed on earth! we are DOOMED!');
}

/**
 * Displays a message on screen (after a short delay).
 * @param message The message to display
 */
function displayMessage(message) {
	setTimeout(() => alert(message), 120);
}
