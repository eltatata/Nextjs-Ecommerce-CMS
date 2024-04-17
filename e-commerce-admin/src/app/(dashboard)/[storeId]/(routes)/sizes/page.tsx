import prisma from '@/lib/prismadb'

import { format } from "date-fns"

import SizesClient from './components/client'
import { SizeColumn } from './components/columns';

export default async function SizesPage({ params }: { params: { storeId: string } }) {
  const sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => (
    {
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: format(item.createdAt, "MMMM do, yyyy")
    }
  ))

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  )
}
