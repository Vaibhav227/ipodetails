import type { ActionFunction } from 'react-router'
import { createClient, type RedisClientType } from 'redis'

let redisClient: RedisClientType | null = null
let redisConnected = false

async function ensureRedisConnection() {
  if (!redisClient) {
    const redisHost = process.env.REDIS_HOST
    const redisPort = Number(process.env.REDIS_PORT)
    const redisPassword = process.env.REDIS_PASSWORD

    if (!redisHost || !redisPort || !redisPassword) {
      throw new Error('Missing Redis configuration')
    }

    redisClient = createClient({
      username: process.env.REDIS_USERNAME ?? 'default',
      password: redisPassword,
      socket: {
        host: redisHost,
        port: redisPort,
      },
    })
  }

  if (!redisConnected) {
    await redisClient.connect().catch(console.error)
    redisConnected = true
  }
}

async function run(model: string, input: Record<string, any>) {
  const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN

  if (!cloudflareAccountId || !cloudflareApiToken) {
    throw new Error('Missing Cloudflare AI configuration')
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/ai/run/${model}`,
    {
      headers: { Authorization: `Bearer ${cloudflareApiToken}` },
      method: 'POST',
      body: JSON.stringify(input),
    },
  )

  const result = await response.json()
  return result
}

export const action: ActionFunction = async ({ request }) => {
  try {
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
    const cachedResult = await redisClient?.get(cacheKey)

    if (cachedResult) {
      // Return cached result if available
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

    // Cache the result for future requests (expire after 1 day)
    await redisClient?.set(cacheKey, JSON.stringify(response), { EX: 86400 }) // EX is in seconds, not milliseconds

    return Response.json(response)
  } catch (error) {
    console.error('Error in summarize-ai endpoint:', error)
    return Response.json({ error: 'Failed to summarize article' }, { status: 500 })
  }
}
