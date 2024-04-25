async function parseResponse(response: Response) {
  let parsedResponse

  try {
    parsedResponse = await response.json()
  } catch (jsonParseError) {
    try {
      parsedResponse = await response.text()
    } catch (textParseError) {
      parsedResponse = response
    }
  }

  return parsedResponse
}

export async function get(url: string) {
  const rawResponse = await fetch(`https://localhost:3001${url}`, {
    credentials: 'include',
  })
  const parsedResponse = await parseResponse(rawResponse)

  switch (rawResponse.status) {
    case 200:
      return parsedResponse
    default:
      throw new Error(parsedResponse.message)
  }
}

export async function post(url: string, body: any) {
  const rawResponse = await fetch(`https://localhost:3001${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  const parsedResponse = await parseResponse(rawResponse)

  switch (rawResponse.status) {
    case 200:
      return parsedResponse
    default:
      throw new Error(parsedResponse.message)
  }
}
