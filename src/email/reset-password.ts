import { Html } from '@react-email/html'

export default function ResetPasswordEmail({ resetUrl }: { resetUrl: string }) {
  return (
    <Html>
      <p>Click the link below to reset your password:</p>
      <a href={resetUrl}>{resetUrl}</a>
    </Html>
  )
}