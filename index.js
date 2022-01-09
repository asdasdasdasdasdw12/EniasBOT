const { Client, Collection } = require("discord.js");
const { token, MONGO_DB } = require('./config.json')

const client = new Client({
  presence: {
    status: 'Я родился:baby_chick:',
    afk: false,
    activities: [{
      type: 'WATCHING',
      name: 'на попу Алёны',
    }],
  },
  intents: 1667,
  disableEveryone: true,
  disabledEvents: ["TYPING_START"],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
module.exports = client;
client.config = require('./config');

const events = require("./handlers/events");
events.run(client);

client.commands = new Collection();
const commands = require("./handlers/command");
commands.run(client);

client.login(token)