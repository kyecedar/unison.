const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports = {
  entry: {
    name: "roll",
    description: "Roll a die.",
    options: [
      {
        name: "sides",
        description: "Sides on the die. Default is 6. Minimum is 2.",
        type: ApplicationCommandOptionType.Number,
      }
    ]
  },
  
  permissions: [],
  roles: [],
  
  execute: async (interaction) => {
    let sides = interaction.options.get("sides").value || 6;

    if(sides < 2)
      return await interaction.reply("Must have at least 2 sides.");
    
    return await interaction.reply(`It landed on **${Math.ceil(Math.random() * sides)}**.`);
  }
};