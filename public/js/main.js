

//var url = 'http://api.wunderground.com/api/1df22023c66b0e1d/forecast10day/geolookup/conditions/q/CA/San_Jose.json';
var weather;
//var baseurl = 'http://api.wunderground.com/api/1df22023c66b0e1d/hourly10day/geolookup/conditions/q/TX/Austin.json';  
var txHourly = 'http://api.wunderground.com/api/1df22023c66b0e1d/hourly10day/geolookup/conditions/q/TX/Austin.json'; 
var nyHourly = 'http://api.wunderground.com/api/1df22023c66b0e1d/hourly10day/geolookup/conditions/q/NY/Rochester.json'; 
var caHourly = 'http://api.wunderground.com/api/1df22023c66b0e1d/hourly10day/geolookup/conditions/q/CA/San_Jose.json'; 

 /*$.ajax({
        url: url,
        dataType: "jsonp",
        success: function(data)
        {
            weather = data;
        	console.log(data);
            alert('worked');
        }
    });
*/
function restCall(url){
	var d = {};
 	$.ajax({
        async: false,
        url: url,
        dataType: "jsonp",
        success: function(data)
        {
            weather = data;
        	console.log(data);
           //alert('worked');
            d = data;
        }
    });
    return d;

}
function checkNeg(people){
 if(people < 5)
 	return true;
 else 
 	return false;
}
function checkResetPeople(people){
	if (people<0)
		people = 0;
}
var people_count_weekday = [0,0,0,0,0,0,0,0,20,30,40,30,40,40,85,100,120,125,80,50,0,0,0];
var people_count_weekend = [0,0,0,0,0,0,0,0,50,50,60,70,70,80,85,100,120,150,160,50,0,0,0];

function count_people(temp, humidity, precip, people_count,time){
    if(time < 7 || time > 21) return 0;

    var people = people_count[time];
    
    /* Temperature */
    if(temp != null && !checkNeg(people)){
	    if (temp < 60){
	        people = people - 20;
	    }
	    else if (temp > 60 && temp < 70){     
	        people = people;
	    }
	    else if (temp > 70 && temp < 80){
	        people = people + 20;
	    }
	    else if (temp > 80 && temp < 90){
	        people = people + 20;
	    }
	    else if (temp > 90 && temp < 100){
	        people = people - 20;
	    }
    }
    
    /* Precipitation */
    if(precip != null && !checkNeg(people)){
	    if (precip === 'Scattered Thunderstorms'){
	        people = people-30;
	        
	    }
	    else if (precip > 30 && precip < 50){   
	        people = people - 5;
	    }
	    else if (precip > 50 && precip < 70){
	        people = people - 10;   
	    }
	    else if (precip > 70){
	        people = people - 15;
	    }
    }
    
    
    /* Humidity */
    if(humidity != null && !checkNeg(people)){
	    if (humidity < 30){   
	        people = people;
	    }
	    if (humidity > 30 && humidity < 50){   
	        people = people;
	    }
	    else if (humidity > 50 && humidity < 80){
	        people = people - 5;
	    }
	    else if (humidity > 80){
	        people = people - 15;
	    }
    }
    checkResetPeople(people);
    return people;
}

var normalData = [];
var chartData = [];  // The data were going to use to build the chart
var temp = [];
var precip = [];
var humidity = [];
function createData(t,p,h){
	normalData = [];
	chartData =[];
	var startTime = new Date().getHours();
	_.each(temp,function(obj,idx){
		startTime++;
		startTime = startTime % 23;
		chartData.push(count_people((t)? temp[idx]: null, (h)? humidity[idx]: null, (p)? precip[idx] : null, people_count_weekday,startTime));
       	normalData.push(count_people(null,null,null,people_count_weekday,startTime));
				
	});

}

function createTable(t,p,h){

	var d = new Date();
	var m = d.getMonth();
	var da = d.getDate();
	$('#container').highcharts({
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'CMX Smart Data Analytics'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            //minRange: 14 * 24 * 3600000 // fourteen days
        	minRange: 1* 24 * 3600000,
        	dateTimeLabelFormats:{
        		day: '%e of %b'
        	}
        },
        yAxis: {
            title: {
                text: 'People'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: 'Demands to Time',
            pointInterval: 1 * 3600 * 1000,
            pointStart: Date.UTC(2014, m, da),
            data: normalData
           },{
            type: 'area',
            name: 'Demands to Time',
            pointInterval: 1 * 3600 * 1000,
            pointStart: Date.UTC(2014, m, da),
            data: chartData
        }]
    });
}
$(document).ready(function () {
console.log(JSON.stringify(restCall(caHourly),undefined,2));
$('#humid').change(function() {
        createData($('#temp').is(':checked'), $('#precip').is(':checked'),$('#humid').is(':checked'));
        normalData.unshift(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        chartData.unshift(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        createTable();
});
$('#precip').on('click',function() {
        createData($('#temp').is(':checked'), $('#precip').is(':checked'),$('#humid').is(':checked'));
        normalData.unshift(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        chartData.unshift(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        createTable();
});
$('#temp').change(function() {
        createData($('#temp').is(':checked'), $('#precip').is(':checked'),$('#humid').is(':checked'));
        normalData.unshift(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        chartData.unshift(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        createTable();
});
$('#sj').on('click',function(e){
	e.preventDefault();
	changeCity(caHourly);

	//alert('sj');
});

$('#tx').on('click',function(e){
	e.preventDefault();

	changeCity(txHourly);
	//alert('tx');
});

$('#ny').on('click',function(e){
	e.preventDefault();

	changeCity(nyHourly);
	//alert('ny');
});
//});
/*get the hourly forecast */
$.ajax({
        async: true,
        url: caHourly,
        dataType: "jsonp",
        success: function(data)
        {
            weather = data;
        	console.log(JSON.stringify(data,undefined,2));
            console.log(data);
            _.each(data.hourly_forecast,function(obj,idx){
            	temp.push(obj.temp.english);
            	humidity.push(obj.humidity);
            	precip.push(obj.wx);
            });
            //alert('worked');
            createData(true,true,true);
            normalData.unshift(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
            chartData.unshift(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
            createTable(true,true,true);
           }
    });

});

function changeCity(url){
	normalData = [];
	chartData =[];

$.ajax({
        async: true,
        url: url,
        dataType: "jsonp",
        success: function(data)
        {
            weather = data;
        	console.log(JSON.stringify(data,undefined,2));
            console.log(data);
            _.each(data.hourly_forecast,function(obj,idx){
            	temp.push(obj.temp.english);
            	humidity.push(obj.humidity);
            	precip.push(obj.wx);
            });
            //alert('worked');
            createData($('#temp').is(':checked'), $('#precip').is(':checked'),$('#humid').is(':checked'));
        	
            chartData = chartData.splice(240,240);
            normalData = normalData.splice(240,240);
            /*normalData.unshift(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
            chartData.unshift(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
            normalData.unshift(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
            chartData.unshift(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
            */
            createTable(true,true,true);
           }
    });



}
