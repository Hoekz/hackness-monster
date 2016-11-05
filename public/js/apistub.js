(function(){
	var baseurl = "https://api.fitbit.com/1/user/-/";

	var profile = {
	    "user": {
	        "aboutMe": 'A self written description',
	        "avatar": 'http://url',
	        "avatar150": 'http://url',
	        "city": 'St. Louis',
	        "clockTimeDisplayFormat": '12hour',
	        "country": 'USA',
	        "dateOfBirth": '1990-05-05',
	        "displayName": 'John',
	        "distanceUnit": 'mile',
	        "fullName": 'John Doe',
	        "gender": 'MALE',
	        "memberSince": '2013-05-07',
	        "nickname": 'Johnny',
	        "state": 'Missouri',
	        "strideLengthRunning": '3.25',
	        "strideLengthWalking": '2.25'
	    }
    };

    var stepData = function(str){
    	var data = [];
    	var today = new Date();

    	if(str == 'today/1d'){
    		data.push({
    			dateTime: formatDate(today),
    			value: Math.floor((today.getHours() * 60 + today.getMinutes()) * (5 + Math.random()))
    		});
    	}else{
    		//TODO: parse date info and generate date list
    		var date = str.split('/')[0];
    		var period = str.split('/')[1];
    		dates = [];

    		var iterator = new Date();
    		var counter = 0, lastMonth, lastYear;
    		iterator.setYear(parseInt(date.split('-')[0]));
    		iterator.setMonth(parseInt(date.split('-')[1]) - 1);
    		iterator.setDate(parseInt(date.split('-')[2]));

    		while(1){
    			counter++;
    			lastMonth = iterator.getMonth();
    			lastYear = iterator.getYear();
    			iterator.setDate(iterator.getDate() - 1);

    			if(period == '1m' && lastMonth != iterator.getMonth()) break;
    			if(period == '1y' && lastYear != iterator.getYear()) break;

    			if(iterator < new Date()){
    				dates.push(new Date(iterator.getTime()));
    			}

    			if(period == '1d') break;
    			if(period == '1w' && counter == 7) break;
    		}

    		dates.forEach(function(date){
    			data.push({
    				dateTime: formatDate(date),
    				value: Math.floor(1440 * (4 + 2 * Math.random()))
    			})
    		});
    	}

    	return {"activities-log-steps": data};
    };

	http.stub(/^https:\/\/api.fitbit.com\/1\/user\/-\/.+\.json/, function(opts){
		var sub = opts.url.substr(baseurl.length);

		if(sub == 'profile.json'){
			return profile;
		}

		if(sub.substr(0, 22) == 'activities/steps/date/'){
			return stepData(sub.substr(22, sub.length - 27));
		}

		return {error: 'unknown route'};
	});
})();