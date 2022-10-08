const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false,
    auth: {
        user: 'patredepio@protonmail.com',
        pass: 'david.com4190'
    },
})

transporter.verify(function (error, success) {
    if (error) {
        console.log(error)
    }
    else {
        console.log('server is ready to take messages')
    }
})

// const mailOptions = {
//     from: "profiletesting121@gmail.com",
//     to: "patredepio@gmail.com",
//     subject: 'Welcome message',
//     text: 'testing nodemailer',
// }

// return transporter.sendMail(mailOptions, (error, info) => {
//     console.log(error, info)
// })