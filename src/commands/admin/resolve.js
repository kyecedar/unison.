const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports = {
  entry: {
    name: "resolve",
    description: "Resolve an issue ticket.",
  },
  
  permissions: [ PermissionFlagsBits.Administrator ],
  roles: [],
  
  execute: async (interaction) => {
    await interaction.reply({ content: "This command hasn't been built yet.", ephemeral: true });
  }
};