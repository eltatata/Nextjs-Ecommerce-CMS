import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
  req: NextRequest,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("sizeId id is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId
      }
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log('[SIZE_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { sizeId: string, storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const storeId = params.storeId;
    const sizeId = params.sizeId
    const { name, value } = body;

    const sizeExist = await prismadb.size .findUnique({
      where: {
        id: sizeId
      }
    });
    if (!sizeExist) return NextResponse.json({ msg: "Size not found" }, { status: 404 });

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!value) return new NextResponse("value url is required", { status: 400 });
    if (!sizeId) return new NextResponse("size id id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
    if (!storeByUserId) return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });

    const size = await prismadb.size.updateMany({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value
      }
    })

    return NextResponse.json(size);
  } catch (error) {
    console.log('[SIZE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: { sizeId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const storeId = params.storeId;
    const sizeId = params.sizeId

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });
    if (!sizeId) return new NextResponse("size id id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
    if (!storeByUserId) return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });

    const sizeExist = await prismadb.size.findUnique({
      where: {
        id: sizeId
      }
    });
    if (!sizeExist) return NextResponse.json({ msg: "Size not found" }, { status: 404 });

    const size = await prismadb.size.delete({
      where: {
        id: params.sizeId,
      }
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log('[SIZE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}