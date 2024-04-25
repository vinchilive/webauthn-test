import type { Express } from 'express'
import { LoggedInUser } from '../server'
import { clearAuthCookie } from './helpers'

export default (app: Express, db: LoggedInUser[]) => {
  app.post('/logout', async (req, res, next) => {
    await clearAuthCookie(res)
    res.send({ message: 'success' })
  })
}
