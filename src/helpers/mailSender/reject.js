import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';

config();

sgMail.setApiKey(process.env.SENDGRID);

export default {
  rejectMAil: async (to, object) => {
    try {
      const msg = {
        to,
        from: process.env.EMAIL,
        subject: 'OnBoarding Rejection!!!',
        html: `<p>Your Onboarding request is rejected. the reason for which is "${object}"</p>`,
      };
      await sgMail.send(msg);
      return true;
    } catch (err) {
      return false;
    }
  },
  rejectionFixed: async (to) => {
    try {
      const msg = {
        to,
        from: process.env.EMAIL,
        subject: 'Onboarding Updated',
        html: '<p>Sir please consider my submission again</p>',
      };
      await sgMail.send(msg);
      return true;
    } catch (err) {
      return false;
    }
  },
};
