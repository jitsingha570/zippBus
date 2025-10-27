const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing Brevo SMTP credentials in environment variables.");
    }

    // Create transporter using Brevo SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"ZippBus" <jitsingha570@gmail.com>`, // ✅ Verified sender from Brevo
      to,
      subject,
      text,
    });

    console.log(`✅ Email sent successfully to ${to}`);
    console.log("📧 Message ID:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
    console.error("🔍 Full error details:", error);
    throw new Error("Failed to send OTP email. Please check your SMTP configuration.");
  }
};

module.exports = sendEmail;
