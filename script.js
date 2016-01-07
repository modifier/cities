(function () {
	var cities = new Cities(),
		mapObjects = null,
		$handle = null,
		$slider = document.getElementById('year_slider');

	var pageStartDfd = new Deferred();
	document.addEventListener('DOMContentLoaded', function () {
		ymaps.ready(function () {
			pageStartDfd.resolve();
		});
	});

	Deferred.when(pageStartDfd, cities.load()).done(function () {
	    var map = new ymaps.Map('map', {
	        center: [58.525, 31.275], // coordinates of Holmgard
	        zoom: 5,
            controls: ['zoomControl', 'typeSelector']
	    });

		noUiSlider.create($slider, {
			start: [800],
			range: {
				min: 800,
				max: 1000
			}
		});
		$handle = $slider.querySelector('.noUi-handle');

		mapObjects = new MapObjects(map, cities);
		updateSlider();

	    $slider.noUiSlider.on('update', changeYear);
	});

	function updateSlider () {
		$slider.noUiSlider.updateOptions({
			range: {
				min: cities.getMinYear(),
				max: cities.getMaxYear()
			}
		});
	    $slider.disabled = false;

	    changeYear();
	};

	function changeYear () {
		var year = parseInt($slider.noUiSlider.get());
		$handle.innerHTML = year;

		if (year === cities.getMaxYear() && cities.canLoadMore()) {
			$slider.disabled = 'disabled';

			cities.load().done(function () {
				updateSlider();
			});
		}

		mapObjects.updateCities(year);
	}
})();