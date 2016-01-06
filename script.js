(function () {
	var myMap = null,
		cities = new Cities(),
		mapObjects = null;

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

		$slider.addEventListener('input', changeYear);

		mapObjects = new MapObjects(myMap, cities);
		updateSlider();
	});

	function updateSlider () {
	    $slider.max = cities.getMaxYear();
	    $slider.min = cities.getMinYear();
	    $slider.disabled = false;

	    changeYear();
	};

	var $year = document.getElementById('current_year'),
		$slider = document.getElementById('year_slider');

	function changeYear () {
		$year.innerHTML = $slider.value;

		if ($slider.value == cities.getMaxYear() && cities.canLoadMore()) {
			$slider.disabled = 'disabled';

			cities.load().done(function () {
				updateSlider();
			});
		}

		mapObjects.updateCities($slider.value);
	}
})();