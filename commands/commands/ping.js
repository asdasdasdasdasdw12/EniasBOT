const { MessageEmbed } = require('discord.js');
module.exports = {
  name: "ping",
  description: "pong!",
  async run(client, interaction) {
    let ping = (client.ws.ping);
    if (ping > 400) {
      const embedping400 = new MessageEmbed()
        .setColor('#ff2400')
        .setTitle('Ping')
        .setDescription(`:ping_pong: | Понг! Задержка ${ping}ms`)
        .setThumbnail('https://luerl21.github.io/assets/chiken.gif')
        .setTimestamp()
        .setFooter('Фаатааграафиирууюю заакаат буудтаа пааруу леет наазаад', 'https://luerl21.github.io/assets/zxc.gif');
      interaction.reply({ embeds: [embedping400], ephemeral: true });
    }
    else {
      const embedping = new MessageEmbed()
        .setColor('#00FF00')
        .setTitle('Ping')
        .setDescription(`:ping_pong: | Понг! Задержка ${ping}ms`)
        .setTimestamp()
        .setFooter('Сrow-crow', 'https://luerl21.github.io/assets/chiken.png');
      interaction.reply({ embeds: [embedping], ephemeral: true });
    };
  }
}; 