var MapObjects = function (map, cities) {
	this._map = map;
	this._cities = cities;
	this._addedObjects = [];
};

MapObjects.prototype.getAddedCity = function (city) {
	for (var i in this._addedObjects) {
		if (this._addedObjects[i].city == city) {
			return this._addedObjects[i];
		}
	}

	return null;
};

MapObjects.prototype.getCitiesToAdd = function (year) {
	var allCities = this._cities.getCities(),
		result = [];

	for (var i in allCities) {
		var city = allCities[i],
			addedCity = this.getAddedCity(city);

		if (city.founded <= year && !addedCity) {
			result.push(city);
		}
	}

	return result;
};

MapObjects.prototype.getCitiesToRemove = function (year) {
	var allCities = this._cities.getCities(),
		result = [];

	for (var i in allCities) {
		var city = allCities[i],
			addedCity = this.getAddedCity(city);

		if (city.founded > year && addedCity) {
			result.push(addedCity);
		}
	}

	return result;
};

MapObjects.prototype.updateCities = function (year) {
	if (year === this._year) {
		return;
	}

	if (year > this._year || this._year === undefined) {
		// add cities
		var citiesToAdd = this.getCitiesToAdd(year);

		for (var i in citiesToAdd) {
		  var coords = citiesToAdd[i].coords;
			var cityCircle = new ymaps.Placemark([coords[1], coords[0]], {
				balloonContent: '<a href="' + encodeURI('https://ru.wikipedia.org/wiki/' + citiesToAdd[i].name) + '" target="_blank">' + citiesToAdd[i].name + '</a>'
			});
			this._map.geoObjects.add(cityCircle);

			this._addedObjects.push({
				city: citiesToAdd[i],
				geometry: cityCircle
			});
		}
	} else {
		// remove cities
		var citiesToRemove = this.getCitiesToRemove(year);

		for (var i in citiesToRemove) {
			var cityObject = citiesToRemove[i];
			this._map.geoObjects.remove(cityObject.geometry);

			var cityIndex = this._addedObjects.indexOf(cityObject);
			this._addedObjects.splice(cityIndex, 1);
		}
	}

	this._year = year;
};
