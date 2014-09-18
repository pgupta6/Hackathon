var url = 'http://api.wunderground.com/api/1df22023c66b0e1d/forecast10day/geolookup/conditions/q/CA/San_Jose.json';


 $.ajax({
        url: url,
        dataType: "jsonp",
        success: function(data)
        {
        	console.log(data);
            alert('worked');
        }
    });