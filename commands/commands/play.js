const ytdl = require("discord-ytdl-core");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const fs = require("fs")


module.exports = {
  name: "play",
  description: "Playing music.",
  options: [{
    name: "song",
    description: "Enter a song name or url.",
    type: 3,
    required: false,
  }],
  async run(client, interaction) {
    let song = interaction.options.getString('song');
    if (!interaction.member.voice.channel) return interaction.reply("You're not in a voice channel?");
    let stream = ytdl(song, {
      filter: "audioonly",
      opusEncoded: true,
      encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
    })
    const resource = createAudioResource(stream, { inlineVolume: true });
    resource.volume.setVolume(0.5);
    const player = createAudioPlayer()
    let connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
    })


    let dispatcher = player.play(resource, {
      type: "opus"
    })
    connection.subscribe(player);
    setTimeout(() => {
      connection.destroy();
    }, 15000)

  }
}