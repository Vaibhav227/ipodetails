import type { ActionFunction } from 'react-router'
import { createClient } from 'redis'

// Initialize Redis client
const redisClient = createClient({
  username: 'default',
  password: 'wondWhtKEuqZIpJpo2KGCdNRMVEp1kFV',
  socket: {
    host: 'redis-12518.c74.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 12518,
  },
})

// Connect to Redis when needed (lazy initialization)
let redisConnected = false
async function ensureRedisConnection() {
  console.log('ensureRedisConnection')
  if (!redisConnected) {
    await redisClient.connect().catch(console.error)
    redisConnected = true
  }
}

async function run(model: string, input: Record<string, any>) {
  console.log('run')

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/191e8ab48716e9d5cff50c7e40ed52b7/ai/run/${model}`,
    {
      headers: { Authorization: 'Bearer 0MKRLnujI92mEyDcmFKdv4QV92_kxBAd7l2MUzbF' },
      method: 'POST',
      body: JSON.stringify(input),
    },
  )

  console.log('response')
  const result = await response.json()
  return result
}

export const action: ActionFunction = async ({ request }) => {
  try {
    // Ensure method is POST

    console.log('request.method')
    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 })
    }

    // Parse the request body
    const body = await request.json()
    const { link } = body

    if (!link) {
      return Response.json({ error: 'Missing link parameter' }, { status: 400 })
    }

    // Ensure Redis connection
    await ensureRedisConnection()

    // Generate a cache key from the link
    const cacheKey = `summarize:${link}`

    // Check if we have a cached result
    const cachedResult = await redisClient.get(cacheKey)

    if (cachedResult) {
      // Return cached result if available
      console.log('Using cached result for', link)
      return Response.json(JSON.parse(cachedResult))
    }

    // Make the AI request if not cached
    const response = await run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: 'You are a finance expert that helps summarize finance articles',
        },
        {
          role: 'user',
          content: `Summarize the following article: ${link} . Make it crisp`,
        },
      ],
    })

    console.log('AI credits used for', link)

    // Cache the result for future requests (expire after 1 day)
    await redisClient.set(cacheKey, JSON.stringify(response), { EX: 86400 }) // EX is in seconds, not milliseconds

    return Response.json(response)
  } catch (error) {
    console.error('Error in summarize-ai endpoint:', error)
    return Response.json({ error: 'Failed to summarize article' }, { status: 500 })
  }
}
