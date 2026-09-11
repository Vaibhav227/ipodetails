import type { LoaderFunction } from 'react-router'

export const loader: LoaderFunction = async () => {
  const apiKey = process.env.IPO_ALERTS_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'Missing IPO Alerts configuration' }, { status: 500 })
  }

  try {
    const response = await fetch('https://api.ipoalerts.in/ipos?status=closed', {
      headers: {
        'x-api-key': apiKey,
      },
    })

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch closed IPOs' }, { status: response.status })
    }

    return Response.json(await response.json())
  } catch (error) {
    console.error('Failed to fetch closed IPOs:', error)
    return Response.json({ error: 'Failed to fetch closed IPOs' }, { status: 500 })
  }
}
