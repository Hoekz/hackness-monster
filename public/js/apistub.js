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

    	if(str == 'today'){
    		data.push({
    			dateTime: formatDate(today),
    			value: Math.floor((today.getHours() * 60 + today.getMinutes()) * (5 + Math.random()))
    		});
    	}else{
    		//TODO: parse date info and generate date list
    		dates = [];

    		dates.forEach(function(date){
    			data.push({
    				dateTime: formatDate(date),
    				value: Math.floor(1440 * (5 + Math.random()))
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