// server/utils/sendEmail.js
const brevo = require("@getbrevo/brevo");

const sendEmail = async (to, subject, message) => {
  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = message;
    sendSmtpEmail.sender = {
      name: process.env.EMAIL_SENDER_NAME || "ZippBus",
      email: process.env.EMAIL_SENDER_EMAIL || "jitsingha570@gmail.com",
    };
    sendSmtpEmail.to = [{ email: to }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    console.error("🔍 Full error:", error);
    return false;
  }
};

module.exports = sendEmail;
