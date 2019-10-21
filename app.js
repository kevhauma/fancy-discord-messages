let Discord = require("discord.js")
require("dotenv").config()
const client = new Discord.Client()
let fonts = require("./fonts.json")
let currentFont = "normal"
let fs = require("fs")
Object.keys(fonts).forEach(k => {
    fonts[k] = fonts[k].split(" ")
})


function makeFancy(m, f) {
    return m.split("")
        .map(l => {
            let i = fonts.normal.indexOf(l)
            return i >= 0 ? f[i] : l
        })
        .join("")
}


client.on("message", async(message) => {
    if (message.author.id !== client.user.id) return
    if (message.content.startsWith("!font")) {
        let font = message.content.split(" ")[1]
        font = font ? font.toLowerCase() : null
        if (fonts[font]) {
            currentFont = font
            await message.edit(`${message.content}\nfont now set to ${makeFancy(font,fonts[font])}`)
            log(`current font is now '${font}'`)
            setTimeout(async() => {
                await message.delete();
                log("deleted message")
            }, 3000)
        }
        else {
            await message.edit(`${message.content}\navailable fonts: ${Object.keys(fonts).map(f=>makeFancy(f,fonts[f])).join("\n")}`)
            log(`font '${font}' does not exist`)
        }
    }
    else if (message.content.startsWith("!check")) {
        let font = message.content.split(" ")[1]
        if (fonts[font]) {
            await message.edit(`${message.content}\n${fonts[font].join("")}`)
            log(`check ${font}`)
        }
        else {
            await message.edit(`${message.content}\ncheck for '${font}' does not exist`)
            log(`fontcheck for '${font}' does not exists`)
        }

    }
    else if (message.content.startsWith("!reload")) {
        delete require.cache[require.resolve('./fonts.json')]
        fonts = require("./fonts.json")
        await message.edit(`${message.content}\n reloaded fonts file`)
        log("reloaded fonts")
    }
    else if (currentFont !== "normal" || message.content) {
        let fancyMessage = makeFancy(message.content, fonts[currentFont])
        await message.edit(fancyMessage)
        log(`Fancy: ${message.content}`)
    }
})



client.on("ready", () => {
    log(`active in ${client.guilds.array().length} guilds`)
    log("ready to make fancy text")

})
client.login(process.env.TOKEN)


function log(s) {
    console.log(`[${new Date().toLocaleTimeString()}] ${s}`)
}
