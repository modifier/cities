var Cities = function () {
	this._loadedCities = [];
	this._page = 0;
	this._perPage = 1000;
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

			try {
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
      } catch (e) {
			  console.warn('some issues with a city', city, e);
      }
		}

		loadDfd.resolve();
	});

	return loadDfd;
};

Cities.prototype.getCities = function () {
	return this._loadedCities;
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
