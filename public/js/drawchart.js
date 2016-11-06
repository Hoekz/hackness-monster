var drawData = (function(){
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(initChart);

    var chart;
    var options = {
        title: 'Steps Over Time',
        titleTextStyle: {fontName: 'Roboto'},
        chartArea:{left: '12.5%', width:"85%"},
        backgroundColor: '#ffffff',
        legend: {position: 'none'},
        hAxis: {
            format: 'MMM dd',
            gridlines: {color: 'none'}
        },
        vAxis: {
            gridlines: {count: 6},
            minValue: 0
        },
        colors: ['#00aae9']
    };

    function initChart() {
        chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        fit.setAuth('fakeToken');
        fit.fetch.month().then(function(data){
            drawData(data);
        });
    }

    function draw(data){
        chart.draw(data, options);
    }

    return function(data){
        console.log(data);
        var table = new google.visualization.DataTable();
        table.addColumn('date', 'Time of Day');
        table.addColumn('number', 'Steps');

        table.addRows(data.map(function(entry){
            return [
                new Date(entry.dateTime),
                entry.value
            ];
        }));

        options.title = 'Steps Over Time (Average: ' + average(data) + ' steps)';

        draw(table);
    }
})();

var period = 'month';

var drawPeriod = function(period, date){
    fit.fetch[period](date).then(function(data){
        drawData(data);
    });
};

var periods = {
    'week': document.getElementById('week'),
    'month': document.getElementById('month'),
    'year': document.getElementById('year'),
    'last-month': document.getElementById('last-month')
};

for(var p in periods){
    periods[p].addEventListener('click', function(){
        for(var p in periods){
            periods[p].classList.remove('selected');
        }

        this.classList.add('selected');

        if(this.id == 'last-month'){
            var date = new Date();
            date.setMonth(date.getMonth() - 1);
            drawPeriod('month', date);
            return;
        }

        drawPeriod(this.id);
    });
}