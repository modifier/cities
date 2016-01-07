(function () {
	var myMap = null,
		cities = new Cities(),
		mapObjects = null,
		$year = document.getElementById('current_year'),
		$slider = document.getElementById('year_slider');

	var pageStartDfd = new Deferred();
	document.addEventListener('DOMContentLoaded', function () {
		ymaps.ready(function () {
			pageStartDfd.resolve();
		});
	});

	Deferred.when(pageStartDfd, cities.load()).done(function () {
	    myMap = new ymaps.Map('map', {
	        center: [59.949038,30.309377],
	        zoom: 5
	    });

		noUiSlider.create($slider, {
			start: [859],
			range: {
				min: 859,
				max: 1400
			}
		});

		mapObjects = new MapObjects(myMap, cities);
		updateSlider();

	    $slider.noUiSlider.on('update', changeYear);
	});

	function updateSlider () {
	    $slider.max = cities.getMaxYear();
	    $slider.min = cities.getMinYear();
	    $slider.disabled = false;

	    changeYear();
	};

	function changeYear () {
		$year.innerHTML = parseInt($slider.noUiSlider.get());

		if ($slider.value == cities.getMaxYear() && cities.canLoadMore()) {
			$slider.disabled = 'disabled';

			cities.load().done(function () {
				updateSlider();
			});
		}

		mapObjects.updateCities(parseInt($slider.noUiSlider.get()));
	}
})();