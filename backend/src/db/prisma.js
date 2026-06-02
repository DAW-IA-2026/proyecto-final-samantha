import { PrismaClient } from '@prisma/client'
import { ulid } from 'ulid'

let prisma = null

export function getPrisma() {
  if (!prisma) {
    // 1. Creamos la instancia base
    const basePrisma = new PrismaClient()

    // 2. La extendemos y guardamos el resultado en nuestra variable 'prisma'
    prisma = basePrisma.$extends({
      query: {
        $allModels: {
          async create({ model, args, query }) {
            const modelsWithId = ['User', 'Category', 'Tag', 'Game']
            
            // Si el modelo está en la lista y no viene un ID, lo generamos
            if (modelsWithId.includes(model) && args.data && !args.data.id) {
              args.data.id = ulid()
            }
            
            return query(args)
          },
          async createMany({ model, args, query }) {
            const modelsWithId = ['User', 'Category', 'Tag', 'Game']
            
            // Añadimos soporte para createMany por si acaso
            if (modelsWithId.includes(model) && args.data) {
              if (Array.isArray(args.data)) {
                args.data.forEach(item => {
                  if (!item.id) item.id = ulid()
                })
              } else if (!args.data.id) {
                args.data.id = ulid()
              }
            }
            
            return query(args)
          }
        }
      }
    })
  }
  return prisma
}

export default getPrisma()