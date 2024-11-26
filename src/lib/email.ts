import nodemailer from 'nodemailer'

export async function sendEmail({ to, subject, html }: { 
  to: string
  subject: string
  html: string 
}) {
  const transporter = nodemailer.createTransport({
    // Configure your email provider here
  })

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  })
}