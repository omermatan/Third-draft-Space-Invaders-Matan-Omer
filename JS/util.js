//-----------------------------------------------------------------------------
// helpful utilities
//-----------------------------------------------------------------------------

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN} 
function createCell(gameObject = null) { 
    return { 
      type: SKY, 
      gameObject: gameObject 
    } 
  } 
   
  // Returns the element cell with the given location 
  function getElCell(pos) { 
    return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`); 
  } 

  // returns the cell's calss based on it's location
  function getClassName(location) {
    var cellClassName = 'cell-' + location.i + '-' + location.j;
    return cellClassName;
  }
   
  // returns a mat in the requested size (model)
  function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}
// returns a random number within the requested scope
function getRandomNumInc(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location);
	var elCell = document.querySelector(cellSelector);

  const prev = elCell.innerHTML;
	elCell.innerHTML = value;
  return prev;
}