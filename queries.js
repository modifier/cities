var Queries = (function () {
	var getXhr = function (options) {
		var xhr = new XMLHttpRequest(),
			dfd = new Deferred();

		xhr.open("GET", options.url, true);
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		     if(xhr.status == 200) {
		     	var response = JSON.parse(xhr.responseText);

		        dfd.resolve(response.results.bindings);
		    }
		  }
		};
		xhr.send(null);

		return dfd;
	};

	var countries = {
		russia: 'Q159',
		belarus: 'Q184',
		ukraine: 'Q212'
	};

	var alaska = 'Q797';

	return {
		loadCitiesData: function (page, perPage) {
			var query = [
			"PREFIX wd: <http://www.wikidata.org/entity/>",
			"PREFIX wdt: <http://www.wikidata.org/prop/direct/>",
			"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23>",
			" ",
			"SELECT * WHERE {"];

			var unionQueries = ["?city wdt:P131 wd:" + alaska + " ."];
			for (var i in countries) {
				unionQueries.push("?city wdt:P17 wd:" + countries[i] + " .");
			}

			query.push("{" + unionQueries.join(" } UNION {") + "}")

			query = query.concat([
			"  ?city wdt:P625 ?coordinate .",
			"  ?city wdt:P571 ?inception .",
			"  ?city rdfs:label ?name filter (lang(?name) = \"ru\").",
			"  ?city wdt:P31 wd:Q515",
			"}",
			"ORDER BY ?inception"]);

			query.push("LIMIT " + perPage + " OFFSET " + (page - 1) * perPage);

			return getXhr({
				url: "https://query.wikidata.org/sparql?format=json&query=" + query.join(" ")
			});
		}
	}
})();