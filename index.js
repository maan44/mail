const fs = require('fs');
const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyparser = require('body-parser');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const port = process.env.PORT || 3000
const app = express();
const router = express.Router();

const pathToAttachment = path.join(__dirname,'Result.jpg');
const attachement = fs.readFileSync(pathToAttachment);

app.use(bodyparser.json());

// api key for using SendGrid
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

const createMail = async (req, res, next) => {

  const { userData} = req.body;

  userData.forEach((data) => {
    const msg = {
      to: `${data.email}`,
      from: "mansing.nitrr@gmail.com",
      subject: "Sending with SendGrid",
      text: "Test mail",
      html: `<strong>Hi ${data.name} your result is ${data.status}</strong>`,
      attachments: [
        {
          content: attachment,
          filename: "Result.jpg",
          type: "application/jpg",
          disposition: "attachment"
        }
      ]
    };

    transporter
      .sendMail(msg)
      .then((response) => {
        res.status(200).json({
          status: 200,
          message: "Mail Sent successfully",
          data: {},
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Error",

        });
      });
  });
  };

  router.post("/mail", createMail);

  app.use("/", router);

app.listen(3000,() => {
  console.log('Listening on port 3000');
});