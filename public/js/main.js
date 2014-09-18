

var url = 'http://api.wunderground.com/api/1df22023c66b0e1d/forecast10day/geolookup/conditions/q/CA/San_Jose.json';
var weather;

 $.ajax({
        url: url,
        dataType: "jsonp",
        success: function(data)
        {
            weather = data;
        	console.log(data);
            alert('worked');
        }
    });


$(function () {
  $('#container').highcharts({
                             chart: {
                             type: 'line',
                             width: 300
                             },
                             title: {
                             text: 'Width is set to 300px'
                             },
                             
                             xAxis: {
                             categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                             },
                             
                             series: [{
                                      data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                                      }]
                             });
  });


