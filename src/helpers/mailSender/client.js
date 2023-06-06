import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';

config();

sgMail.setApiKey(process.env.SENDGRID);

const sendEmail = async (fName, lName, to, object) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL,
      subject: 'Welcome to Mobio',
      html: `<p><b>Hi ${fName} ${lName},</b></p>
      <p>Your customer account has been registered with Mobio, your credentials are as following:</p>
      <p><b>Email:</b>&nbsp;${to}</p>
      <p><b>Password:</b>&nbsp;${object}</p>
      <p><b>Regards,</b>
      </p><p>Team Mobio</p>`,
    };
    await sgMail.send(msg);
    return true;
  } catch (error) {
    return false;
  }
};

export default sendEmail;
