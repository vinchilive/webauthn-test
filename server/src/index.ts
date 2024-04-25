import express, { json } from 'express'
import https from 'https'
import fs from 'fs'
import cors from 'cors'
import corsConfig from './config/cors'
import signup from './auth/signup'
import { LoggedInUser } from './server'
import login from './auth/login'
import logout from './auth/logout'
import user from './auth/user'
import cookieParser from 'cookie-parser'
import { APP_SECRET } from './auth/helpers'
import webathn from './auth/webathn'

const db: LoggedInUser[] = []

async function startServer() {
  const app = express()
  const server = https.createServer(
    {
      key: fs.readFileSync(`ssl/server.key`),
      cert: fs.readFileSync(`ssl/server.crt`),
    },
    app
  )

  app.use(
    cors<cors.CorsRequest>({
      origin: corsConfig.origin,
      credentials: true,
    }),
    json(),
    cookieParser(APP_SECRET)
  )

  signup(app, db)
  login(app, db)
  logout(app, db)
  user(app, db)
  webathn(app, db)

  server.listen({ port: 3001 }, () => {
    console.log(`🚀 Server ready at https://localhost:3001`)
  })
}

startServer()
