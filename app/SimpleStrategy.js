var Strategy = require('./Strategy')

var SimpleStrategy = function(){}
SimpleStrategy.prototype = Object.create(Strategy.prototype);

SimpleStrategy.prototype.calc = function(lhsDim, rhsDim){
	var difSquare =Math.abs(lhsDim.getSquare() - rhsDim.getSquare());

	return difSquare;
}

module.exports = SimpleStrategy;