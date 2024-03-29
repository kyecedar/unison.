const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports = {
  entry: {
    name: "entrust",
    description: "Entrust a person with the \"trusted\" role.",
  },
  
  permissions: [ PermissionFlagsBits.Administrator ],
  roles: [],
  
  execute: async (interaction) => {
    await interaction.reply({ content: "This command hasn't been built yet.", ephemeral: true });
  }
};