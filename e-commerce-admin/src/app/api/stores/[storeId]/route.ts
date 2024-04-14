import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function PATCH(req: NextRequest, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const storeId = params.storeId
    const { name } = body;

    const storeExist = await prismadb.store.findUnique({
      where: {
        id: storeId
      }
    });

    if (!storeExist) return NextResponse.json({ msg: "Store not found" }, { status: 404 });

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });

    const store = await prismadb.store.updateMany({
      where: {
        id: storeId,
        userId
      },
      data: {
        name
      }
    })

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(request: NextRequest, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();

    const storeId = params.storeId

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });

    const storeExist = await prismadb.store.findUnique({
      where: {
        id: storeId
      }
    });

    if (!storeExist) return NextResponse.json({ msg: "Store not found" }, { status: 404 });

    const store = await prismadb.store.deleteMany({
      where: {
        id: storeId,
        userId
      }
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}