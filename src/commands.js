//////////////////////////////////////
// VARIABLES /////////////////////////
//////////////////////////////////////

const { REST, Routes } = require("discord.js");
const rest = new REST({ version: "10" }).setToken(process.env["TOKEN"]);
const fs = require("fs");
const path = require("path");
const recursive = require("recursive-readdir");

let commands = {};





//////////////////////////////////////
// FUNCTIONS /////////////////////////
//////////////////////////////////////

const getApplicationCommands = async (client) =>
{
  let application_commands;

  if(process.env["GUILD_ID"]) {
    const guild = await client.guilds.fetch(process.env["GUILD_ID"]);
    application_commands = guild.commands;
  } else
    application_commands = await client.application.commands;

  await application_commands.fetch();
  return application_commands;
};

const getLocalCommands = () =>
{
  let local_commands = [];
  
  // find js files, extract and package commands.
  recursive(path.join(__dirname, "./commands"))
    .then((files) => {
      files.forEach((file, i) => {
        if(path.extname(file) == ".js") {
          // process each file.
          let command = require(file);
          let local_command = getLocalCommand(command, i);
          if(local_command) local_commands.push(local_command);
        }
      });
    },
    (error) => {
      return console.error("⚠️ Error scanning commands directory.\n", error);
    });

  return local_commands;
};

const getLocalCommand = (command, i) =>
{
  let { entry, permissions, roles, execute } = command;

  // checks.
  if(!entry)
    return console.log(`⚠️ Command ${i + 1} doesn't have an entry. Not registered.`);

  if(!entry.name)
    return console.log(`⚠️ Command ${i + 1} doesn't have a name. Not registered.`);

  if(!entry.description) {
    entry.description = "No description provided.";
    console.log(`⚠️ "${entry.name}" doesn't have a description. Default description entered.`);
  } else if(entry.description.length > 100) {
    entry.description = "Description too long.";
    console.log(`⚠️ "${entry.name}" has too long of a description. Default description entered.`);
  }

  entry.options = entry.options || [];

  permissions = permissions || [];
  roles = roles || [];
  execute = execute || (async (interaction, client) => {
    return await interaction.reply({ content: "That command isn't ready yet.", ephemeral: true });
  });

  return { entry, permissions, roles, execute };
};



const areCommandsDifferent = (local_command, existing_command) =>
{
  if(JSON.stringify(local_command) !== JSON.stringify(existing_command)) return true;
  return false;
};



const registerCommands = async (client) =>
{
  console.log("⚪ Registering commands...");

  console.log("Comparing application and local commands...");

  //try {
    local_commands = getLocalCommands();
    application_commands = await getApplicationCommands(client);

    for(const local_command of local_commands) {
      const { entry } = local_command;

      // create command object for us to access.
      if(!local_command.deleted)
        commands[entry.name] = {
          permissions: local_command.permissions,
          roles: local_command.roles,
          execute: local_command.execute,
        };

      // get existing counterpart.
      const existing_command = application_commands.cache.find(
        (command) => command.name === entry.name
      );

      // checks.
      if(existing_command) {
        // deleted.
        if(local_command.deleted) {
          await application_commands.delete(existing_command.id);
          console.log(`🗑️ Command "${entry.name}" deleted.`);
          continue;
        }

        const existing_entry = {
          name: existing_command.name,
          description: existing_command.description,
          options: existing_command.options || {},
        };

        // changed.
        if(areCommandsDifferent(entry, existing_entry)) {
          await application_commands.edit(existing_command.id, {
            description: entry.description, options: entry.options
          });

          console.log(`🔧 Command "${entry.name}" edited.`);
        }
      } else if(local_command.deleted) {
        // deleted.
        continue;
      }

      // created.
      await application_commands.create(entry);
      console.log(`✨ Command "${entry.name}" registered.`);
    }
  //} catch(error) {
    //console.log(`⚠️ Error in registering commands.\n${error}`);
  //}
};





//////////////////////////////////////
// EXPORTS ///////////////////////////
//////////////////////////////////////

module.exports = {
  registerCommands,
  list: commands,
};