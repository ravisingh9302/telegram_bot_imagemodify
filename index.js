import 'dotenv/config'
import { Buffer, Blob } from 'node:buffer';
import TelegramBot from 'node-telegram-bot-api';
import sharp from 'sharp';
// import Compressor from 'compressorjs';
// import ExifReader from 'exifreader';


const token = process.env.BOT_API_KEY;
const bot = new TelegramBot(token, { polling: true, filepath: false });

let picMsgId;
let taskdo = new Array()
let shp;
let msgId;

const keyboardbtn = [[
    { text: 'Flip', callback_data: 'flip', },
    { text: 'Flop', callback_data: 'flop' }],
[{ text: 'Rotate', callback_data: 'rotate' },
{ text: 'Resize', callback_data: 'resize' }],
[{ text: 'Compress', callback_data: 'compress' },
{ text: 'Compress & resize', callback_data: 'compresswithresize' }],
[{ text: 'Negative', callback_data: 'negative' },
{ text: 'Blur', callback_data: 'blur' }],
[{ text: 'RemoveAlpha', callback_data: 'removealpha' },
{ text: 'Extract Channel', callback_data: 'extractchannel' }],
]



bot.on('message', async (msg) => {
    console.log("message",msg)
    // const chatId = msg.chat.id;
    // const username = msg.chat.first_name;
    // const userid = msg.from.id
    // const photo = await bot.getUserProfilePhotos(userid)
    // console.log("safafasfsa", photo.photos[0][0])
    // const abcd = await bot.getFile(photo.photos[0][2].file_id)
    // console.log("phofafsafasfasfa", abcd)
    // bot.sendPhoto(chatId, bot.getUserProfilePhotos(userid))
    // bot.sendPhoto(chatId, photo.photos[0][0].file_id)
});


bot.on('text', (msg) => {
    console.log("Text Event: ", msg)
    var hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(hi) === 0) {
        bot.sendMessage(msg.chat.id, "Hello Dear User");
    }

    var hello = "hello";
    if (msg.text.toString().toLowerCase().indexOf(hello) === 0) {
        bot.sendMessage(msg.chat.id, "Hello dear user");
    }

    if(msg.text.toString().toLowerCase()==="tauvaa"){
        bot.sendMessage(msg.chat.id, "Tauvee");
    }
    if(msg.text.toString().toLowerCase()==="kauvaa"){
        bot.sendMessage(msg.chat.id, "Kauvee");
    }
    if(msg.text.toString().toLowerCase()==="pagal"){
        bot.sendMessage(msg.chat.id, "Pagaliya");
    }
    if(msg.text.toString().toLowerCase()==="kissmiss"){
        bot.sendMessage(msg.chat.id, "Chasmiss");
    }
})

bot.on('document', async (msg) => {
    console.log("document event", msg)
    bot.sendMessage(msg.chat.id, "Have");
    const docid = msg.document.file_id
    const doc = await bot.getFile(docid)
    const imgab = await fetch(`https://api.telegram.org/file/bot7035670601:AAGm8l2ATEOFuNoftUyBY8eG5jVuCT8UCgI/${doc.file_path}`)
    const buff = await imgab.arrayBuffer()
})


bot.on('photo', async (msg) => {
    picMsgId = msg.photo[msg.photo.length - 1].file_id
    const img = await bot.getFile(picMsgId)
    const imgab = await fetch(`https://api.telegram.org/file/bot7035670601:AAGm8l2ATEOFuNoftUyBY8eG5jVuCT8UCgI/${img.file_path}`)

    // const bbb = await imgab.blob()
    const buff = await imgab.arrayBuffer()
    // let bl = new Blob([buff])
    const buf = Buffer.from(buff) // CONVERT TO BUFFER FROM BUFFER ARRAY
    //const ba = buf.toString('base64')
    //  const uuuuu = new File([buff],"abcd.jpg",{type:"image/jpg"});
    // const tags = ExifReader.load(buf)

    msgId = msg.chat.id
    const xyz = await sharp(buf).metadata()
    shp = sharp(buf)

    await bot.sendMessage(msg.chat.id, `format: <b>${xyz.format}</b> \nsize: <b>${(xyz.size / 1024).toFixed(2)} KB</b> \nwidth: <b>${xyz.width}</b> \nheight: <b>${(xyz.height)} </b> \nalphaChannel: <b>${xyz.hasAlpha} </b> \ndensity: <b>${(xyz.density)} </b> \nsubsampling: <b>${xyz.chromaSubsampling} </b> \nchannels: <b>${(xyz.channels)} </b>`, {
        "reply_to_message_id": msg.message_id,
        "parse_mode": "HTML"
    })

    const reply = await bot.sendMessage(msg.chat.id, `<b>What you want to do with you photo?</b>`, {
        "reply_to_message_id": msg.message_id,
        parse_mode:"HTML",
        "reply_markup": { "remove_keyboard": false, "inline_keyboard": keyboardbtn, "one_time_keyboard": true, }
    })


});


bot.on("callback_query", async (e) => {

    bot.deleteMessage(e.message.chat.id, e.message.message_id)
    bot.sendMessage(e.message.chat.id, e.data)
    const task = e.data;
    taskdo.push(e.data)
    console.log("afsffaf", picMsgId)

    if (task === 'flip') {
        console.log("flip")
        await shp.flip().toBuffer((err, buff, info) => {
            bot.sendPhoto(msgId, buff, { caption: `Your Modified image after <b>flip</b> \nformat: <b>${info.format}</b> \nsize: <b>${(info.size / 1024).toFixed(2)} KB</b> \nwidth: <b>${info.width}</b> \nheight: <b>${info.height} </b>`, parse_mode: "HTML" });
        })
        await bot.sendMessage(msgId,"Choose option for further modification", {
            "reply_markup": { "remove_keyboard": false, "inline_keyboard": keyboardbtn, "one_time_keyboard": true, }
        })

    }
    if (task === 'flop') {
        console.log("flop")
        await shp.flop().toBuffer((err, buff, info) => {
            bot.sendPhoto(msgId, buff, { caption: `Your Modified Image after <b>flop</b> \nformat: <b>${info.format}</b> \nsize: <b>${(info.size / 1024).toFixed(2)} KB</b> \nwidth: <b>${info.width}</b> \nheight: <b>${info.height} </b>`, parse_mode: "HTML" }).then(e => { console.log(e) });
        })
        await bot.sendMessage(msgId, "Choose option for further modification", {
            "reply_markup": { "remove_keyboard": false, "inline_keyboard": keyboardbtn, "one_time_keyboard": true, }
        }).then((e) => {
            console.log(e)
        })
    }
    if (task === 'rotate') {
        console.log("rotate")
        await shp.rotate(90).toBuffer((err, buff, info) => {
            bot.sendPhoto(msgId, buff, { caption: `Your Modified image after <b>rotate</b> \nformat: <b>${info.format}</b> \nsize: <b>${(info.size / 1024).toFixed(2)} KB</b> \nwidth: <b>${info.width}</b> \nheight: <b>${info.height} </b>`, parse_mode: "HTML" });
        })
        await bot.sendMessage(msgId, "Choose option for further modification", {
            "reply_markup": { "remove_keyboard": false, "inline_keyboard": keyboardbtn, "one_time_keyboard": true, }
        })
    }
    if (task === 'resize') {
        console.log("resize")
        await shp.resize(800).toBuffer((err, buff, info) => {
            bot.sendPhoto(msgId, buff, { caption: `Your Modified Image after <b>Resize</b> \nformat: <b>${info.format}</b> \nsize: <b>${(info.size / 1024).toFixed(2)} KB</b> \nwidth: <b>${info.width}</b> \nheight: <b>${info.height} </b>`, parse_mode: "HTML" });
        })
        await bot.sendMessage(msgId, "Choose option for further modification", {
            "reply_markup": { "remove_keyboard": false, "inline_keyboard": keyboardbtn, "one_time_keyboard": true, }
        })
    }
    if (task === 'compress') {
        console.log("compress")
        await shp.jpeg({ "quality": 50 }).toBuffer((err, buff, info) => {
            bot.sendPhoto(msgId, buff, { caption: `Your Modified Image after <b>Compress</b> \nformat: <b>${info.format}</b> \nsize: <b>${(info.size / 1024).toFixed(2)} KB</b> \nwidth: <b>${info.width}</b> \nheight: <b>${info.height} </b>`, parse_mode: "HTML" });
        })
        await bot.sendMessage(msgId, "Choose option for further modification", {
            "reply_markup": { "remove_keyboard": false, "inline_keyboard": keyboardbtn, "one_time_keyboard": true, }
        })
    }
    if (task === 'compresswithresize') {
        console.log("compresswithresize")
        await shp.resize(800).jpeg({ "quality": 50 }).toBuffer((err, buff, info) => {
            bot.sendPhoto(msgId, buff, { caption: `Your Modified Image after <b>Compresswithsize</b> \nformat: <b>${info.format}</b> \nsize: <b>${(info.size / 1024).toFixed(2)} KB</b> \nwidth: <b>${info.width}</b> \nheight: <b>${info.height} </b>`, parse_mode: "HTML" });
        })
        await bot.sendMessage(msgId, "Choose option for further modification", {
            "reply_markup": { "remove_keyboard": false, "inline_keyboard": keyboardbtn, "one_time_keyboard": true, }
        })
    }
    if (task === 'negative') {
        console.log("negative")
        await shp.negate({ "alpha": true }).toBuffer((err, buff, info) => {
            bot.sendPhoto(msgId, buff, { caption: `Your Modified Image after <b>Negative</b> \nformat: <b>${info.format}</b> \nsize: <b>${(info.size / 1024).toFixed(2)} KB</b> \nwidth: <b>${info.width}</b> \nheight: <b>${info.height} </b>`, parse_mode: "HTML" });
        })
        await bot.sendMessage(msgId, "Choose option for further modification", {
            "reply_markup": { "remove_keyboard": false, "inline_keyboard": keyboardbtn, "one_time_keyboard": true, }
        })
    }
    if (task === 'blur') {
        console.log("blue")
        console.log(shp)
        await shp?.blur(0.6).toBuffer((err, buff, info) => {
            bot.sendPhoto(msgId, buff, { caption: `Your Modified Image after <b>Blur</b> \nformat: <b>${info.format}</b> \nsize: <b>${(info.size / 1024).toFixed(2)} KB</b> \nwidth: <b>${info.width}</b> \nheight: <b>${info.height} </b>`, parse_mode: "HTML" });
        })
        await bot.sendMessage(msgId, "Choose option for further modification", {
            "reply_markup": { "remove_keyboard": false, "inline_keyboard": keyboardbtn, "one_time_keyboard": true, }
        })
    }
    if (task === 'removealpha') {
        console.log("removealpha")
        // const rImg = await xyz.removeAlpha().toBuffer()
        await shp.removeAlpha().toBuffer((err, buff, info) => {
            bot.sendPhoto(msgId, buff, { caption: `Your Modified Image after <b>Removing alpha</b> \nformat: <b>${info.format}</b> \nsize: <b>${(info.size / 1024).toFixed(2)} KB</b> \nwidth: <b>${info.width}</b> \nheight: <b>${info.height} </b>`, parse_mode: "HTML" });
        })
        await bot.sendMessage(msgId, "Choose option for further modification", {
            "reply_markup": { "remove_keyboard": false, "inline_keyboard": keyboardbtn, "one_time_keyboard": true, }
        })
    }
    if (task === 'extractchannel') {
        console.log("extractchannel")
        await shp.extractChannel(1).toBuffer((err, buff, info) => {
            bot.sendPhoto(msgId, buff, { caption: `Your Modified Image after <b>Extracting channel</b> \nformat: <b>${info.format}</b> \nsize: <b>${(info.size / 1024).toFixed(2)} KB</b> \nwidth: <b>${info.width}</b> \nheight: <b>${info.height} </b>`, parse_mode: "HTML" });
        })
        await bot.sendMessage(msgId, "Choose option for further modification", {
            "reply_markup": { "remove_keyboard": false, "inline_keyboard": keyboardbtn, "one_time_keyboard": true, }
        })
    }

})


bot.on('audio', (msg) => {
    // console.log("audioEvent: ", msg)
    bot.sendMessage(msg.chat.id, "No Action for audio");
    bot.sendMessage(msg.chat.id, " <b>Please go with Menu</b>",{parse_mode:"HTML"});
})

bot.on('chat_member', (msg) => {
    console.log("chatmemberEvent: ", msg)
})


bot.on('contact', (msg) => {
    console.log("contactEvent: ", msg)
})


bot.on('video_chat_started', (msg) => {
    console.log("video_chat_startedEvent: ", msg)
})

bot.on('animation', (msg) => {
    console.log("animationEvent: ", msg)
})

bot.on('channel_post', (msg) => {
    console.log("channel_postEvent: ", msg)
})

bot.on('channel_post', (msg) => {
    console.log("channel_postEvent: ", msg)
})

bot.on('polling_error', (mg) => {
    console.log("polling error", mg)
})
bot.on('webhook_error', (mg) => {
    console.log("webhook error", mg)
})
bot.on('video', (mg) => {
    // console.log("video event", mg)
    bot.sendMessage(msg.chat.id, "No Action for Video");
    bot.sendMessage(msg.chat.id, " <b>Please go with Menu</b>",{parse_mode:"HTML"});
})

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome \n Bot is Created by- Ravi Shankar singh",);
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, `<b>Upload Image to Modifiy It according \n to option and get Image Info. </b>`,{parse_mode:"HTML"});
});


bot.onText(/\/picforme/, async (msg) => {
    const imaag = await fetch("https://picsum.photos/200");
    bot.sendPhoto(msg.chat.id, imaag.url, { caption: "The Random image for you! \n Have a good luck." });
});

