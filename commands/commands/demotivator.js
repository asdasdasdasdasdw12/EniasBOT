const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage } = require('canvas')

module.exports = {
    name: "demotivator",
    description: "Create a demotivator.",
    options: [{
        name: "title",
        description: "Enter title.",
        type: 3,
        require: true
    },
    {
        name: "subtitle",
        description: "Enter subtitle.",
        type: 3,
        require: true
    },
    {
        name: "imageurl",
        description: "Enter image url.",
        type: 3,
        require: true
    }],

    async run(client, interaction) {

        let title = interaction.options.getString('title')
        let subtitle = interaction.options.getString('subtitle')
        let imageurl = interaction.options.getString('imageurl')
        if (!subtitle) subtitle = "";
        const imageProperties = {
            width: 714,
            height: 745
        }

        const canvas = createCanvas(imageProperties.width, imageProperties.height)

        const ctx = canvas.getContext('2d')
        ctx.font = '48px Times New Roman'

        const image = await loadImage("https://luerl21.github.io/assets/demotivator.png")
        ctx.drawImage(image, 0, 0)
        const avatar = await loadImage(imageurl);
        ctx.drawImage(avatar, 46, 46, 622, 551)

        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        ctx.fillText(title, 345, 660)

        ctx.font = 'normal 40px Times New Roman'
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        ctx.fillText(subtitle, 346, 710)
        const attachment = new MessageAttachment(canvas.toBuffer(), 'demotivator.png');
        interaction.channel.send({ files: [attachment], ephemeral: true });
        await interaction.deferReply();
        await wait(2500);
        await interaction.editReply('Done!');
    }


};