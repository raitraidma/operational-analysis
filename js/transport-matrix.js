function TransportMatrix(warehousesCount, consumersCount) {
	this.uPotentials = [];
	this.vPotentials = [];
	this.warehousesCount = warehousesCount;
	this.consumersCount = consumersCount;
	this.matrix = [];
	this.contour = null;
	this.goodsCountToRedistribute = null;
	this.extraBaseIteration = 0;
	for (var i = 0; i < warehousesCount; i++) {
		var row = [];
		for (var j = 0; j < consumersCount; j++) {
			row.push({
				'carriage': null,
				'carriageModification': null
			});
		}
		this.matrix.push(row);
	}

	for (var i = 0; i < warehousesCount; i++) {
		this.uPotentials.push(null);
	}

	for (var i = 0; i < consumersCount; i++) {
		this.vPotentials.push(null);
	}
}

TransportMatrix.prototype.setContour = function(contour) {
	this.contour = contour;
}

TransportMatrix.prototype.getContour = function() {
	return this.contour;
}

TransportMatrix.prototype.consumerCarriageExists = function(warehouseId, consumerId) {
	return this.matrix[warehouseId][consumerId]['carriage'] !== null
}

TransportMatrix.prototype.getConsumerCarriage = function(warehouseId, consumerId) {
	return parseInt(this.matrix[warehouseId][consumerId]['carriage']);
}

TransportMatrix.prototype.setConsumerCarriage = function(warehouseId, consumerId, carriage) {
	this.matrix[warehouseId][consumerId]['carriage'] = carriage;
}

TransportMatrix.prototype.setConsumerCarriageModification = function(warehouseId, consumerId, carriage) {
	this.matrix[warehouseId][consumerId]['carriageModification'] = carriage;
}

TransportMatrix.prototype.getConsumerCarriageModification = function(warehouseId, consumerId) {
	return this.matrix[warehouseId][consumerId]['carriageModification'];
}

TransportMatrix.prototype.getWarehousesCount = function() {
	return this.warehousesCount;
}

TransportMatrix.prototype.getConsumersCount = function() {
	return this.consumersCount;
}

TransportMatrix.prototype.uPotentialExists = function(id) {
	return this.uPotentials[id] !== null;
}

TransportMatrix.prototype.getUPotential = function(id) {
	return this.uPotentials[id];
}

TransportMatrix.prototype.setUPotential = function(id, value) {
	return this.uPotentials[id] = value;
}

TransportMatrix.prototype.vPotentialExists = function(id) {
	return this.vPotentials[id] !== null;
}

TransportMatrix.prototype.getVPotential = function(id) {
	return this.vPotentials[id];
}

TransportMatrix.prototype.setVPotential = function(id, value) {
	return this.vPotentials[id] = value;
}

TransportMatrix.prototype.setGoodsCountToRedistribute = function(goodsCountToRedistribute) {
	this.goodsCountToRedistribute = goodsCountToRedistribute;
}

TransportMatrix.prototype.getGoodsCountToRedistribute = function() {
	return this.goodsCountToRedistribute;
}

TransportMatrix.prototype.getBaseVariablesCount = function() {
	var existingBases = 0;
	for (var w = 0; w < this.warehousesCount; w++) {
		for (var c = 0; c < this.consumersCount; c++) {
			if (this.consumerCarriageExists(w, c)) {
				existingBases++;
			}
		}
	}
	return existingBases;
}