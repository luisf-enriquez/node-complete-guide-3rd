const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email, // Change to your recipient
        from: 'luisenriquez.542@gmail.com', // Change to your verified sender
        subject: 'Thanks for joining in',
        text: `Welcome to the App ${name}. Let me know how you get along with the App`,
        // html: '<h2>We did it Baby!!</h2>',
    });
};

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email, // Change to your recipient
        from: 'luisenriquez.542@gmail.com', // Change to your verified sender
        subject: 'We are sad to see you go!!',
        text: `We are sorry ${name}. Let me know how what we could have done to provide a better service`,
        html: '<h2>You have just canceled your subscription!!</h2>',
    });
};

module.exports = { 
    sendWelcomeEmail,
    sendCancelEmail
};