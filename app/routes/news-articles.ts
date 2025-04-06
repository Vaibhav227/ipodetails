import { PrismaClient } from '@prisma/client'
import type { LoaderFunction } from 'react-router'

// Initialize Prisma client
const prisma = new PrismaClient()

export const loader: LoaderFunction = async () => {
  try {
    const news = await prisma.iPONews.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return Response.json(news)
  } catch (error) {
    console.error('Failed to fetch IPO news:', error)
    return Response.json({ error: 'Failed to fetch IPO news' }, { status: 400 })
  }
}
