import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId
      },
      include: {
        billboard: true
      }
    });
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { categoryId: string, storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const storeId = params.storeId;
    const categoryId = params.categoryId
    const { name, billboardId } = body;

    const categoryExist = await prismadb.category.findUnique({
      where: {
        id: categoryId
      }
    });
    if (!categoryExist) return NextResponse.json({ msg: "Category not found" }, { status: 404 });

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!billboardId) return new NextResponse("billboard id url is required", { status: 400 });
    if (!categoryId) return new NextResponse("category id id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
    if (!storeByUserId) return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });

    const category = await prismadb.category.updateMany({
      where: {
        id: categoryId,
      },
      data: {
        name,
        billboardId
      }
    })

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: { categoryId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const storeId = params.storeId;
    const categoryId = params.categoryId

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });
    if (!categoryId) return new NextResponse("category id id id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
    if (!storeByUserId) return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });

    const categoryExist = await prismadb.category.findUnique({
      where: {
        id: categoryId
      }
    });
    if (!categoryExist) return NextResponse.json({ msg: "Category not found" }, { status: 404 });

    const category = await prismadb.category.delete({
      where: {
        id: params.categoryId,
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}