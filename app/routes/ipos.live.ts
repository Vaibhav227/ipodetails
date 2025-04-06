import { PrismaClient } from '@prisma/client'
import type { LoaderFunction } from 'react-router'

// Initialize Prisma client
const prisma = new PrismaClient()

export const loader: LoaderFunction = async () => {
  try {
    const liveIpos = await prisma.iPO.findMany({
      where: {
        status: {
          contains: 'live',
          mode: 'insensitive',
        },
      },
    })
    return Response.json(liveIpos)
  } catch (error) {
    console.error('Failed to fetch live IPOs:', error)
    return Response.json({ error: 'Failed to fetch live IPOs' }, { status: 500 })
  }
}
