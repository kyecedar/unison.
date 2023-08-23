//////////////////////////////////////
// VARIABLES /////////////////////////
//////////////////////////////////////

const TOKEN = process.env["TOKEN"];

const { Client, PermissionFlagsBits, IntentsBitField } = require("discord.js");
const client = new Client({
  intents: [
    IntentsBitField.Flags.DirectMessages, IntentsBitField.Flags.DirectMessageReactions,
    
    IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildModeration,
    IntentsBitField.Flags.GuildMessageReactions, IntentsBitField.Flags.GuildMessages,

    IntentsBitField.Flags.MessageContent,
  ]
});

const commands = require("./commands.js");





// check if token has been provided.
if(!TOKEN) {
  console.error("No token provided. Cannot log in.");
  process.exit(1);
}





//////////////////////////////////////
// LISTENERS /////////////////////////
//////////////////////////////////////

client.on("ready", (c) => {
  // register slash commands.
  commands.registerCommands(client);
  
  //console.clear();
  console.log(`✨ Online as ${c.user.tag}.`);
});



client.on("interactionCreate", (interaction) => {
  if(!interaction.isChatInputCommand())
    return;

  let command = commands.list[interaction.commandName];
  let member = interaction.member;
  
  if(command) {
    if(interaction.guild.id != process.env["GUILD_ID"])
      return interaction.reply({ content: "This bot is not made for this server.", ephemeral: true });

    if(!command.execute)
      return interaction.reply({ content: "That command isn't ready yet.", ephemeral: true });
    
    // permission checks.
    if(member.permissions.has(PermissionFlagsBits.Administrator))
      return command.execute(interaction, client);

    // test permissions.
    if(command.permissions?.length)
      if(!member.permissions.has(command.permissions))
        return interaction.reply({ content: "Invalid permissions.", ephemeral: true });

    // test roles.
    if(command.roles?.length)
      if(!member.roles.cache.has(command.roles))
        return interaction.reply({ content: "Invalid roles.", ephemeral: true });

    // execute command.
    return command.execute(interaction, client);
  }

  command = null;
  member = null;
});

//client.on("messageCreate", (msg) => {
  // reverse message.
  //console.log(msg.content);
  //if(msg.author.id != client.user.id)
    //msg.channel.send(msg.content.split("").reverse().join(""));
//});



// log in.
client.login(TOKEN);