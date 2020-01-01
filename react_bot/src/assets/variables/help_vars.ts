export let vars = {
    rpc: {
        desc: "Role per category; whether or not users are allowed to only use 1 role per category of roles",
        usage: `::config rpc set [on/off]/[true/false]`
    },
    prefix: {
        desc: "The prefix for the guild",
        usage: `::config prefix set [prefix]/default`
    },
    modlog: {
        desc: "A mod-log channel, the bot will send every action/punishment with detailed information in there, so mods/admins can reference it at any given time",
        usage: `::config modlog [save/remove] [(#channel/channel_id)/---]`
    }
}