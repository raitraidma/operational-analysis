function TransportView() {
}

TransportView.prototype.run = function() {
	this.reset();
	this.showTable();
}

TransportView.prototype.reset = function() {
	this.warehouseCount = 2;
	this.consumerCount = 2;
	this.consumers = [];
	this.warehouses = [];
	this.transportCosts = [];
	this.transportResolver = null;
	$('#transport-table-view').addClass('hidden');
	$('#transport-results').addClass('hidden').html('');
}

TransportView.prototype.showTable = function() {
	this.createTransportTable();
	this.bindConsumerButtons();
	this.bindWarehouseButtons();
	this.bindResolveButton();
	this.bindTestDataButton();
	$('#transport-table-view').removeClass('hidden');
}

TransportView.prototype.bindResolveButton = function() {
	var that = this;
	$('#step-2').click(function() {
		that.resolve();
	});
}

TransportView.prototype.bindTestDataButton = function() {
	var that = this;
	$('#example-1').click(function() {
		that.consumers = [9, 8, 13, 30];
		that.warehouses = [20, 5, 10, 25];
		that.transportCosts = [
			[1,  9,  6, 10],
			[2,  5, 14,  1],
			[5,  3,  7,  2],
			[8, 11, 10,  2]
		];
		that.warehouseCount = that.warehouses.length;
		that.consumerCount = that.consumers.length;
		that.createTransportTable();

		that.checkConsumerRemoveButton();
		that.checkWarehouseRemoveButton();
	});

	$('#example-2').click(function() {
		that.consumers = [150, 120, 80, 50];
		that.warehouses = [100, 130, 170];
		that.transportCosts = [
			[3, 5,  7, 11],
			[1, 4,  6,  3],
			[5, 8, 12,  7]
		];
		that.warehouseCount = that.warehouses.length;
		that.consumerCount = that.consumers.length;
		that.createTransportTable();

		that.checkConsumerRemoveButton();
		that.checkWarehouseRemoveButton();
	});

	$('#example-3').click(function() {
		that.consumers = [22, 11, 11, 22];
		that.warehouses = [22, 23, 21];
		that.transportCosts = [
			[10,  7, 14, 27],
			[29, 11, 12, 16],
			[26, 29, 21, 14]
		];
		that.warehouseCount = that.warehouses.length;
		that.consumerCount = that.consumers.length;
		that.createTransportTable();

		that.checkConsumerRemoveButton();
		that.checkWarehouseRemoveButton();
	});

	$('#example-4').click(function() {
		that.consumers = [22, 11, 11, 22, 22];
		that.warehouses = [21, 23, 21, 23];
		that.transportCosts = [
			[10,  7, 14, 27, 18],
			[29, 11, 12, 16, 30],
			[26, 29, 21, 14, 31],
			[23,  9, 11,  7, 17]
		];
		that.warehouseCount = that.warehouses.length;
		that.consumerCount = that.consumers.length;
		that.createTransportTable();

		that.checkConsumerRemoveButton();
		that.checkWarehouseRemoveButton();
	});

	$('#example-5').click(function() {
		that.consumers = [15, 15, 16, 15, 15];
		that.warehouses = [19, 19, 19, 19];
		that.transportCosts = [
			[21, 17, 12, 24, 30],
			[ 6,  1,  9,  5,  9],
			[ 7,  5, 24,  6, 13],
			[29, 22, 21,  5,  7]
		];
		that.warehouseCount = that.warehouses.length;
		that.consumerCount = that.consumers.length;
		that.createTransportTable();

		that.checkConsumerRemoveButton();
		that.checkWarehouseRemoveButton();
	});

	$('#example-6').click(function() {
		that.consumers = [15, 15, 16, 15, 15, 14, 13];
		that.warehouses = [19, 19, 19, 19, 15, 12];
		that.transportCosts = [
			[21, 17, 12, 24, 30,  4,  5],
			[ 6,  1,  9,  5,  9, 21,  4],
			[ 7,  5, 24,  6, 13, 23, 32],
			[29, 22, 21,  5,  7, 12, 14],
			[17,  6, 28,  9, 26,  8,  6],
			[ 4, 76,  9, 24,  6,  9,  7]
		];
		that.warehouseCount = that.warehouses.length;
		that.consumerCount = that.consumers.length;
		that.createTransportTable();

		that.checkConsumerRemoveButton();
		that.checkWarehouseRemoveButton();
	});
}

TransportView.prototype.bindConsumerButtons = function() {
	var that = this;
	$('#add-consumer').click(function() {
		that.loadTableContent();
		that.consumerCount++;
		that.createTransportTable();
		that.checkConsumerRemoveButton();
	});
	$('#remove-consumer').click(function() {
		that.loadTableContent();
		that.consumerCount--;
		that.createTransportTable();
		that.checkConsumerRemoveButton();
	});
}

TransportView.prototype.bindWarehouseButtons = function() {
	var that = this;
	$('#add-warehouse').click(function() {
		that.loadTableContent();
		that.warehouseCount++;
		that.createTransportTable();
		that.checkWarehouseRemoveButton();
	});
	$('#remove-warehouse').click(function() {
		that.loadTableContent();
		that.warehouseCount--;
		that.createTransportTable();
		that.checkWarehouseRemoveButton();
	});
}

TransportView.prototype.checkWarehouseRemoveButton = function() {
	$('#remove-warehouse').attr('disabled', this.warehouseCount <= 2);
}

TransportView.prototype.checkConsumerRemoveButton = function() {
	$('#remove-consumer').attr('disabled', this.consumerCount <= 2);
}

TransportView.prototype.createTransportTable = function() {
	var rows = this.warehouseCount + 1;
	var columns = this.consumerCount + 1;

	var tableHtml = $('<table class="table table-bordered transport-table"></table>');

	for (var row = 0; row < rows; row++) {
		var rowHtml = $('<tr>');

		for (var column = 0; column < columns; column++) {
			var cellHtml = $('<td>');

			var inputHtml = this.createTableCellContent(row, column);
			cellHtml.append(inputHtml);
			rowHtml.append(cellHtml);
		}

		tableHtml.append(rowHtml);
	}

	$('#transport-table-form').html("");
	$('#transport-table-form').append(tableHtml);
}

TransportView.prototype.createTableCellContent = function(row, column) {
	var inputHtml = '';
	if (row === 0 && column === 0) {
		inputHtml = $('<span>T</span><span>L</span>');
	} else if (row === 0) {
		inputHtml = $('<input type="number" name="consumer[' + (column-1) + ']" min="0" value="' + this.getConsumerValue(column-1) + '" />');
	} else if (column === 0) {
		inputHtml = $('<input type="number" name="warehouse[' + (row-1) + ']" min="0" value="' + this.getWarehouseValue(row-1) + '" />');
	} else {
		inputHtml = $('<input type="number" name="transport_cost[' + (row-1) + '][' + (column-1) + ']" min="0" value="' + this.getTransportCostValue(row-1, column-1) + '" />');
	}
	return inputHtml;
}

TransportView.prototype.getConsumerValue = function(consumerId) {
	if (this.consumers.length > consumerId) {
		var value = this.consumers[consumerId];
		if (!!value) {
			return value;
		}
	}
	return '';
}

TransportView.prototype.getWarehouseValue = function(warehouseId) {
	if (this.warehouses.length > warehouseId) {
		var value = this.warehouses[warehouseId];
		if (!!value) {
			return value;
		}
	}
	return '';
}

TransportView.prototype.getTransportCostValue = function(warehouseId, consumerId) {
	if (this.transportCosts.length > warehouseId) {
		if (this.transportCosts[warehouseId].length > consumerId) {
			var value = this.transportCosts[warehouseId][consumerId];
			if (!!value) {
				return value;
			}
		}
	}
	return '';
}

TransportView.prototype.showErrors = function(errors) {
	if (Array.isArray(errors)) {
		alert(errors.join("\n"));
	} else {
		alert(errors);
	}
}

TransportView.prototype.loadTableContent = function() {
	this.consumers = this.readConsumers();
	this.warehouses = this.readWarehouses();
	this.transportCosts = this.readTransportCosts();
}

TransportView.prototype.readConsumers = function() {
	var consumers = [];
	for (var i = 0; i < this.consumerCount; i++) {
		var consumerValue = $('input[name="consumer[' + i + ']"]').val();
		consumers.push(parseInt(consumerValue));
	}
	return consumers;
}

TransportView.prototype.readWarehouses = function() {
	var warehouses = [];
	for (var i = 0; i < this.warehouseCount; i++) {
		var warehouseValue = $('input[name="warehouse[' + i + ']"]').val();
		warehouses.push(parseInt(warehouseValue));
	}
	return warehouses;
}

TransportView.prototype.readTransportCosts = function() {
	var transportCosts = [];
	for (var i = 0; i < this.warehouseCount; i++) {
		var warehouseCosts = [];
		for (var j = 0; j < this.consumerCount; j++) {
			var transportCostValue = $('input[name="transport_cost[' + i + '][' + j + ']"]').val();
			warehouseCosts.push(parseInt(transportCostValue));
		}
		transportCosts.push(warehouseCosts);
	}
	return transportCosts;
}

TransportView.prototype.resolve = function() {
	if (this.customerNeedsWarehouseSuppliesDoNotMatch()) {
		this.showErrors(trans('consumer.needs.no.not.match.warehouse.supplies'));
		return;
	}
	this.transportResolver = new TransportResolver(this.readConsumers(), this.readWarehouses(), this.readTransportCosts());
	this.transportResolver.resolve();
	this.displayResults();
}

TransportView.prototype.customerNeedsWarehouseSuppliesDoNotMatch = function() {
	var consumers = this.readConsumers();
	var warehouses = this.readWarehouses();
	var consumersNeeds = 0;
	var warehousesSupplies = 0;
	for (var i = 0; i < consumers.length; i++) {
		consumersNeeds += consumers[i];
	}
	for (var i = 0; i < warehouses.length; i++) {
		warehousesSupplies += warehouses[i];
	}
	return consumersNeeds !== warehousesSupplies;
}

TransportView.prototype.displayResults = function() {
	$('#transport-results').html("");
	var rows = this.warehouseCount + 1;
	var columns = this.consumerCount + 1;
	var consumers = this.readConsumers();
	var warehouses = this.readWarehouses();
	var transportCosts = this.readTransportCosts();

	for (var i = 0; i < this.transportResolver.transportMatrices.length; i++) {
		var matrix = this.transportResolver.transportMatrices[i];

		var directions = this.getDirections(matrix);

		console.log(directions);

		var tableHtml = $('<table class="table-bordered transport-result-table"></table>');

		for (var row = 0; row <= rows; row++) {
			var rowHtml = $('<tr>');

			for (var column = 0; column <= columns; column++) {
				var cellHtml = $('<td>');

				if (row === 0 && column === 0) {
					cellHtml.append('<div>T</div><div>L</div>');
				} else if (row === 0) {
					cellHtml.append(consumers[column-1]);
				} else if (column === 0) {
					cellHtml.append(warehouses[row-1]);
				} else if (column === columns && row > 0 && row < rows) {
					cellHtml.append('u = ' + matrix.getUPotential(row-1));
				} else if (row === rows && column > 0 && column < columns) {
					cellHtml.append('v = ' + matrix.getVPotential(column-1));
				} else if (row < rows && column < columns) {
					var field = matrix.getConsumerCarriageModification(row-1, column-1);
					field = (field === null || field === undefined || isNaN(field)) ? '' : field;
					var base = matrix.getConsumerCarriage(row-1, column-1);
					base = (base === null || base === undefined || isNaN(base)) ? '' : base;

					cellHtml.append('<span class="cost">' + transportCosts[row-1][column-1] + '</span>');
					cellHtml.append('<span class="none"></span>');
					cellHtml.append('<span class="field">' + field + '</span>');
					cellHtml.append('<span class="base">' + base + '</span>');

					cellHtml.addClass((directions[row-1][column-1]).join(' '));
				}
				rowHtml.append(cellHtml);
			}

			tableHtml.append(rowHtml);
		}

		$('#transport-results').append(tableHtml);
		$('#transport-results').append('<strong>Z = ' + this.transportResolver.getMatrixValue(matrix) + '</strong>');
	}

	$('#transport-results').removeClass('hidden');
}

TransportView.prototype.getDirections = function(matrix) {
	var directionsMatrix = [];

	for (var w = 0; w < matrix.getWarehousesCount(); w++) {
		directionsMatrix.push([]);
		for (var c = 0; c < matrix.getConsumersCount(); c++) {
			directionsMatrix[w].push([]);
		}
	}

	if (matrix.getContour() === null) {
		return directionsMatrix;
	}

	var node = matrix.getContour();
	while (node !== null) {
		for (var i = 0; i < node.directions.length; i++) {
			directionsMatrix[node.getWarehouse()][node.getConsumer()].push(node.directions[i]);
		}
		node = node.childNode;
	}

	for (var w = 0; w < matrix.getWarehousesCount(); w++) {
		for (var c = 0; c < matrix.getConsumersCount(); c++) {
			var field = directionsMatrix[w][c];
			if (field.length === 0) {
				// LEFT to RIGHT
				if ((c-1 >= 0) && directionsMatrix[w][c-1].contains('right')) {
					field.push('left');
					field.push('right');
				}
				// UP to DOWN
				if ((w-1 >= 0) && directionsMatrix[w-1][c].contains('down')) {
					field.push('up');
					field.push('down');
				}
			}
		}
	}

	return directionsMatrix;
}