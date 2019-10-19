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
        if (fonts[font]) {
            currentFont = font
            log(`current font is now '${font}'`)
            await message.edit(`${message.content}\nfont now set to ${makeFancy(font,fonts[font])}`)
            setTimeout(() => message.delete(), 3000)
        }
        else {
           await message.edit(`${message.content}\navailable fonts: ${Object.keys(fonts).map(f=>makeFancy(f,fonts[f])).join("\n")}`)
            log(`font '${font}' does not exist`)
        }
    }
    else if (message.content.startsWith("!check")) {
        let font = message.content.split(" ")[1]
        log(`check ${font}`)
        if (fonts[font]) {
            message.edit(`${message.content}\n${fonts[font].join("")}`)
        }
    }
    else if (currentFont !== "normal") {
        log(`Fancy: ${message.content}`)
        let fancyMessage = makeFancy(message.content, fonts[currentFont])
        message.edit(fancyMessage)
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
