const { Events } = require("../eventNames");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

module.exports.run = async (client) => {
    const Table = new Ascii("Events Loaded");

    (await PG(`${process.cwd()}/events/*/*.js`)).map(async (file) => {
        const event = require(file);

        if (!Events.includes(event.name) || !event.name) {
            const L = file.split("/");
            await Table.addRow(`${event.name} || "MISSING`, `⛔ Имя ивента не совпадает или оно отсутствует: ${L[6] + `/` + L[7]}`)
            return;
        }

        if (event.once) {
            client.once(event.name, (...args) => event.run(...args, client));
        } else {
            client.on(event.name, (...args) => event.run(...args, client));
        };

        await Table.addRow(event.name, "✔ SUCCESFUL")
    });

    console.log(Table.toString())

}