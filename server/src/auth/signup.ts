import { compare, hash } from 'bcryptjs'
import type { Express } from 'express'
import { LoggedInUser } from '../server'
import { v4 as uuidv4 } from 'uuid'
import { authenticateUser, setAuthCookie } from './helpers'

export default (app: Express, db: LoggedInUser[]) => {
  app.post('/signup', async (req, res, next) => {
    const userId = await authenticateUser(req)
    let user = db.find((u) => u.id === userId)

    if (user) {
      res.send(user)
    }

    const { email, password } = req.body

    user = db.find((u) => u.email === email)

    const valid = await compare(password, user?.password ?? '')

    if (user) {
      if (!valid) {
        res.status(401).send(new Error('Unauthorized'))
        return
      } else {
        await setAuthCookie(res, user.id)
        res.send(user)
        return
      }
    }

    const hashedPassword = await hash(password, 10)
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      devices: [],
    }

    db.push(newUser)
    await setAuthCookie(res, newUser.id)
    res.send(newUser)
  })
}
