import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';

config();

sgMail.setApiKey(process.env.SENDGRID);

const sendEmail = async (to, object) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL,
      subject: 'Password Reset - Mobio',
      html: `Your password reset token is here:{${object}}`,
    };
    await sgMail.send(msg);
    return true;
  } catch (err) {
    return false;
  }
};

export default sendEmail;
