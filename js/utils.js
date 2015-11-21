if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

if (!Array.prototype.clone) {
  Array.prototype.clone = function() {
    return JSON.parse(JSON.stringify(this));
  };
}

if (!Array.prototype.contains) {
  Array.prototype.contains = function(element) {
    return this.indexOf(element) !== -1;
  };
}

function printMatrix(matrix) {
	console.log('---------------');
	for (var r = 0; r < matrix.length; r++) {
		var row = "";
		for (var c = 0; c < matrix[r].length; c++) {
			row += ("          " + matrix[r][c].carriage).slice(-10);
		}
		console.log(row);
	}
	console.log('---------------');
} 