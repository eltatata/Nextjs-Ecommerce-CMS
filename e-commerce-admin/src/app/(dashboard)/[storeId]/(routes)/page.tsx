import prisma from '@/lib/prismadb';

interface DashboardPageProps {
  params: { storeId: string }
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId
    }
  })

  return (
    <>
      <div>DashboardPage</div>
      <p>{store?.name}</p>
    </>
  )
}