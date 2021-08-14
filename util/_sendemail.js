const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config()

// const REFRESH_TOKEN = "1//0417a3B3_ZCqSCgYIARAAGAQSNwF-L9IraZUXv3IIFlT08Nzxhg8xsuNdFh964K0w-ZKmN7Ci0vdyEfgsDQhSrNmQSzSxAQODoDM"
// const CLIENT_ID = "316313260853-ank2llsjqro4nf3163si8uacircoiplh.apps.googleusercontent.com"
// const CLIENT_SECRET = "UZBrSl5lFkkwxc-jQ58moHsX"
// const REDIRECT_URL = "https://developers.google.com/oauthplayground"

const REFRESH_TOKEN = process.env.REFRESH_TOKEN
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URL = process.env.REDIRECT_URL

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (email, url) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'swayam14feb@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });

    const mailOptions = {
        from: 'Memories 👨🏻 <swayam14feb@gmail.com>',
        to: email,
        subject: 'Password Change Request',
        text: 'Click on the link below to reset your password',
        html: `<h1>Click on the link below to reset your password...</h1>
        <a href=${url}>${url}</a>
        <p>Thanks,</p>
        <p>Swayam Nayak, Memories</p>
        `,
    };

    await transport.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { sendEmail } 