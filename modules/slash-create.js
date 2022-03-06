const fs = require('fs')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config')

module.exports = (client) => {
    let testingcmds = []

    fs.readdirSync('./commands').forEach(dirs => {
        const cmds = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'))

        for (const file of cmds) {
            const command = require(`../commands/${dirs}/${file}`)
            client.logger.cmds(`Loading command ${file}`)
            client.commands.set(command.name.toLowerCase(), command)

            let desc = `Execute ${command.name} command`
            if (command.description) desc = command.description

            const slash = new SlashCommandBuilder()
                .setName(command.name.toLowerCase())
                .setDescription(desc)

            if (command.args) {
                command.args.forEach((arg) => {
                    let options;
                    if (arg.type == "number") {
                        let desc2 = arg.desc
                        if (!desc2) desc2 = "Insert number here"
                        slash.addIntegerOption(opts =>
                            options = opts
                        )

                        if (!arg.req) {
                            options.setName(arg.name)
                                .setDescription(desc2)
                        } else {
                            options.setName(arg.name)
                                .setDescription(desc2)
                                .setRequired(true)
                        }
                    }

                    if (arg.type == "text") {
                        let options;
                        let desc2 = arg.desc
                        if (!desc2) desc2 = "Insert text here"
                        slash.addStringOption(opts =>
                            options = opts
                        )

                        if (!arg.req) {
                            options.setName(arg.name)
                                .setDescription(desc2)
                        } else {
                            options.setName(arg.name)
                                .setDescription(desc2)
                                .setRequired(true)
                        }
                    }

                    if (arg.type == "mention") {
                        let options;
                        let desc2 = arg.desc
                        if (!desc2) desc2 = "Mention someone here"
                        slash.addUserOption(opts =>
                            options = opts
                        )

                        if (!arg.req) {
                            options.setName(arg.name)
                                .setDescription(desc2)
                        } else {
                            options.setName(arg.name)
                                .setDescription(desc2)
                                .setRequired(true)
                        }
                    }

                    if (arg.type == "channel") {
                        let options;
                        let desc2 = arg.desc
                        if (!desc2) desc2 = "Select channel"
                        slash.addChannelOption(opts =>
                            options = opts
                        )

                        if (!arg.req) {
                            options.setName(arg.name)
                                .setDescription(desc2)
                        } else {
                            options.setName(arg.name)
                                .setDescription(desc2)
                                .setRequired(true)
                        }
                    }

                    if (arg.type == "selectionmenu") {
                        let options;
                        let desc2 = arg.desc
                        if (!desc2) desc2 = "Select someting from the menu"
                        slash.addStringOption(opts =>
                            options = opts
                        )
                        if (!arg.req) {
                            options.setName(arg.name)
                                .setDescription(desc2)
                        } else {
                            options.setName(arg.name)
                                .setDescription(desc2)
                                .setRequired(true)
                        }

                        if (arg.items) {
                            arg.items.forEach((item) => {
                                options.addChoice(item, item.toLowerCase())
                            })
                        }
                    }

                    if (arg.type == "subcommand") {
                        let options;
                        let desc2 = arg.desc
                        if (!desc2) desc2 = "Select someting from the menu"
                        slash.addSubcommand(opts =>
                            options = opts
                        )
                        options.setName(arg.name)
                            .setDescription(desc2)

                        if (arg.args) {
                            arg.args.forEach((arg2) => {
                                if (arg2.type == "text") {
                                    let options2;
                                    let desc2 = arg2.desc
                                    if (!desc2) desc2 = "Insert text here"
                                    options.addStringOption(opts =>
                                        options2 = opts
                                    )

                                    if (!arg2.req) {
                                        options2.setName(arg2.name)
                                            .setDescription(desc2)
                                    } else {
                                        options2.setName(arg2.name)
                                            .setDescription(desc2)
                                            .setRequired(true)
                                    }

                                    if (arg2.items) {
                                        arg2.items.forEach((item) => {
                                            options2.addChoice(item, item.toLowerCase())
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            }

            testingcmds.push(slash)
        };
    });

    const rest = new REST({ version: '9' }).setToken(config.discord.token);

    (async () => {
        try {
            await rest.put(
                Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId),
                { body: testingcmds },
            );
        } catch (error) {
            console.error(error);
        }
    })();
}