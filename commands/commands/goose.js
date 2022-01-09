const fetch = require("node-fetch");
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "goose",
    description: "Просто гусь",
    async run(client, interaction) {
        fetch(`https://nekos.life/api/v2/img/goose`)
            .then(res => res.json())
            .then(json => {
                let embed = new MessageEmbed()
                    .setImage(json.url)
                interaction.reply({ embeds: [embed], ephemeral: true });
            })
    }
}