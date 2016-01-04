var CIRCLE_SIZE = 100000,
	myMap = null,
	addedObjects = [];

document.addEventListener('DOMContentLoaded', function () {
	ymaps.ready(init);
});

var $year = document.getElementById('current_year'),
	$slider = document.getElementById('year_slider');

$slider.addEventListener('input', changeYear);

function init () {
    myMap = new ymaps.Map("map", {
        center: [59.949038,30.309377],
        zoom: 6
    });

    changeYear();
}

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
		var cityCircle = new ymaps.GeoObject({
			geometry: {
				type: 'Circle',	
				coordinates: citiesToAdd[i].coords,
				radius: CIRCLE_SIZE
			}
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

	for (var i in data) {
		var city = data[i],
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