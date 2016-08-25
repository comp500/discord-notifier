module.exports = function(publish) {
	/*var Twitter = require('twitter');
	var client = new Twitter({
		consumer_key: '{YOUR-KEY}',
		consumer_secret: '{YOUR-KEY}',
		access_token_key: '{YOUR-KEY}',
		access_token_secret: '{YOUR-KEY}'
	});
	var streamVar;
	client.stream('statuses/filter', {follow: '1962811932,3033103596', with: 'user'}, function(stream) {
		stream.on('data', function(event) {
			publish("**@" + event.user.screen_name + "**" + ": " + event.text);
		});

		stream.on('error', function(error) {
			//throw error;
			console.error(error);
		});
		streamVar = stream;
	});*/
	return function (database) {
		//streamVar.destroy();
		return database;
	};
};