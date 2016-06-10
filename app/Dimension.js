function Dimension(width, height, path){
	this.width = width;
	this.height = height;
}
Dimension.prototype.getHeight = function(){
	return this.height;
};
Dimension.prototype.getWidth = function(){
	return this.width;
}
Dimension.prototype.getSquare = function(){
	return this.getWidth() * this.getHeight();
}

Dimension.prototype.getPerimeter = function(){
	return 2 * ( this.getHeight() +this.getWidth());
}

function MapDimensionToPath(dim,path, strategy){
	this.dim = dim;
	this.path = path;
	this.strategy = strategy;
}
MapDimensionToPath.prototype.setStrategy = function(strategy){
	this.strategy = strategy;
}
MapDimensionToPath.prototype.getPath = function(){
	return this.path;
}


MapDimensionToPath.prototype.getDiff = function(dim){
	return Math.abs(this.strategy.calc(this.dim, dim));
}

exports.Dimension = Dimension;
exports.MapDimensionToPath = MapDimensionToPath;
