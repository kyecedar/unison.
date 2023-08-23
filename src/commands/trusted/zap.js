const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports = {
  entry: {
    name: "zap",
    description: "If a user is abusing their power, 2 people can use this command to un-entrust them.",
  },
  
  permissions: [],
  roles: [process.env['TRUSTED_ROLE_ID']],
  
  execute: async (interaction) => {
    await interaction.reply({ content: "This command hasn't been built yet.", ephemeral: true });
  }
};