import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import nodemailer from "nodemailer";


// MAIL_PORT = 465
// MAIL_HOST = smtp.mail.yahoo.com
// MAIL_USER = teax.sl@yahoo.com
// MAIL_PASS = amhg ycxx unqf plrf

// let transportOption = {
//   host: "smtp.mail.yahoo.com",
//   port: 465,
//   auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_PASS,
//   },
// } satisfies SMTPTransport.Options;
// this.transporter = nodeMailer.createTransport(transportOption);

// Create a transporter using SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.mail.yahoo.com", // e.g., 'Gmail', 'Outlook', etc.
  port: 465,
  auth: {
    user: "teax.sl@yahoo.com", // your email address
    pass: "amhg ycxx unqf plrf", // your email password
  },
});

type EmailParams = {
  title: string;
  message: string;
  subject: string;
  email: string;
};
// Function to send an email
export async function sendEmail({
  title,
  message,
  subject,
  email,
}: EmailParams) {
  try {
    // Define email data
    const mailOptions = {
      from: "teax.sl@yahoo.com", // sender's email address
      to: email,
      subject: subject,
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          
          <!-- Add Google Fonts -->
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
          
          <!-- Add inline styles for email -->
          <style>
              body {
                  font-family: 'Roboto', sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f2f2f2;
              }
      
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 5px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }
      
              h1 {
                  font-size: 20px;
                  font-weight: 700;
                  color: #333;
              }
      
              p {
                  font-size: 14px;
                  font-weight: 300;
                  color: #555;
                  line-height: 1.5;
              }
      
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color:#140f2d;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: 500;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>${title}</h1>
              <p>${message}.</p>
              <a href="" class="button">Go to ZHeath</a>
          </div>
      </body>
      </html>
      `, // HTML content
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return { status: "success", message: "Email sent successfully" };

  
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
}

export async function jwtEncode(data: any) {
  let encodedData = jwt.sign(data, process.env.APP_SECRET_KEY + "");
  return encodedData;
}

export async function jwtDecode(token: string) {
  let decodedData = jwt.decode(token);
  return decodedData;
}

export async function encryptBankCardNumber(data: any) {
  let encryptedData = jwt.sign(data, process.env.APP_SECRET_KEY + "mysceret");
  return encryptedData;
}

export async function decryptBankCardNumber(token: string) {
  let decryptedData = jwt.decode(token);
  return decryptedData;
}

export async function hashData(_data: any) {
  let data = String(_data);
  let salt = await bcrypt.genSalt(10);
  let encryptedData = await bcrypt.hash(data, salt);
  return encryptedData;
}

export async function matchWithHashedData(data: string, hashedData: string) {
  try {
    let isMatch = await bcrypt.compare(data, hashedData);
    return isMatch;
  } catch (error) {
    console.log({ "BCRYPT COMPARE": error });
  }
}

export const encodeFormData = (data: any): string => {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");
};

export async function handleFormSubmitGeneral(
  formData: any,
  url: string,
): Promise<void> {
  try {
    const newformData = encodeFormData(formData);
    const request = await fetch(url, {
      method: "POST",
      body: newformData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const data = await request.json();
    console.log(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
}
