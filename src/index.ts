import dotenv from 'dotenv';
import { createTransport } from 'nodemailer';
import { google } from 'googleapis';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(mail, name) {
  const accessToken = await oAuth2Client.getAccessToken();
  const transport = createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'maurits.smedberg@elev.ga.ntig.se',
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken
    }
  });

  const mailOptions = {
    from: 'Maurits Smedberg <maurits.smedberg@elev.ga.ntig.se>',
    to: mail,
    subject: "Order Confirmation",
    html: `
      <div style="width: 100%; height: 100%; margin: 0; background-color: #f6f9fc;">
        <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
          <div style="box-sizing: border-box; width: 100%; height: 70px; padding: 0 40px;">
            <div style="height: 100%; border-bottom: 1px solid #ebeef1;">
              <img src="https://www.50archive.com/images/logo.svg" style="height: 100%;">
            </div>
          </div>
          <div style="box-sizing: border-box; padding: 0 40px;">
            <div style="border-bottom: 1px solid #ebeef1; padding: 32px 0;">
              <span style="line-height: 28px; font-size: 20px; color: #32325d; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Ubuntu';">Här är en påminelse</span>
              <span style="padding-top: 16px;display: block;font-size: 16px;color: #525f7f;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Ubuntu';">Tjena ${name},</span>
              <span style="padding-top: 8px; display: block; font-size: 16px; color: #525f7f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Ubuntu';">Du borde göra bla bla bla</span>
              <span style="padding-top: 16px; display: block; font-size: 16px; color: #525f7f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'    , 'Helvetica Neue', 'Ubuntu';">-- Maurits Smedberg</span>
            </div>
          </div>
        </div>
        <div style="display:block; height: 64px; width: 100%;"></div>
      </div>
    `
  }

  await transport.sendMail(mailOptions);
}

sendMail("emil@50archive.com", "Emil Poppler");