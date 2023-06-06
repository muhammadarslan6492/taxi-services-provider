import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

sgMail.setApiKey(process.env.SENDGRID);

const sendEmail = async (to, object) => {
  try {
    const token = jwt.sign({ id: object.id },
      process.env.JWT,
      { expiresIn: process.env.LINK_EXPIRY });
    const msg = {
      to,
      from: process.env.EMAIL,
      subject: 'Welcome to Mobio',
      html: `<p><b>Hi ${object.fullName ? object.fullName : object.companyName},</b></p><br/><p>Thank you for registring with Mobio. Please <a href="${process.env.URL}/api/user/verify/${token}">verify</a> your account to access your account. Note that this link will expire after 5 hours.</p><br/><p><b>Regards,</b></p><p>Team Mobio</p>`,
    };
    await sgMail.send(msg);
    return true;
  } catch (err) {
    return false;
  }
};

export default sendEmail;
