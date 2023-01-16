import { emailRegex } from './regex'

export type SignupErrorCodeType = 'auth/email-already-in-use' | 'auth/invalid-email' | 'auth/weak-password'
export type SigninErrorCodeType =
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
type ErrorCodeType = SignupErrorCodeType | SigninErrorCodeType

export type SignupErrorType =
  | {
      code: SignupErrorCodeType
    }
  | undefined

export type SigninErrorType =
  | {
      code: SigninErrorCodeType
    }
  | undefined

type ErrorType = SignupErrorType | SigninErrorType | null

// export const validateEmail = (email: string) => email.match(emailRegex)
export const validateEmail = (
  email: string,
  callback: (arg0: any) => void,
  code: SignupErrorCodeType = 'auth/invalid-email',
) => {
  const validEmail = email.match(emailRegex)

  if (typeof callback === 'function') {
    callback(
      !validEmail
        ? {
            code,
          }
        : null,
    )
  }
}

// TODO: remove 'any' type here ...
export const validatePassword = (
  password: string,
  callback: (arg0?: any) => void,
  code: ErrorCodeType = 'auth/weak-password',
) => {
  const validPassword = password.length >= 6

  if (typeof callback === 'function') {
    callback(
      !validPassword
        ? {
            code,
          }
        : null,
    )
  }
}
