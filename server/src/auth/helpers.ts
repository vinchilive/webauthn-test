import { sign, verify } from 'jsonwebtoken'
import corsConfig from '../config/cors'
import { Request, Response } from 'express'

type AuthCookies = {
  token?: string
}

export interface RequestWithCookies extends Request {
  cookies: AuthCookies
}

export const APP_SECRET =
  'APP_SECRET_APP_SECRET_APP_SECRET_APP_SECRET_APP_SECRET_123'

const AUTH_EXPIRATION = 1000 * 60 * 60 * 24 * 5

export function authenticateUser(request: RequestWithCookies): string | null {
  const { token } = request.cookies

  if (token) {
    const payload = verify(token, APP_SECRET)

    return typeof payload !== 'string' ? payload.userId : null
  }

  return null
}

export async function setAuthCookie(res: Response, userId: string) {
  const token = await sign({ userId }, APP_SECRET, {
    issuer: corsConfig.issuer,
    expiresIn: AUTH_EXPIRATION / 1000,
    subject: userId,
  })

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + AUTH_EXPIRATION),
  })
}

export async function clearAuthCookie(res: Response) {
  res.clearCookie('token')
}
