const { MessageEmbed } = require('discord.js');
const { GUILD_ID } = require("../../config.json")

module.exports = {
    name: "embed",
    description: "json to embed",
    options: [{
        name: "json",
        description: "Enter a json embed",
        type: 3,
        required: true,
    }],
    run: async (client, interaction) => {
        const guild = interaction.guild;
        const Luerl = guild.members.cache.find(u => u.id === "466933159968374784");

        const author = interaction.member;
        author.fetch()

        if (["672090250725687299", "548191478069985291", "480114920957018112"].some(r => author.roles.cache.has(r)) || Luerl) {

            const guild = client.guilds.cache.get(GUILD_ID);
            let text = interaction.options.getString('json');
            const json = JSON.parse(text)
            interaction.reply({ content: "Успех", ephemeral: true })
            const embed = new MessageEmbed(json)
            interaction.channel.send({ embeds: [embed] })

        } else {
            const noperms = new MessageEmbed()
                .setDescription(`⛔ Недостаточно прав`)
                .setColor(COLOR)

            interaction.reply({ embeds: [noperms], ephemeral: true })
        }
    }
}