import prisma from "@/lib/prismadb"
import CategoryForm from "./components/category-form"

export default async function CategoryPage({ params }:
  { params: { categoryId: string, storeId: string } }
) {
  const category = await prisma.category.findUnique({
    where: {
      id: params.categoryId
    }
  })

  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: params.storeId
    }
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm
          billboards={billboards}
          initialData={category}
        />
      </div>
    </div>
  )
}
