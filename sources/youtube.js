module.exports = function(publish, database) {
	/*var YouTube = require('youtube-node');
	var youTube = new YouTube();
	youTube.setKey('{YOUR-KEY}');
	
	youTube.addParam("order", "date");
	youTube.addParam("relevanceLanguage", "en");
	youTube.addParam("type", "video");
	youTube.addParam("videoEmbeddable", "true");
	youTube.addParam("fields", "items/id");
	
	if (!database.hasOwnProperty("youtube")) {
		database["youtube"] = [];
	}
	
	var searchFunction = function () {
		console.log("Searching...");
		youTube.search('YTP', 10, function(error, result) {
			if (error) {
				console.log(error);
			}
			else {
				if (result.hasOwnProperty("items")) {
				for (var i = result.items.length - 1; i > 0; i--) {
					if (database.youtube.indexOf(result.items[i].id.videoId) == -1) {
						publish("https://www.youtube.com/watch?v=" + result.items[i].id.videoId);
						console.log("https://www.youtube.com/watch?v=" + result.items[i].id.videoId);
						database.youtube.push(result.items[i].id.videoId);
					}
				}
				} else {
					console.log(result);
					console.log("Youtube -> Error parsing response.");
				}
			}
		});
	};
	
	var interval = setInterval(searchFunction, 300000);
	setImmediate(searchFunction);*/
	
	return function (databaseModified) {
		/*clearInterval(interval);
		databaseModified["youtube"] = database.youtube;*/
		return databaseModified;
	}
};