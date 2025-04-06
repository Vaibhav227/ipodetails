import { PrismaClient } from '@prisma/client'
import type { LoaderFunction } from 'react-router'

// Initialize Prisma client
const prisma = new PrismaClient()

export const loader: LoaderFunction = async () => {
  try {
    const ipos = await prisma.iPO.findMany({
      orderBy: { lastUpdated: 'desc' },
    })
    return Response.json(ipos)
  } catch (error) {
    console.error('Failed to fetch IPOs:', error)
    return Response.json({ error: 'Failed to fetch IPOs' }, { status: 500 })
  }
}
