function Deferred(){
	this._done = [];
	this._fail = [];
}

Deferred.prototype = {
	execute: function(list, args){
		var i = list.length;

		// convert arguments to an array
		// so they can be sent to the
		// callbacks via the apply method
		args = Array.prototype.slice.call(args);

		while(i--) list[i].apply(null, args);
	},
	resolve: function(){
		this.execute(this._done, arguments);
	},
	reject: function(){
		this.execute(this._fail, arguments);
	}, 
	done: function(callback){
		this._done.push(callback);
	},
	fail: function(callback){
		this._fail.push(callback);
	}
};

Deferred.when = function () {
	var dfds = Array.prototype.slice.call(arguments, 0),
		allDfds = [],
		resultingDfd = new Deferred();

	for (var i in dfds) {
		var dfd = dfds[i];

		(function (i) {
			dfd.done(function () {
				allDfds[i] = true;

				for (var j = 0; j < dfds.length; j++) {
					if (allDfds[j] != true) {
						return;
					}
				}

				resultingDfd.resolve();
			});
		})(i);

		dfd.fail(function () {
			resultingDfd.reject();
		});
	}

	return resultingDfd;
};