const { Client, ContextMenuInteraction } = require("discord.js");
const { MessageEmbed } = require('discord.js');
const { COLOR, CLIENT_ID, GUILD_ID } = require("../../config.json");

module.exports = {
  name: "Репутация",
  description: "Репутация",
  type: 2,
  /**
   *
   * @param {Client} client
   * @param {ContextMenuInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction) => {
    const targetid = interaction.targetId;
  }
};