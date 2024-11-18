import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);

// Initialize the Mailgun client with your API key
const mg = mailgun.client({
  username: "api",
  key: process.env.REACT_APP_MAILGUN_API_KEY, // Store your API key securely
});

/**
 * Send an email using Mailgun
 * @param {string} to - Recipient's email address
 * @param {string} from - Sender's email address
 * @param {string} subject - Email subject
 * @param {string} textContent - Plain text email content
 * @param {string} htmlContent - HTML email content
 * @returns {Promise} - Resolves with Mailgun's response or rejects with an error
 */
const SendEmail = async (to, from, subject, text, html) => {
  try {
    const response = await mg.messages.create(
      "sandbox1463264fb2744256b74af8ebe920ea0c.mailgun.org",
      {
        from,
        to,
        subject,
        text,
        html,
      },
    );
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Mailgun error response:", error.response.body); // Log detailed Mailgun error
      console.log("Mailgun API Key:", process.env.REACT_APP_MAILGUN_API_KEY);
    } else {
      console.error("Error sending email:", error);
      console.log("Mailgun API Key:", process.env.REACT_APP_MAILGUN_API_KEY);
    }
    throw error;
  }
};

export default SendEmail;
