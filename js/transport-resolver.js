function TransportResolver(consumers, warehouses, transportCosts) {
	this.consumers = consumers.clone();
	this.warehouses = warehouses.clone();
	this.transportCosts = transportCosts.clone();
	this.goodsCount = 0;
	for (var i = 0; i < this.warehouses; i++) {
		this.goodsCount += this.warehouses[i];
	}
}

TransportResolver.prototype.resolve = function() {
	this.transportMatrices = [];
	this.baseVariables = this.consumers.length + this.warehouses.length - 1;
	this.findInitialTransportMatrix();
	var iteration = 1;

	while (true) {
		console.log("--------");
		console.log("Iteration: " + iteration);
		var matrix = this.transportMatrices[this.transportMatrices.length - 1];
		console.log("Martix value: " + this.getMatrixValue(matrix));
		console.log("calculatePotentials");
		this.calculatePotentials(matrix);
		console.log("calculateCarriages");
		this.calculateCarriages(matrix);
		var newBaseField = this.findNewBaseField(matrix);
		console.log("findNewBaseField: " + newBaseField);
		if (newBaseField === null) {
			console.log("no negative field found. Final result: " + this.getMatrixValue(matrix));
			return;
		}
		console.log("findContour");
		this.findContour(matrix, newBaseField);
		console.log("findGoodsCountToRedistribute");
		this.findGoodsCountToRedistribute(matrix);
		console.log("createNewMatrix");
		var newMatrix = this.createNewMatrix(matrix);
		this.transportMatrices.push(newMatrix);
		iteration++;
		
		// TODO: REMOVE
		if (iteration == 20) {
			console.log("TODO: REMOVE THIS BLOCK");
			return;
		}
	}
}

TransportResolver.prototype.findInitialTransportMatrix = function() {
	var matrix = new TransportMatrix(this.warehouses.length, this.consumers.length);

	for (var c = 0; c < this.consumers.length; c++) {
		for (var w = 0; w < this.warehouses.length; w++) {
			if (this.consumerIsSatisfied(c, matrix)) {
				break;
			}
			if (this.warehouseIsEmpty(w, matrix)) {
				continue;
			}

			var takeFromWarehouse = this.consumerNeeds(c, matrix);
			var leftInWarehouse = this.leftInWarehouse(w, matrix);
			if (leftInWarehouse < takeFromWarehouse) {
				takeFromWarehouse = leftInWarehouse;
			}
			matrix.setConsumerCarriage(w, c, takeFromWarehouse);
		}
	}
	this.addExtraBasesIfNeeded(matrix);
	this.transportMatrices.push(matrix);
}

TransportResolver.prototype.consumerNeeds = function(consumerId, matrix) {
	return this.consumers[consumerId] - this.consumerGoodsCount(consumerId, matrix);
}

TransportResolver.prototype.leftInWarehouse = function(warehouseId, matrix) {
	return this.warehouses[warehouseId] - this.takenFromWarehouse(warehouseId, matrix);
}

TransportResolver.prototype.consumerGoodsCount = function(consumerId, matrix) {
	var goodsCount = 0;
	for (var i = 0; i < this.warehouses.length; i++) {
		goodsCount += matrix.getConsumerCarriage(i, consumerId) || 0;
	}
	return goodsCount;
}

TransportResolver.prototype.consumerIsSatisfied = function(consumerId, matrix) {
	return this.consumerGoodsCount(consumerId, matrix) === this.consumers[consumerId];
}

TransportResolver.prototype.takenFromWarehouse = function(warehouseId, matrix) {
	var takenFromWarehouse = 0;
	for (var i = 0; i < this.consumers.length; i++) {
		takenFromWarehouse += matrix.getConsumerCarriage(warehouseId, i) || 0;
	}
	return takenFromWarehouse;
}

TransportResolver.prototype.warehouseIsEmpty = function(warehouseId, matrix) {
	return this.takenFromWarehouse(warehouseId, matrix) === this.warehouses[warehouseId];
}

TransportResolver.prototype.calculatePotentials = function(matrix) {
	matrix.uPotentials[0] = 0;

	while (!this.allPotentialsAreCalculated(matrix)) {
		for (var w = 0; w < matrix.getWarehousesCount(); w++) {
			for (var c = 0; c < matrix.getConsumersCount(); c++) {
				if (matrix.consumerCarriageExists(w, c)) {
					if (!matrix.uPotentialExists(w) && matrix.vPotentialExists(c)) {
						matrix.setUPotential(w, -matrix.getVPotential(c) - this.transportCosts[w][c]);
					} else if (matrix.uPotentialExists(w) && !matrix.vPotentialExists(c)) {
						matrix.setVPotential(c, -matrix.getUPotential(w) - this.transportCosts[w][c]);
					}
				}
			}
		}
	}
}

TransportResolver.prototype.allPotentialsAreCalculated = function(matrix) {
	for (var i = 0; i < matrix.uPotentials.length; i++) {
		if (matrix.uPotentials[i] == null) {
			return false;
		}
	}
	for (var i = 0; i < matrix.vPotentials.length; i++) {
		if (matrix.vPotentials[i] == null) {
			return false;
		}
	}
	return true;
}

TransportResolver.prototype.calculateCarriages = function(matrix) {
	for (var w = 0; w < matrix.getWarehousesCount(); w++) {
		for (var c = 0; c < matrix.getConsumersCount(); c++) {
			if (!matrix.consumerCarriageExists(w, c)) {
				matrix.setConsumerCarriageModification(w, c, this.transportCosts[w][c]
																+ matrix.getUPotential(w)
																+ matrix.getVPotential(c));
			}
		}
	}
}

TransportResolver.prototype.findNewBaseField = function(matrix) {
	var fieldCoordinates = null;
	var minValue = 0;
	var fieldValue;

	for (var w = 0; w < matrix.getWarehousesCount(); w++) {
		for (var c = 0; c < matrix.getConsumersCount(); c++) {
			fieldValue = matrix.getConsumerCarriageModification(w, c)
			if (fieldValue < minValue) {
				minValue = fieldValue;
				fieldCoordinates = [w, c];
			}
		}
	}
	return fieldCoordinates;
}

TransportResolver.prototype.findContour = function(matrix, newBaseField) {
	function matchesNewBaseField(warehouseId, consumerId) {
		return warehouseId == newBaseField[0] && consumerId == newBaseField[1];
	}

	function fieldBelongsToContour(matrix, node, w, c, direction) {
		if (matrix.consumerCarriageExists(w, c) || matchesNewBaseField(w, c)) {
			var newNode = new Node([w, c], node.getMark() * (-1));
			if (findPath(matrix, newNode, direction) !== false) {
				newNode.parentNode = node;
				node.childNode = newNode;
				node.directions.push(direction);
				if (direction === 'up') {
					newNode.directions.push('down');
				} else if (direction === 'down') {
					newNode.directions.push('up');
				} else if (direction === 'left') {
					newNode.directions.push('right');
				} else if (direction === 'right') {
					newNode.directions.push('left');
				}
				return true;
			}
		}
		return false;
	}

	function findPath(matrix, node, previousDirection) {
		if (node.getWarehouse() == newBaseField[0] && node.getConsumer() == newBaseField[1] && previousDirection !== null) {
			return true;
		}

		// LEFT
		if (previousDirection !== 'left' && previousDirection !== 'right') {
			for (var c = node.getConsumer()-1; c >= 0; c--) {
				if (fieldBelongsToContour(matrix, node, node.getWarehouse(), c, 'left')) {
					return true;
				}
			}
		}

		// RIGHT
		if (previousDirection !== 'right' && previousDirection !== 'left') {
			for (var c = node.getConsumer()+1; c < matrix.getConsumersCount(); c++) {
				if (fieldBelongsToContour(matrix, node, node.getWarehouse(), c, 'right')) {
					return true;
				}
			}
		}

		// UP
		if (previousDirection !== 'up' && previousDirection !== 'down') {
			for (var w = node.getWarehouse()-1; w >= 0; w--) {
				if (fieldBelongsToContour(matrix, node, w, node.getConsumer(), 'up')) {
					return true;
				}
			}
		}

		// DOWN
		if (previousDirection !== 'down' && previousDirection !== 'up') {
			for (var w = node.getWarehouse()+1; w < matrix.getWarehousesCount(); w++) {
				if (fieldBelongsToContour(matrix, node, w, node.getConsumer(), 'down')) {
					return true;
				}
			}
		}
		return false;
	}

	var firstNode = new Node(newBaseField.clone(), 1);

	findPath(matrix, firstNode, null);
	matrix.setContour(firstNode);
}

function Node(nodeField, mark, parentNode, childNode) {
	this.nodeField = nodeField || null;
	this.mark = mark || null;
	this.parentNode = parentNode || null;
	this.childNode = childNode || null;
	this.directions = [];
}

Node.prototype.getConsumer = function() {
	return this.nodeField[1];
}

Node.prototype.getWarehouse = function() {
	return this.nodeField[0];
}

Node.prototype.getMark = function() {
	return this.mark;
}

TransportResolver.prototype.findGoodsCountToRedistribute = function(matrix) {
	var childNode = matrix.getContour();
	var redistribute = Number.MAX_VALUE;
	while (childNode !== null) {
		if (childNode.getMark() === -1) {
			redistribute = Math.min(redistribute, matrix.getConsumerCarriage(childNode.getWarehouse(), childNode.getConsumer()));
		}
		childNode = childNode.childNode;
	}
	matrix.setGoodsCountToRedistribute(redistribute);
}

TransportResolver.prototype.createNewMatrix = function(oldMatrix) {
	var newMatrix = new TransportMatrix(oldMatrix.getWarehousesCount(), oldMatrix.getConsumersCount());

	for (var w = 0; w < newMatrix.getWarehousesCount(); w++) {
		for (var c = 0; c < newMatrix.getConsumersCount(); c++) {
			newMatrix.setConsumerCarriage(w, c, oldMatrix.getConsumerCarriage(w, c) || null);
		}
	}

	var childNode = oldMatrix.getContour().childNode;
	while (childNode !== null) {
		var newVal = ((newMatrix.getConsumerCarriage(childNode.getWarehouse(), childNode.getConsumer()) || 0)
						+ childNode.getMark() * oldMatrix.getGoodsCountToRedistribute()) || null;
		newMatrix.setConsumerCarriage(
			childNode.getWarehouse(),
			childNode.getConsumer(),
			newVal
		);
		childNode = childNode.childNode;
	}

	this.addExtraBasesIfNeeded(newMatrix);

	return newMatrix;
}

TransportResolver.prototype.addExtraBasesIfNeeded = function(matrix) {
	for (var c = 0; c < matrix.getConsumersCount(); c++) {
		for (var w = 0; w < matrix.getWarehousesCount(); w++) {
			if (matrix.getBaseVariablesCount() === this.baseVariables) {
				return;
			}
			if (!matrix.consumerCarriageExists(w, c)) {
				matrix.setConsumerCarriage(w, c, 0);
			}
		}
	}
}

TransportResolver.prototype.getMatrixValue = function(matrix) {
	var value = 0;
	for (var w = 0; w < matrix.getWarehousesCount(); w++) {
		for (var c = 0; c < matrix.getConsumersCount(); c++) {
			value += this.transportCosts[w][c] * (matrix.getConsumerCarriage(w, c) || 0)
		}
	}
	return value;
}
