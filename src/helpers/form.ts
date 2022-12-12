import { emailRegex } from "./regex"

type errorCodeType = "auth/email-already-in-use" | "auth/invalid-email" | "auth/weak-password"
export type errorType = {
  code: errorCodeType
} | null

export const validateEmail = (email: string, callback: (arg0: errorType) => void) => {
  const validEmail = email.match(emailRegex)

  if (typeof callback === 'function') {

    callback(!validEmail ? {
      code: "auth/invalid-email"
    } : null)
  }
}

export const validatePassword = (password: string, callback: (arg0: errorType) => void, code: errorCodeType = "auth/weak-password") => {
  const validPassword = password.length >= 6

  if (typeof callback === 'function') {
    callback(!validPassword ? {
      code
    } : null)
  }
}
