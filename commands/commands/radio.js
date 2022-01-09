const voice = require('@discordjs/voice');
const got = require("got");
const { WebSocket } = require("ws");
const { MessageEmbed, Message } = require("discord.js");
const { COLOR } = require("../../config.json")
let isWsUpdated = false;

module.exports = {
    name: "radio",
    description: "Playing radio",
    options: [
        {
            name: "jpop",
            description: "Playing jpop radio",
            type: 3,
            required: false,
            choices: [
                { name: "play", value: "play" },
                { name: "stop", value: "stop" }
            ]
        },
        {
            name: "custom",
            description: "Playing custom radio",
            type: 3,
            required: false,
        },
        {
            name: "volume",
            description: "Enter a song volume",
            type: 10,
            required: false,
        }
    ],
    async run(client, interaction, message) {
        const notinvoice = new MessageEmbed()
            .setTitle("You are not in voice channel")
            .setColor(COLOR)
        if (!interaction.member.voice.channel) return interaction.reply({ embeds: [notinvoice], ephemeral: true });

        let connection = voice.joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
        })

        const jpop = interaction.options.getString("jpop");
        const custom = interaction.options.getString("custom");
        let volume = interaction.options.getNumber('volume');
        if (volume > 1) volume = 1;

        const player = voice.createAudioPlayer()
        switch (jpop) {
            case "play":

                if (!interaction.member.voice.channel) return interaction.reply("You're not in a voice channel?");

                let stream = got.stream("https://listen.moe/stream");
                const resource = voice.createAudioResource(stream, { inlineVolume: true });
                resource.volume.setVolume(volume || 0.5);

                let dispatcher = player.play(resource, {
                    type: "opus"
                },
                );
                connection.subscribe(player)

                if (isWsUpdated) return interaction.reply("Playing");

                isWsUpdated = true;
                const jpopplay = new MessageEmbed()
                    .setTitle("Song: Waiting...")
                    .setColor(COLOR)
                const mess = await interaction.channel.send({ embeds: [jpopplay] });
                interaction.reply({ content: "Done", ephemeral: true })

                const gateway = 'wss://listen.moe/gateway_v2';
                let hbInterval;
                let radioData = {};

                function initWS() {
                    const ws = new WebSocket(gateway);

                    ws.onopen = () => {
                        console.info('[WS] connected.');
                        clearInterval(hbInterval);
                    };

                    ws.onerror = err => {
                        console.error(err);
                    };

                    ws.onclose = err => {
                        if (!isWsUpdated) return;
                        console.info('[WS] disconnected. Reconnecting...', err.reason);
                        clearInterval(hbInterval);
                        setTimeout(initWS, 5000);
                    };

                    ws.onmessage = message => {
                        // console.log(interaction.channel.messages.fetch(mess.id))
                        if (!isWsUpdated) {

                            const jpopstop = new MessageEmbed()
                                .setDescription(`Stoped`)
                                .setColor(COLOR)

                            mess.edit({ embeds: [jpopstop] })
                            setInterval(() => {
                                mess.delete();
                            }, 5000)

                            ws.close();
                        }
                        if (!message.data.length) return;

                        let response;

                        try {
                            response = JSON.parse(message.data);
                        } catch (err) {
                            console.error(err);
                            return;
                        }

                        if (response.op === 0) {
                            hbInterval = setInterval(() => {
                                ws.send(JSON.stringify({ op: 9 }));
                            }, response.d.heartbeat);
                            return;
                        }

                        if (response.op === 1) {
                            if (response.t !== 'TRACK_UPDATE' && response.t !== 'TRACK_UPDATE_REQUEST') return;
                            const song = response.d.song;
                            let songimage = song?.albums[0]?.image ? ("https://cdn.listen.moe/covers/" + song.albums[0].image) : "https://cdn.discordapp.com/attachments/858804614375669811/929501651088343090/Frame_2.png";
                            let songromaji = song?.albums[0]?.nameRomaji ? song.albums[0].nameRomaji : song.albums[0]?.name ? song.albums[0]?.name : "no album";

                            const jpopplayedit = new MessageEmbed()
                                .setTitle(`Song: ${song.title}`)
                                .setDescription(`Album: ${songromaji}\nArtist: ${song.artists[0].name}`)
                                .setThumbnail(songimage)
                                .setColor(COLOR)
                            mess.edit({ embeds: [jpopplayedit] });

                            const channelId = connection.joinConfig.channelId;
                            const guild = interaction.guild;
                            const channel = guild.channels.cache.get(channelId)
                            if (channel.members.size < 2 && interaction.guild.channels.cache.some(channel => channel.type === "GUILD_VOICE" && channel.members.has(client.user.id))) {
                                // console.log("SUCCESFUL")
                                setTimeout(() => {
                                    connection.destroy();
                                    isWsUpdated = false;
                                    mess.delete();
                                }, 5000);
                            }

                        }
                    };
                }

                initWS();
                break;

            case "stop":
                connection.destroy();
                isWsUpdated = false;
                interaction.reply({ content: "Stoped", ephemeral: true })
                break;
        };
        if (custom) {
            let stream = got.stream(custom);
            const resource = voice.createAudioResource(stream, { inlineVolume: true });
            resource.volume.setVolume(volume || 0.5);

            let dispatcher = player.play(resource, {
                type: "opus"
            },
            );
            connection.subscribe(player)
            interaction.reply("Done")
        };
    }
}