import { compare } from 'bcryptjs'
import type { Express } from 'express'
import { LoggedInUser } from '../server'
import { authenticateUser, setAuthCookie } from './helpers'

export default (app: Express, db: LoggedInUser[]) => {
  app.post('/login', async (req, res, next) => {
    const userId = await authenticateUser(req)
    let user = db.find((u) => u.id === userId)

    if (user) {
      res.send(user)
    }

    const { email, password } = req.body

    user = db.find((u) => u.email === email)

    const valid = await compare(password, user?.password ?? '')

    if (!user || !valid) {
      return res.status(401).send(new Error('Unauthorized'))
    }

    await setAuthCookie(res, user.id)
    res.send(user)
  })
}
