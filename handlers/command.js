const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");
const { token, CLIENT_ID, GUILD_ID } = require('../config.json');
const Table = new Ascii("Slash'es Loaded");

const CommandsArray = [];
module.exports.run = async (client) => {

    (await PG(`${process.cwd()}/commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if (!command.name)
            return Table.addRow(file.split("/")[7], "⛔ Error", "Отсутствует имя.");
        if (!command.description) {
            return Table.addRow(command.name, "⛔ Error", "Отсутствует описание.");
        }
        client.commands.set(command.name, command);

        if ([2, 3].includes(command.type)) delete command.description;

        CommandsArray.push(command);

        Table.addRow(command.name, "✔ Успех")

    });
    console.log(Table.toString())

    const rest = new REST({
        version: "9"
    }).setToken(token);

    try {
        console.log("Обновление слеш команд...")

        rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: CommandsArray,
        })
        console.log("Слеш команды успешно обновлены.")
    } catch (error) {
        console.log(error)
    }

};