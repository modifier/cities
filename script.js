(function () {
	var myMap = null,
		cities = new Cities();

	var pageStartDfd = new Deferred();
	document.addEventListener('DOMContentLoaded', function () {
		ymaps.ready(function () {
			pageStartDfd.resolve();
		});
	});

	Deferred.when(pageStartDfd, cities.load()).done(function () {
	    myMap = new ymaps.Map("map", {
	        center: [59.949038,30.309377],
	        zoom: 5
	    });

	    $slider.max = cities.getMaxYear();
	    $slider.min = cities.getMinYear();
	    $slider.disabled = false;

	    changeYear();
	});

	var $year = document.getElementById('current_year'),
		$slider = document.getElementById('year_slider');

	$slider.addEventListener('input', changeYear);

	function changeYear () {
		$year.innerHTML = $slider.value;

		if (!myMap) {
			return;
		}

		var totalCities = cities.getCitiesByYear($slider.value),
			citiesToAdd = totalCities.toAdd,
			citiesToRemove = totalCities.toRemove;

		// add cities
		for (var i in citiesToAdd) {
			var cityCircle = new ymaps.Placemark(citiesToAdd[i].coords, {
				balloonContent: '<a href="' + citiesToAdd[i].url + '" target="_blank">' + citiesToAdd[i].name + '</a>'
			});
			myMap.geoObjects.add(cityCircle);

			cities._addedObjects.push({
				city: citiesToAdd[i],
				geometry: cityCircle
			});
		}

		// remove cities
		for (var i in citiesToRemove) {
			myMap.geoObjects.remove(citiesToRemove[i]);
		}
	}
})();