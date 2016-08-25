var helpMessage = "Welcome to Discord Notifier by comp500.\n\
`[DN] set channel` - set this current channel to receive updates\n\
`[DN] remove channel` - stop updates being posted in this channel\n\
`[DN] help` - show this help message\n\
You need the manage channels permission to modify channel updates.";
var channelListFile = "channels.json";
var sourcesDir = "./sources/";
var clientToken = "{YOUR-KEY}";

var Discordie = require("discordie");
var fs = require("fs");
var Events = Discordie.Events;

var client = new Discordie();

var requiredPermission = Discordie.Permissions.General.MANAGE_CHANNEL;
var requiredPermissionAlternate = Discordie.Permissions.General.MANAGE_CHANNELS;

client.connect({ token: clientToken });

var channelList;
var sourcesList;
var cleanupList = [];

try {
	channelList = JSON.parse(fs.readFileSync(channelListFile, {"encoding": "utf8"}));
} catch (e) {
	if (e.code !== 'ENOENT') {
		throw e;
	}
	channelList = {"channels": []};
	fs.writeFileSync(channelListFile, JSON.stringify({"channels": []}));
}

process.on('SIGINT', function() {
	console.log("Caught interrupt signal, cleaning up...");
	client.disconnect();
	for (var i = 0; i < cleanupList.length; i++) {
		channelList = cleanupList[i](channelList);
	}
	fs.writeFileSync(channelListFile, JSON.stringify(channelList));
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
	console.log("Connected as: " + client.User.username);
	client.User.setGame("[DN] help");
	sourcesList = fs.readdirSync(sourcesDir);
	for (var i = 0; i < sourcesList.length; i++) {
		try {
			cleanupList.push(require(sourcesDir + sourcesList[i])(function (message) {
				for (var j = 0; j < channelList.channels.length; j++) {
					if (client.Channels.get(channelList.channels[j])) {
						client.Channels.get(channelList.channels[j]).sendMessage(message);
					} else {
						channelList.channels.splice(j, 1);
					}
				}
			}));
		} catch(e) {
			console.error("Failed to load source " + sourcesList[i]);
			console.error(e);
		}
	}
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
	msg = e.message.content.toLowerCase();
	if (msg.substr(0,4) == "[dn]") {
		if (msg.indexOf("help") != -1) {
			e.message.author.openDM().then(function (dm, error) {
				if (error) {
					console.error("Error opening Direct Message channel for user " + e.message.author.username);
					return;
				}
				dm.sendMessage(helpMessage);
			}).catch(function () {
				console.error("Error opening Direct Message channel for user " + e.message.author.username);
			});
		} else if (msg.indexOf("channel") != -1) {
			if (e.message.isPrivate) {
				e.message.reply("Private message channels cannot be used for Discord Notifier (yet)");
			} else {
				if (e.message.author.can(requiredPermission, e.message.channel) || e.message.author.can(requiredPermissionAlternate, e.message.channel)) {
					if (msg.indexOf("set") != -1) {
						if (channelList.channels.indexOf(e.message.channel.id.toString()) != -1) {
							e.message.reply("This channel is already being used with Discord Notifier.");
						} else {
							channelList.channels.push(e.message.channel.id);
							e.message.channel.sendMessage("This channel is now setup for use with Discord Notifier.");
						}
					} else if (msg.indexOf("remove") != -1) {
						var index = channelList.channels.indexOf(e.message.channel.id);
						if (index == -1) {
							e.message.reply("This channel is not being used with Discord Notifier.");
						} else {
							channelList.channels.splice(index, 1);
							e.message.channel.sendMessage("This channel has been removed from usage with Discord Notifier.");
						}
					} else {
						e.message.reply("Your command was not recognised, try [DN] help");
					}
				} else {
					e.message.reply("You don't have permission to do that!");
				}
			}
		} else {
			e.message.reply("Your command not recognised, try [DN] help");
		}
	}
});