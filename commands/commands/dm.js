module.exports = {
    name: "dm",
    description: "Отправить сообщение в лс",
    options: [{
        name: "user",
        description: "Select a user",
        type: 6,
        required: true,
    },
    {
        name: "text",
        description: "Enter a text",
        type: 3,
        required: true
    }],
    async run(client, interaction) {
        const Luerl = guild.members.cache.find(u => u.id === "466933159968374784");
        const author = interaction.member;
        author.fetch()
        if (["672090250725687299", "548191478069985291", "480114920957018112"].some(r => author.roles.cache.has(r)) || Luerl) {
            let text = interaction.options.getString('text');
            const user = interaction.options.getMember('user');

            user.send(`${text}`)
            interaction.reply({ content: `Сообщение успешно отправленно.`, ephemeral: true })
        }
    }
}