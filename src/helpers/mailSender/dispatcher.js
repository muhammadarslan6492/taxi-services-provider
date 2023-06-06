import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';

config();

sgMail.setApiKey(process.env.SENDGRID);

const DispatcherEmail = async (to) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL,
      subject: 'Ride assign Email!!!',
      html: '<p>Dispatcher  assigned a ride For You...</p>',
    };
    await sgMail.send(msg);
    return true;
  } catch (err) {
    return false;
  }
};

const acceptMail = async (to) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL,
      subject: 'Booking Accepted by the Driver!!!',
      html: '<p>Driver Accept your assign ride</p>',
    };
    await sgMail.send(msg);
    return true;
  } catch (err) {
    return false;
  }
};
const rejectMail = async (to, object) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL,
      subject: 'Booking Rejected by the Driver!!!',
      html: `<p>Driver Reject your assign ride: Reason: ${object}</p>`,
    };
    await sgMail.send(msg);
    return true;
  } catch (err) {
    return false;
  }
};

export { DispatcherEmail, acceptMail, rejectMail };
