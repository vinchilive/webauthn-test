import type { Express } from 'express'
import { LoggedInUser } from '../server'
import { authenticateUser, setAuthCookie } from './helpers'
import {
  GenerateAuthenticationOptionsOpts,
  GenerateRegistrationOptionsOpts,
  VerifiedAuthenticationResponse,
  VerifiedRegistrationResponse,
  VerifyAuthenticationResponseOpts,
  VerifyRegistrationResponseOpts,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'
import {
  AuthenticationResponseJSON,
  AuthenticatorDevice,
  RegistrationResponseJSON,
} from '@simplewebauthn/types'

export default (app: Express, db: LoggedInUser[]) => {
  const rpID = 'localhost'
  const expectedOrigin = `https://${rpID}:3000`

  /**
   * Registration
   */
  app.get('/generate-registration-options', async (req, res) => {
    const userId = await authenticateUser(req)
    const user = db.find((u) => u.id === userId)

    if (!userId || !user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const {
      /**
       * The username can be a human-readable name, email, etc... as it is intended only for display.
       */
      email: userName,
      devices,
    } = user

    const opts: GenerateRegistrationOptionsOpts = {
      rpName: 'SimpleWebAuthn Example',
      rpID,
      userName,
      timeout: 60000,
      /**
       * https://simplewebauthn.dev/docs/packages/server#1a-supported-attestation-formats
       */
      attestationType: 'none',
      /**
       * Passing in a user's list of already-registered authenticator IDs here prevents users from
       * registering the same device multiple times. The authenticator will simply throw an error in
       * the browser if it's asked to perform registration when one of these ID's already resides
       * on it.
       */
      excludeCredentials: devices.map((dev) => ({
        id: dev.credentialID,
        type: 'public-key',
        transports: dev.transports,
      })),
      authenticatorSelection: {
        /**
         * https://simplewebauthn.dev/docs/packages/server#1-generate-registration-options
         */
        residentKey: 'discouraged',
        /**
         * https://passkeys.dev/docs/use-cases/bootstrapping/#a-note-about-user-verification
         */
        userVerification: 'preferred',
      },
      /**
       * Support the two most common algorithms: ES256, and RS256
       */
      supportedAlgorithmIDs: [-7, -257],
    }

    const options = await generateRegistrationOptions(opts)

    /**
     * The server needs to temporarily remember this value for verification, so don't lose it until
     * after you verify an authenticator response.
     */
    user.currentChallenge = options.challenge

    res.send(options)
  })

  app.post('/verify-registration', async (req, res) => {
    const userId = await authenticateUser(req)
    const user = db.find((u) => u.id === userId)

    if (!userId || !user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const body: RegistrationResponseJSON = req.body
    const expectedChallenge = user.currentChallenge

    let verification: VerifiedRegistrationResponse
    try {
      const opts: VerifyRegistrationResponseOpts = {
        response: body,
        expectedChallenge: `${expectedChallenge}`,
        expectedOrigin,
        expectedRPID: rpID,
        /**
         * Enforce user verification by the authenticator (via PIN, fingerprint, etc...)
         */
        requireUserVerification: false,
      }
      verification = await verifyRegistrationResponse(opts)
    } catch (error: any) {
      console.error(error)
      return res.status(400).send({ error: error.message })
    }

    const { verified, registrationInfo } = verification

    if (verified && registrationInfo) {
      const { credentialPublicKey, credentialID, counter } = registrationInfo

      const existingDevice = user.devices.find(
        (device) => device.credentialID === credentialID
      )

      if (!existingDevice) {
        /**
         * Add the returned device to the user's list of devices
         */
        const newDevice: AuthenticatorDevice = {
          credentialPublicKey,
          credentialID,
          counter,
          transports: body.response.transports,
        }
        user.devices.push(newDevice)
      }
    }

    user.currentChallenge = undefined
    res.send(user)
  })

  /**
   * Authentication
   */
  app.post('/generate-authentication-options', async (req, res) => {
    const userId = await authenticateUser(req)
    let user = db.find((u) => u.id === userId)

    if (user) {
      return res.json({ message: 'Already authorized' })
    }

    const { email } = req.body

    user = db.find((u) => u.email === email)

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const opts: GenerateAuthenticationOptionsOpts = {
      timeout: 60000,
      allowCredentials: user.devices.map((dev) => ({
        id: dev.credentialID,
        type: 'public-key',
        transports: dev.transports,
      })),
      /**
       * https://passkeys.dev/docs/use-cases/bootstrapping/#a-note-about-user-verification
       */
      userVerification: 'preferred',
      rpID,
    }

    const options = await generateAuthenticationOptions(opts)

    /**
     * The server needs to temporarily remember this value for verification, so don't lose it until
     * after you verify an authenticator response.
     */
    user.currentChallenge = options.challenge

    res.send(options)
  })

  app.post('/verify-authentication', async (req, res) => {
    const userId = await authenticateUser(req)
    let user = db.find((u) => u.id === userId)

    if (user) {
      return res.json({ message: 'Already authorized' })
    }

    const body: AuthenticationResponseJSON = req.body

    user = db.find((u) => u.devices.some((d) => d.credentialID === body.id))

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const expectedChallenge = user.currentChallenge

    let dbAuthenticator
    // "Query the DB" here for an authenticator matching `credentialID`
    for (const dev of user.devices) {
      if (dev.credentialID === body.id) {
        dbAuthenticator = dev
        break
      }
    }

    if (!dbAuthenticator) {
      return res.status(400).send({
        error: 'Authenticator is not registered with this site',
      })
    }

    let verification: VerifiedAuthenticationResponse
    try {
      const opts: VerifyAuthenticationResponseOpts = {
        response: body,
        expectedChallenge: `${expectedChallenge}`,
        expectedOrigin,
        expectedRPID: rpID,
        authenticator: dbAuthenticator,
        /**
         * Enforce user verification by the authenticator (via PIN, fingerprint, etc...)
         */
        requireUserVerification: false,
      }
      verification = await verifyAuthenticationResponse(opts)
    } catch (error: any) {
      console.error(error)
      return res.status(400).send({ error: error.message })
    }

    const { verified, authenticationInfo } = verification

    if (verified) {
      // Update the authenticator's counter in the DB to the newest count in the authentication
      dbAuthenticator.counter = authenticationInfo.newCounter
    }

    user.currentChallenge = undefined

    await setAuthCookie(res, user.id)
    res.send(user)
  })
}
