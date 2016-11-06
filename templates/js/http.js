var http = (function(xhr){
	var cache = {};
	var stubs = [];

	var http = function(opts){
		if(opts.method + ':' + opts.url in cache){
			return Promise.resolve(cache[opts.method + ':' + opts.url]);
		}

		var prom = stubs.reduce(function(value, stub){
			if(value) return value;

			if(opts.url.match(stub.pattern)){
				return Promise.resolve(stub.handler(opts));
			}

			return value;
		}, null);

		if(prom) return prom;

		var req = new xhr();
		var url = opts.url;

		var prom = new Promise(function(resolve, reject){
			req.onload = function(){
				if(req.status == 200 || req.status == 304){
					try{
						cache[url] = JSON.parse(req.responseText);
					}catch(e){
						cache[url] = req.responseText;
					}

					resolve(cache[url]);
				}else{
					reject({error: 'something went wrong'});
				}
			};
		});

		for(header in opts.headers){
			xhr.setRequestHeader(header, opts.headers[header]);
		}

		if(opts.query){
			url += '?';
			var arr = [];
			for(param in opts.query){
				arr.push(param + '=' + encodeURIComponent(opts.query[param]));
			}
			url += arr.join('&');
		}
		req.open(opts.method, url);
		opts.body ? req.send(JSON.stringify(opts.body)) : req.send();

		return prom;
	};

	http.stub = function(pattern, handler){
		stubs.push({
			pattern: pattern,
			handler: handler
		})
	};

	http.get = function(opts){
		if(typeof opts == 'string'){
			return http({method: 'GET', url: opts});
		}
		
		opts.method = 'GET';
		return http(opts);
	};

	return http;
})(XMLHttpRequest);