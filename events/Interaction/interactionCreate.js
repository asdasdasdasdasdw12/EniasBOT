module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async run(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.run(client, interaction);
            } catch (err) {
                if (err) console.error(err);

                await interaction.reply({
                    content: "Ann error occured while runing that command.",
                    ephemeral: true
                });
            }
        }
        // Context Menu Handling
        if (interaction.isContextMenu()) {
            await interaction.deferReply({ ephemeral: false });
            const command = client.commands.get(interaction.commandName);
            if (command) command.run(client, interaction);
        }

    }
};