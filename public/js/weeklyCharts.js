$.get("/weekly-analysis-data", function (data) {
	for (var weekNo in data) {
		chartID = 'answers-chart-' + weekNo;
		console.log(chartID)
		var ctx = document.getElementById(chartID).getContext('2d');
		var chart = new Chart(ctx, {
			// The type of chart we want to create
			type: 'horizontalBar',
		
			// The data for our dataset
			data: {
				labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
				datasets: [{
					label: 'Answers Submitted',
					backgroundColor: 'rgb(46, 25, 158)',
					borderColor: 'rgb(88, 71, 177)',
					data: data[weekNo]
				}]
			},
		
			// Configuration options go here
			options: {
				scales: {
					xAxes: [{
						minBarLength: 2,
						gridLines: {
							offsetGridLines: true
						}
					}]
				}
			}
		});
	}
	console.log(data);
});