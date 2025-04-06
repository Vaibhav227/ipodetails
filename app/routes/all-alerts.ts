import { PrismaClient } from '@prisma/client'
import type { LoaderFunction } from 'react-router'

// Initialize Prisma client
const prisma = new PrismaClient()

export const loader: LoaderFunction = async () => {
  try {
    const alerts = await prisma.alert.findMany({
      where: {
        isActive: true,
      },
    })
    return Response.json(alerts)
  } catch (error) {
    console.error('Failed to fetch alerts:', error)
    return Response.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}
