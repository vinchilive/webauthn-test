import type { Express } from 'express'
import { LoggedInUser } from '../server'
import { authenticateUser } from './helpers'

export default (app: Express, db: LoggedInUser[]) => {
  app.get('/user', async (req, res, next) => {
    const userId = await authenticateUser(req)
    const user = db.find((u) => u.id === userId)

    if (!userId || !user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    res.send(user)
  })
}
