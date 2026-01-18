
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const blogs = await prisma.blog.findMany()
    console.log('Total blogs:', blogs.length)
    blogs.forEach(b => {
        console.log(`Title: ${b.title}, Slug: ${b.slug}, Status: ${b.status}`)
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
