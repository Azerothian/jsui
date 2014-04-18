
define ['bluebird', 'log'], (Promise, log) ->
	class Promises
		constructor: (@promises = []) ->
			@length = @promises.length;

		all: () =>
			return new Promise (resolve, reject) =>
				arrs = []
				for i in @promises
					args = i.args || arguments
					arrs.push i.promise.apply(i.context, args);
				Promise.all(arrs).then () =>
					resolve();

		add: (promise, context, args) =>
			if not promise?
				throw "Promises - Error: promise being provided is not valid";
			@promises.push { promise: promise, context: context, args: args };
			@length = @promises.length;

		push: () =>
			@add.apply @, arguments
		concat: () =>
			for i in arguments
				@promises.concat(i);

		getAll: () =>
			return @promises;

		clear: () =>
			@promises = [];
			@length = 0;

		chain: () =>
			return @chainUtil(0, @promises, arguments);
		chainUtil: (i, array, originalArgs, collect, rejected = false) ->
			return new Promise (resolve, reject) =>
				if not array?
					log "Promises - chainUtil - array is not defined";
					return;
				if not collect?
					collect = [];
				if array[i]?
					if array[i].args?
						args = array[i].args;
					else 
						args = originalArgs;
					OnComplete = () =>
						collect.push arguments
						rs = resolve;
						if @onResolve?
							rs = @onResolve(resolve);

						rj = reject;
						if @onReject?
							rj = @onReject(reject);
						return @chainUtil(i+1, array, originalArgs, collect, rejected).then(rs, rj);
					OnReject = () =>
						rejected = true;
						return OnComplete.apply @, arguments;
					return array[i].promise.apply(array[i].context, args).then OnComplete, OnReject
				else
					if rejected
						return reject(collect)
					else
						return resolve(collect);
	return Promises;