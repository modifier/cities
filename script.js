var CIRCLE_SIZE = 50000,
	PER_PAGE_DEFAULT = 100,
	myMap = null,
	globalData = [],
	addedObjects = [];

var pageStartDfd = new Deferred();
document.addEventListener('DOMContentLoaded', function () {
	ymaps.ready(function () {
		pageStartDfd.resolve();
	});
});

var dataDfd = new Deferred();
getCitiesData(1, PER_PAGE_DEFAULT).done(function (cities) {
	for (var i in cities) {
		var city = cities[i];

		var datum = {
			name: city.name.value,
			url: city.city.value,
			founded: parseInt(city.inception.value.match(/^\d+/)[0], 10),
			coords: city.coordinate.value.match(/\d+(?:\.\d+)*/g)
		};

		globalData.push(datum);
	}

	dataDfd.resolve();
});

Deferred.when(pageStartDfd, dataDfd).done(function () {
    myMap = new ymaps.Map("map", {
        center: [59.949038,30.309377],
        zoom: 5
    });

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

	var cities = getCities($slider.value),
		citiesToAdd = cities.toAdd,
		citiesToRemove = cities.toRemove;

	// add cities
	for (var i in citiesToAdd) {
		var cityCircle = new ymaps.Placemark(citiesToAdd[i].coords, {
			balloonContent: '<a href="' + citiesToAdd[i].url + '" target="_blank">' + citiesToAdd[i].name + '</a>'
		});
		myMap.geoObjects.add(cityCircle);

		addedObjects.push({
			city: citiesToAdd[i],
			geometry: cityCircle
		});
	}

	// remove cities
	for (var i in citiesToRemove) {
		myMap.geoObjects.remove(citiesToRemove[i]);
	}
}

function getCities (year) {
	var toAdd = [],
		toRemove = [];

	for (var i in globalData) {
		var city = globalData[i],
			addedCity = getAddedCity(city);

		if (city.founded <= year && !addedCity) {
			toAdd.push(city);
		} else if (city.founded > year && addedCity) {
			toRemove.push(addedCity.geometry);

			var position = addedObjects.indexOf(addedCity);
			addedObjects.splice(position, 1);
		}
	}

	return {
		toAdd: toAdd,
		toRemove: toRemove
	};
}

function getAddedCity (city) {
	for (var i in addedObjects) {
		if (addedObjects[i].city == city) {
			return addedObjects[i];
		}
	}

	return null;
}