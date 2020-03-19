const keys = require('../config/keys');
const newUserSignup = ({ name, email, _id }) => {
    const uid_link = `${process.env.DOMAIN}/users/${_id}`
    const template = {
      from: `${name}<${email}>`,
      to: process.env.EMAIL,
      subject: `${name} - New Account Request`,
      text: `A new user has signed up.\r\nName: ${name}\r\n${uid_link}`,
      html: `<p>A new user has signed up.</p><p>Name: ${name}</p><p><a href="${uid_link}">${uid_link}</a></p>`
    }
  
    return template
  }

  const newAuctionMailer = ({ name, email, _id }) => {
    const uid_link = `${process.env.LOCALHOST}/shared/view-auctions`
    const template = {
      from: `Swaggify <${keys.mail.user}>`,
      to: 'knowhowkwaramba@gmail.com',//process.env.EMAIL,
      subject: `${name} - New Auction`,
      text: `A new auction .\r\nName: ${name}\r\n${uid_link}`,
      html: `<p>A new auction has signed up.</p><p>Auction name: ${name}</p><p><a href="${uid_link}">Click me to visit swaggify auction</a></p>`
    }
  
    return template
  }
  
  module.exports = {
    newUserSignup,
    newAuctionMailer
  }
  