import { emailRegex } from "./regex"

export type SignupErrorCodeType = "auth/email-already-in-use" | "auth/invalid-email" | "auth/weak-password"
export type SigninErrorCodeType = "auth/invalid-email" | "auth/user-disabled" | "auth/user-not-found" | "auth/wrong-password"
type errorCodeType = SignupErrorCodeType | SigninErrorCodeType

export type SignupErrorType = {
  code: SignupErrorCodeType
}

export type SigninErrorType = {
  code: SigninErrorCodeType
}

type errorType = SignupErrorType | SigninErrorType | null

export const validateEmail = (email: string, callback: (arg0: any) => void, code: errorCodeType = "auth/invalid-email") => {
  const validEmail = email.match(emailRegex)

  if (typeof callback === 'function') {

    callback(!validEmail ? {
      code
    } : null)
  }
}

// TODO: remove 'any' type here ...
export const validatePassword = (password: string, callback: (arg0?: any) => void, code: errorCodeType = "auth/weak-password") => {
  const validPassword = password.length >= 6

  if (typeof callback === 'function') {
    callback(!validPassword ? {
      code
    } : null)
  }
}