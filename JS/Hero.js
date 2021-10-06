//-----------------------------------------------------------------------------
// Player (our hero) management functions
//-----------------------------------------------------------------------------
// The different shooting speeds
const LASER_SPEED = 80;
const SUPER_LASER_SPEED = 30;
const MEGA_LASER_SPEED = LASER_SPEED;

// Global vars
var gIsLaserInSky = false;
var gIsLaserDone = false
var gHero = {pos: {i:12, j: 5}, isShoot: false}; 
var gIntervalID;
var gIsMegaShoot = false;
var gMegaShootCount = 3;
var gIsSuperShoot = false;
var gSuperShootCounter = 3;
 
// Creates the hero and places it on board 
function addHeroToBoard(board) {
    var hero = { type: SKY, gameElement: HERO };
    gGamerPos = {i: (board.length - 2),j: getRandomNumInc(0,board[0].length - 1)}
    board[gGamerPos.i][gGamerPos.j] = hero;
    return board;
} 

// Creates the birds (shields), and places them on the board 
function addBirdsToBoard(board) {
    var bird = { type: SKY, gameElement: BIRD};
    for (var j = 1; j < (board.length/3); j++)
    board[board.length - 4][j*3] = bird;
    return board;
}

// Handle game keys 
function handleKey(event) {
	var i = gGamerPos.i;
	var j = gGamerPos.j;
    var heroState = gBoard[i][j].gameElement;
    console.log(heroState);

	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1, heroState);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1, heroState);
			break;
		case ' ':
            shoot(LASER_SPEED);
			break;
        case 'n':
            megaShoot();
            break;
        case 'x':
            superShoot();
            break;
        case 'z':
            heroHidden();
            break;
    }
}

// Move the hero right (1) or left (-1) 
function moveTo(i, j, state) {
	if (gPaused) {
		return;
	}
    if (j < 0 || j > (gBoard.length -1)) {
        return;
    }
	
/*  Things I might add:
	if (targetCell.gameElement === BOMB) {
		console.log('BOMB');
		playSound();
	} */

	/* if (targetCell.gameElement === EXTRALIFE) {
		console.log('LIFE');
	}
    */
	
    // MOVING from current position
    updateCell(gGamerPos, '', '');

	// MOVING to selected position
	gGamerPos.i = i;
	gGamerPos.j = j;
    console.log(state);
    if (state === HEROHIDDEN) {
        updateCell(gGamerPos, HEROHIDDEN, HEROHID_IMG);
    } 
    else {
    updateCell(gGamerPos, HERO, HERO_IMG);
    }
}
// Starts the process for shoting (blinking) the laser up towards aliens 
function shoot(speed) {
    if (speed === undefined) {
        debugger;
    }

    if (gIsLaserInSky) {
        return;
    }
    else {
        gIsLaserInSky = true
        blinkLaser({i: gGamerPos.i-1, j: gGamerPos.j}, speed);
    }
}  

// Get called when 'n' key is pressed. (killing neighbors)
function megaShoot() {
    gIsMegaShoot = true;
    gMegaShootCount--;
    shoot(MEGA_LASER_SPEED);
    return;
}

// get called when 'x' key is pressed. (faster laser)
function superShoot() {
    if (gSuperShootCounter === 0) {
        return;
    }
    else {
        gIsSuperShoot = true;
        gSuperShootCounter--;
        shoot(SUPER_LASER_SPEED);
        return;
    }
}
// Hides the hero for 4.5 second when 'z' is pressed (barely get revealed when moving, can still shot)
function heroHidden () {
    updateCell(gGamerPos, HEROHIDDEN, HEROHID_IMG);
    setTimeout(() => {
    updateCell(gGamerPos, HERO, HERO_IMG);
    }, 4500);
}

// renders a LASER at specific cell for short time and removes it 
function blinkLaser(location, speed) {
    if (speed === undefined) {
        debugger;
    }

    if (location.i < 0) {
        // first thought was to create an explosion in the sky when laser is reaching the top,
        // found out it sometimes renders out an alien, leaving the code here to rethink it later:

        // const prev = updateCell(location, '', BOOM_IMG);
        // setTimeout(() => {
        //     updateCell(location, prev.prevElement, prev.prevImage);
        // }, 250);
        gIsLaserInSky = false;
        return;
    }
    var currGameEle = gBoard[location.i][location.j].gameElement;
    // Deals with the player shooting on a bird (shield) so there'll be an explosion, but the bird will stay put.
    if (currGameEle === BIRD) {
        updateCell(location, '', BOOM_IMG);
        setTimeout(() => {
            updateCell(location, BIRD, BIRD_IMG);
        }, 250);
        gIsLaserInSky = false;
        return
    }

    //Deals with the player hitiing an alien
    if (currGameEle === ALIEN || currGameEle === ALIE2 || currGameEle === ALIE3) {
        killAlian(location);
        gIsLaserInSky = false;

        if (gIsMegaShoot) {
            gIsMegaShoot = false;
            killNeighbors(gBoard,location);
        }
    }

    //No special hit, just the laser doing it's thing
    else {
        const prev = updateCell(location, LASER, LASER_IMG);
        
        var laserNewPos = { i:location.i - 1, j:location.j };
        setTimeout(() => {
            updateCell(location, prev.prevElement, prev.prevImage);
            blinkLaser(laserNewPos, speed);
        }, speed);
    }
    return;
}

// Deals with changes in cells on both the model and DOM. also saving changes in consts (for temporary changes)
function updateCell(location, gameElement, image) {
    if (location.i < 0 || location.i > BOARD_SIZE) {
        debugger;
    }

    if (location.j < 0 || location.j > BOARD_SIZE) {
        debugger;
    }

    const prevElement = gBoard[location.i][location.j].gameElement;
    
    gBoard[location.i][location.j].gameElement = gameElement;
    const prevImage = renderCell(location, image);

    return { prevElement, prevImage };
}

//Showing the players score on DOM
function renderScore(score) {
	var showScore = score;
	var counterElement = document.getElementById("counter");
	counterElement.innerText = showScore.toString();	
}

// Used when player is using the Mega shoot, killing the aliens around the alien that got hit.
function killNeighbors(board, location){
    for (var i = location.i - 1; i <= location.i +1; i++) {
        console.log(location.i, location.j);
        if (i < 0 || i  >= board.length ) continue;
        for (var j = location.j - 1; j <= location.j + 1; j++){
            if (j < 0 || j >= board.length) continue;
            if (i === location.i && j === location.j) continue;
            if (board[i][j].gameElement === ALIEN || board[i][j].gameElement === ALIE3 || board[i][j].gameElement === ALIE2) {
                killAlian({i:i, j:j});
            }
        }
    }
    return;
}

// Get called to deal with specific alien kill process
function killAlian(location) {
    gAlienCount--;
    updateCell(location, '', BOOM_IMG);
    // setTimeout(() => {
    //     updateCell(location, '', '');
    // }, 120);
}
