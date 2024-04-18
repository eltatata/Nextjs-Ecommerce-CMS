import prisma from '@/lib/prismadb'

import { format } from "date-fns"

import ColorsClient from './components/client'
import { ColorColumn } from './components/columns';

export default async function ColorsPage({ params }: { params: { storeId: string } }) {
  const colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedColors: ColorColumn[] = colors.map((item) => (
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
        <ColorsClient data={formattedColors} />
      </div>
    </div>
  )
}
