import jwt from 'jsonwebtoken'
import { JWTPayload } from './types'
import { serialize } from 'cookie'

// generate jwt token
export function generateJwt(jwtPayload: JWTPayload): string {

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY as string, {
        expiresIn: '30d'  // 1 day expiration time
    })
    return token
}

//set Cookie with JWT token
export function setCookie(jwtPayload: JWTPayload): string {
    const token = generateJwt(jwtPayload)
    const cookie = serialize("jwtToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 30
    })
    return cookie
}