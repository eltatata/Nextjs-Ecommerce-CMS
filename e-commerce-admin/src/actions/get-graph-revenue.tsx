import prismadb from "@/lib/prismadb";


interface GraphData {
  name: string
  total: number
}

export async function getGraphRevenue(storeId: string) {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId: storeId,
      isPaid: true
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  })

  const monthlyRevenue: { [key: number]: number } = {}

  paidOrders.forEach((paidOrder) => {
    const month = paidOrder.createdAt.getMonth()
    const orderRevenue = paidOrder.orderItems.reduce((acc, orderItem) => {
      return acc + orderItem.product.price.toNumber()
    }, 0)

    const currentMonthRevenue = monthlyRevenue[month] ?? 0
    monthlyRevenue[month] = currentMonthRevenue + orderRevenue
  })

  const graphData: GraphData[] = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
    { name: 'Jul', total: 0 },
    { name: 'Aug', total: 0 },
    { name: 'Sep', total: 0 },
    { name: 'Oct', total: 0 },
    { name: 'Nov', total: 0 },
    { name: 'Dec', total: 0 },
  ]

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)]
  }

  return graphData
}