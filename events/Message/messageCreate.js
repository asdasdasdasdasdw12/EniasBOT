module.exports = {
    name: "messageCreate",

    async run(message) {
        if (message.author.bot) return;
        if (!message.guild) return;
    }
};