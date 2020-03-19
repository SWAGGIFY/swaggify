const nodemailer = require('nodemailer');
const keys = require('../config/keys')

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: keys.mail.user,
    pass: keys.mail.pass
  }
});

const sendMail = (template, data) => {
  try {
    const newEmail = template(data)
    smtpTransport.sendMail(newEmail)
  } catch (err) {
    throw err
  }
}

module.exports = sendMail
