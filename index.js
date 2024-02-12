require('dotenv').config();
const { readFileSync } = require('fs');
const { Client, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Configuration, OpenAIApi } = require("openai");


const client = new Client({
    authStrategy: new LocalAuth({clientId:"block-golpista", dataPath:"./session-store"})
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

client.on('message', async (message) => {
    try {
        // Verifica se a mensagem veio de um usuário e se não é uma mensagem de sistema
            if (message.fromMe || message.type !== 'chat') {
                return;
            }
            if(message.from.split('@').shift() === "5511919366028"){
                console.log('message :>> ', message.body);
                const text= readFileSync('./shrek.txt',
                { encoding: 'utf8', flag: 'r' });
                const lines = text.split('\n')
                for (let i = 0; i < lines.length; i++) {
                  const line = lines[i]
                  await client.sendMessage(message.from, line);
                  await sleep(250)
                }
                message.reply('Ainda você quer?')
                return;
            }
              // Obtém o texto da mensagem recebida
            const text = message.body.toLowerCase();
            console.log('message :>> ', message);
            // generateCompletion(text).then((result) => {
            //     message.reply(result)
            // });
            // if(message.body.startsWith("#")) {
            //     generateCompletion(message.body.substring(1)).then((result) => {
            //         message.reply(result)
            //     });
            // }

            // if(message.body.startsWith("$")) {
            //     generateImage(message.body.substring(1)).then((result) => {
            //         message.reply(result)
            //     });
            // }
                
    } catch (error) {
        console.log('error :>> ', error);
    }
    
});

const generateCompletion = async (message) => {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
        stop: [" Human:", " AI:"],
    });
    return completion.data.choices[0].text;
}

const generateImage = async (description) => {
    const image=await openai.createImage({
        prompt: description,
        n: 1,
        size: "512x512",
      });
    //   console.log('image :>> ', image);
      return image.data.data[0].url;
}


const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
