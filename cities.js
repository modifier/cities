var Cities = function () {
	this._loadedCities = [];
	this._addedObjects = []; // todo: doesn't belong here, move to another class
	this._page = 0;
	this._perPage = 100;
	this._maxYear = 0;
	this._minYear = 3000;
	this._noMoreCities = false;
};

Cities.prototype.load = function () {
	this._page++;

	var that = this,
		loadDfd = new Deferred();

	Queries.loadCitiesData(this._page, this._perPage).done(function (cities) {
		if (cities.length === 0) {
			that._noMoreCities = true;
		}

		for (var i in cities) {
			var city = cities[i];

			var datum = {
				name: city.name.value,
				url: city.city.value,
				founded: parseInt(city.inception.value.match(/^\d+/)[0], 10),
				coords: city.coordinate.value.match(/\d+(?:\.\d+)*/g)
			};

			if (datum.founded > that._maxYear) {
				that._maxYear = datum.founded;
			}

			if (datum.founded < that._minYear) {
				that._minYear = datum.founded;
			}

			that._loadedCities.push(datum);
		}

		loadDfd.resolve();
	});

	return loadDfd;
};

Cities.prototype.getCitiesByYear = function (year) {
	var toAdd = [],
		toRemove = [];

	for (var i in this._loadedCities) {
		var city = this._loadedCities[i],
			addedCity = this.getAddedCity(city);

		if (city.founded <= year && !addedCity) {
			toAdd.push(city);
		} else if (city.founded > year && addedCity) {
			toRemove.push(addedCity.geometry);

			var position = this._addedObjects.indexOf(addedCity);
			this._addedObjects.splice(position, 1);
		}
	}

	return {
		toAdd: toAdd,
		toRemove: toRemove
	};
};

Cities.prototype.getAddedCity = function (city) {
	for (var i in this._addedObjects) {
		if (this._addedObjects[i].city == city) {
			return this._addedObjects[i];
		}
	}

	return null;
};

Cities.prototype.getMaxYear = function () {
	return this._maxYear;
};

Cities.prototype.getMinYear = function () {
	return this._minYear;
};

Cities.prototype.canLoadMore = function () {
	return !this._noMoreCities;
};