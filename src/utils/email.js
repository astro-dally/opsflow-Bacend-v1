import nodemailer from "nodemailer"
import config from "../config/config.js"
import logger from "./logger.js"

/**
 * Email class for sending emails
 */
class Email {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.name.split(" ")[0]
    this.url = url
    this.from = config.email.from
  }

  /**
   * Create a transporter
   */
  newTransport() {
    return nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      auth: {
        user: config.email.username,
        pass: config.email.password,
      },
    })
  }

  /**
   * Send an email
   * @param {string} template - Email template
   * @param {string} subject - Email subject
   */
  async send(template, subject) {
    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: this.generateHTML(template),
    }

    // Create a transport and send email
    try {
      await this.newTransport().sendMail(mailOptions)
      logger.info(`Email sent to ${this.to}`)
    } catch (error) {
      logger.error(`Error sending email: ${error.message}`)
      throw error
    }
  }

  /**
   * Generate HTML for email
   * @param {string} template - Email template name
   * @returns {string} HTML content
   */
  generateHTML(template) {
    switch (template) {
      case "welcome":
        return this.generateWelcomeEmail()
      case "passwordReset":
        return this.generatePasswordResetEmail()
      case "passwordChanged":
        return this.generatePasswordChangedEmail()
      default:
        return this.generateDefaultEmail()
    }
  }

  /**
   * Generate welcome email
   * @returns {string} HTML content
   */
  generateWelcomeEmail() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to OpsFloww, ${this.firstName}!</h2>
        <p>We're excited to have you on board. Please verify your email by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${this.url}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px;">Verify Email</a>
        </div>
        <p>If the button doesn't work, you can also click on the link below:</p>
        <p><a href="${this.url}">${this.url}</a></p>
        <p>If you need any help, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The OpsFloww Team</p>
      </div>
    `
  }

  /**
   * Generate password reset email
   * @returns {string} HTML content
   */
  generatePasswordResetEmail() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${this.firstName},</p>
        <p>You requested to reset your password. Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${this.url}" style="background-color: #2196F3; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can also click on the link below:</p>
        <p><a href="${this.url}">${this.url}</a></p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p>Best regards,<br>The OpsFloww Team</p>
      </div>
    `
  }

  /**
   * Generate password changed email
   * @returns {string} HTML content
   */
  generatePasswordChangedEmail() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Changed Successfully</h2>
        <p>Hi ${this.firstName},</p>
        <p>Your password has been changed successfully.</p>
        <p>If you didn't change your password, please contact our support team immediately.</p>
        <p>Best regards,<br>The OpsFloww Team</p>
      </div>
    `
  }

  /**
   * Generate default email
   * @returns {string} HTML content
   */
  generateDefaultEmail() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello, ${this.firstName}</h2>
        <p>Thank you for using OpsFloww.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The OpsFloww Team</p>
      </div>
    `
  }

  /**
   * Send welcome email
   */
  async sendWelcome() {
    await this.send("welcome", "Welcome to OpsFloww!")
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset() {
    await this.send("passwordReset", "Your password reset token (valid for 1 hour)")
  }

  /**
   * Send password changed email
   */
  async sendPasswordChanged() {
    await this.send("passwordChanged", "Your password has been changed")
  }
}

export default Email
