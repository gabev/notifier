const fcmAdmin = require('firebase-admin');
const nodemailer = require('nodemailer');

class NotificationSender {
  constructor(fcmAuthFile, emailTransporter) {
    this.upFCMServer(fcmAuthFile);
    this.createEmailTransporter(emailTransporter);
    this.from = emailTransporter.auth.user;
  }

  upFCMServer(fcmAuthFile) {
    this.fcmServer = fcmAdmin.initializeApp({
      credential: fcmAdmin.credential.cert(fcmAuthFile),
      databaseURL: 'https://trusty-informator.firebaseio.com',
    });
  }

  createEmailTransporter(emailTransporter) {
    this.emailTransporter = nodemailer.createTransport(emailTransporter);
  }

  sendMessage(message, destination, notificationType) {
    switch (notificationType) {
      case ('email'):
        this.sendEmail(message, destination);
        break;

      case ('android'):
        this.sendPush(message, destination);
        break;

      case ('ios'):
        this.sendPush(message, destination);
        break;

      default:
        break;
    }
  }

  sendEmail(message, destination) {
    if (message === undefined) {
      return;
    }

    const emailOptions = {
      from: this.from,
      to: destination,
      subject: message.subject,
      text: message.body,
    };
    this.emailTransporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  sendPush(message, client) {
    this.fcmServer.messaging().sendToDevice(client, message)
      .then((response) => {
        console.log('message is sent', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }
}

module.exports = NotificationSender;
