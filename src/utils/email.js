import nodemailer from 'nodemailer'

// const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: 'congmanhbn20021@gmail.com',
//         pass: 'qardyyyewgoryvwe',
//     },
// });

// export const verifyEmail = async (email, verificationCode) => {
//     const mailOptions = {
//         from: 'congmanhbn20021@gmail.com',
//         to: email,
//         subject: 'Verify your email address',
//         text: `Please click on the following link to verify your email address: ${verificationCode}`,
//     };

//     await transporter.sendMail(mailOptions);
// };

// dotenv.config();


const sendEmail = (to, verificationCode) => {
    let from = `G6 <${process.env.MAIL_ADDRESS}>`;
    console.log(from);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD
        },
        from: from
    });
    

    // const html = ejs.render(emailTemplate, templateData);
    let mailOptions = {
        from: from,
        to: to,
        subject: 'Verify your email address',
        html: `<p>Please click on the following link to verify your email address: ${verificationCode}</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error.message);
            return;
        }
        console.log('Email sent successfully!');
    });
}

export default sendEmail;
// sendEmail()