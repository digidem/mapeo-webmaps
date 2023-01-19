import { emailRegex } from './regex'

export const validateEmail = (email: string) => (email.match(emailRegex) ? null : 'auth/invalid-email')

// TODO: remove 'any' type here ...
export const validatePassword = (password: string) => (password.length >= 6 ? null : 'auth/weak-password')
