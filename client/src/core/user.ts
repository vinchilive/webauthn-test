import { ref } from 'vue'
import { get, post } from './api'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'

const user = ref<{
  email: string
  devices: unknown[]
}>()
const fetching = ref(false)

async function fetchUser() {
  try {
    fetching.value = true

    const response = await get('/user')

    user.value = response

    return user.value
  } catch (e) {
    console.error(e)
  } finally {
    fetching.value = false
  }
}

async function login(payload: { email: string; password: string }) {
  try {
    const response = await post('/login', payload)

    if (response) {
      user.value = response
    }

    return user.value
  } catch (error: any) {
    console.error(error)
  }
}

async function signup(payload: { email: string; password: string }) {
  try {
    const response = await post('/signup', payload)

    if (response) {
      user.value = response
    }

    return user.value
  } catch (error: any) {
    console.error(error)
  }
}

async function logout() {
  try {
    await post('/logout', {})
    user.value = undefined
  } catch (error: any) {
    console.error(error)
  }
}

async function passkeyRegistration() {
  try {
    const response = await get('/generate-registration-options')
    const regResponse = await startRegistration(response)

    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyRegistrationResponse()
    const verificationResp = await post('/verify-registration', regResponse)

    if (verificationResp) {
      user.value = verificationResp
    }

    return user.value
  } catch (error: any) {
    // Some basic error handling
    if (error.name === 'InvalidStateError') {
      console.error(
        'Authenticator was probably already registered by user',
        error
      )
    }

    console.error(error)
  }
}

async function passkeyLogin(payload: { email: string }) {
  try {
    const response = await post('/generate-authentication-options', payload)
    const authResponse = await startAuthentication(response)
    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyAuthenticationResponse()
    const verificationResp = await post('/verify-authentication', authResponse)

    if (verificationResp) {
      user.value = verificationResp
    }

    return user.value
  } catch (error: any) {
    console.error(error)
  }
}

export function useUser() {
  return {
    user,
    fetching,
    fetchUser,
    login,
    signup,
    logout,
    passkeyRegistration,
    passkeyLogin,
  }
}
