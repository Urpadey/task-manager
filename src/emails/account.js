const sendmail = require('sendmail')({
    silent: false,
    smtpHost: 'smtp-relay.gmail.com',
    smtpPort: 25,


})


const mail = (email, name, subject, message) => {
    sendmail({
        from: 'profiletesting121@gmail.com',
        to: `${email}`,
        subject: `${subject}`,
        html: `<h2>Hi ${name}</h2>
                <h4>${message}</h4>`,
    }, (err, reply) => {
        if (err) {
            throw new Error('email not sent')
        }
        console.log(reply)
    })
}


module.exports = mail
