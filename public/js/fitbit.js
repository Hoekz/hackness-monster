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
		return fit.fetch('activities/steps/date/' + date + '/1d').then(function(data){
			return data["activities-log-steps"][0].value;
		});
	};

	fit.fetch.week = function(date){
		date = date || (new Date());
		date.setDate(date.getDate() - date.getDay() + 7);
		return fit.fetch('activities/steps/date/' + formatDate(date) + '/1w').then(function(data){
			return data["activities-log-steps"];
		});
	};

	fit.fetch.month  = function(date){
		date = date || (new Date());
		date.setMonth(date.getMonth() + 1);
		date.setDate(0);

		return fit.fetch('activities/steps/date/' + formatDate(date) + '/1m').then(function(data){
			return data["activities-log-steps"];
		});
	};

	fit.fetch.year = function(date){
		date = date || (new Date());
		date.setYear(date.getYear() + 1901);
		date.setMonth(0);
		date.setDate(0);

		return fit.fetch('activities/steps/date/' + formatDate(date) + '/1y').then(function(data){
			return data["activities-log-steps"];
		});
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

var total = function(data){
	if("activities-log-steps" in data)
		return total(data["activities-log-steps"]);

	var total = 0;
	var count = data.length;

	for(var i = 0; i < count; i++){
		total += data[i].value;
	}

	return total;
}

var average = function(data){
	if("activities-log-steps" in data)
		return average(data["activities-log-steps"]);

	var total = 0;
	var count = data.length;

	for(var i = 0; i < count; i++){
		total += data[i].value;
	}

	return Math.floor(total / Math.max(count, 1));
};

var formatNum = function(x){
	return Math.floor(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

(function(){
	var daily, weekly, monthly, yearly;

	var table = document.querySelector('.table');

	fit.setAuth('fakeToken');

	fit.fetch.day().then(function(data){
		table.innerHTML = table.innerHTML.replace('{{day}}', formatNum(data));
		daily = data;
	});

	fit.fetch.week().then(function(data){
		table.innerHTML = table.innerHTML.replace('{{week}}', formatNum(total(data)));
		table.innerHTML = table.innerHTML.replace('{{weekRun}}', formatNum(average(data)));
		table.innerHTML = table.innerHTML.replace('{{weekAvg}}', formatNum(total(data) / 7));
		weekly = total(data) / 7;
	});

	fit.fetch.month().then(function(data){
		table.innerHTML = table.innerHTML.replace('{{month}}', formatNum(total(data)));
		table.innerHTML = table.innerHTML.replace('{{monthRun}}', formatNum(average(data)));
		table.innerHTML = table.innerHTML.replace('{{monthAvg}}', formatNum(total(data) / 30));
		monthly = total(data) / 30;
	});

	fit.fetch.year().then(function(data){
		table.innerHTML = table.innerHTML.replace('{{year}}', formatNum(total(data)));
		table.innerHTML = table.innerHTML.replace('{{yearRun}}', formatNum(average(data)));
		table.innerHTML = table.innerHTML.replace('{{yearAvg}}', formatNum(total(data) / 365));
		yearly = total(data) / 365;

		updateStepPercents(daily, weekly, monthly, yearly);
	});
})();