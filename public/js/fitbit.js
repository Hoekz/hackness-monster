var formatDate = function(date){
	date = date || new Date();
	var year = (date.getYear() + 1900);
	var month = date.getMonth() + 1;
	month < 10 ? month = '0' + month : null;
	var day = date.getDate();
	day < 10 ? day = '0' + day : null;
	return year + '-' + month + '-' + day;
};

var fit = (function(){
	var authToken = '';
	var baseurl = "https://api.fitbit.com/1/user/-/";
	var fit = {};

	fit.fetch = function(url){
		if(!authToken){
			return Promise.resolve({error: 'not logged in'});
		}

		return http.get({
			url: baseurl + url + '.json',
			headers: {
				'Authorization': 'Bearer ' + authToken
			}
		});
	};

	fit.fetch.day = function(date){
		date = (date ? formatDate(date) : 'today');
		return fit.fetch('activities/steps/date/' + date + '/1d');
	};

	fit.fetch.week = function(date){
		date = date || (new Date());
		date.setDate(date.getDate() - date.getDay() + 6);
		return fit.fetch('activities/steps/date/' + formatDate(date) + '/1w');
	};

	fit.fetch.month  = function(date){
		date = date || (new Date());
		date.setMonth(date.getMonth() + 1);
		date.setDate(0);

		return fit.fetch('activities/steps/date/' + formatDate(date) + '/1m');
	};

	fit.fetch.year = function(date){
		date = date || (new Date());
		date.setYear(date.getYear() + 1901);
		date.setMonth(0);
		date.setDate(0);

		return fit.fetch('activities/steps/date/' + formatDate(date) + '/1y');
	};

	fit.fetch.me = function(){
		return fit.fetch('profile');
	}

	fit.login = function(){
		var url = 'https://www.fitbit.com/oauth2/authorize';
		var query = {
			response_type: 'token',
			client_id: 'IDID',
			redirect_uri: 'http://stepscores.com/token/',
			scope: ['activity', 'profile']
		};

		queryStr = [];
		for(var prop in query){
			queryStr.push(prop + '=' + encodeURIComponent(query[prop]));
		}

		window.location.replace(url + "?" + queryStr.join('&'));
	};

	fit.setAuth = function(token){
		authToken = token.toString();
	};

	return fit;
})();