var _DISTANCE_BETWEEN_PUSH = 20; 
var _MAX_ATTEMPT = 3;

function BaseStrategy(){
	
}
BaseStrategy.prototype.isNeedDelete = function(currentpush){
	return true;
}
BaseStrategy.prototype.isNeedRePush = function(currentpush){
	return true;
}

function SimpleStrategy(){
	Base.apply(this, arguments);
}

SimpleStrategy.prototype = Object.create(Base.prototype);
SimpleStrategy.prototype.constructor = SimpleStrategy;

SimpleStrategy.prototype.isNeedDelete = function(currentpush){
	return (currentPush.count_attempt >=  _MAX_ATTEMPT);
}

SimpleStrategy.prototype.isNeedRePush = function(currentpush){
	var nowTime = new Date();
	var diff = Math.abs(nowTime.getTime() - currentPush.last_attempt_date.getTime()) ;
	return (diff > _DISTANCE_BETWEEN_PUSH);
}


exports.BaseStrategy = BaseStrategy;
exports.SimpleStrategy = SimpleStrategy;
