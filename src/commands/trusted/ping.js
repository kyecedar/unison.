const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports = {
  entry: {
    name: "ping",
    description: "Test ping.",
  },
  
  permissions: [],
  roles: [process.env['TRUSTED_ROLE_ID']],
  
  execute: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true });
    const reply = await interaction.fetchReply();
    const ping = reply.createdTimestamp - interaction.createdTimestamp;
    interaction.editReply(`Pong. [ client\`${ping}ms\`, websocket\`${client.ws.ping}ms\` ]`);
  }
};