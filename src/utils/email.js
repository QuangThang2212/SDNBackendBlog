import nodemailer from 'nodemailer';
import emailValidator from 'email-validator';

const sendEmail = (to) => {
    if (!emailValidator.validate(to)) {
        console.log('Email không hợp lệ.');
        return;
    }

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

    let mailOptions = {
        from: from,
        to: to,
        subject: 'Xác nhận người dùng thành công',
        html: `<p>Đăng kí thành công</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error.message);
        } else {
            console.log('Email sent successfully!');
        }
    });
}

export default sendEmail;