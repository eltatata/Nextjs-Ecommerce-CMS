import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
  req: NextRequest,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId
      }
    });
  
    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { billboardId: string, storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const storeId = params.storeId;
    const billboardId = params.billboardId
    const { label, imageUrl } = body;

    const billboardExist = await prismadb.billboard.findUnique({
      where: {
        id: billboardId
      }
    });
    if (!billboardExist) return NextResponse.json({ msg: "Billboard not found" }, { status: 404 });

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!label) return new NextResponse("Label is required", { status: 400 });
    if (!imageUrl) return new NextResponse("Image url is required", { status: 400 });
    if (!billboardId) return new NextResponse("billboard id id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
    if (!storeByUserId) return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: billboardId,
      },
      data: {
        label,
        imageUrl
      }
    })

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: { billboardId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const storeId = params.storeId;
    const billboardId = params.billboardId

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });
    if (!billboardId) return new NextResponse("billboard id id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
    if (!storeByUserId) return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });

    const billboardExist = await prismadb.billboard.findUnique({
      where: {
        id: billboardId
      }
    });
    if (!billboardExist) return NextResponse.json({ msg: "Billboard not found" }, { status: 404 });

    const billboard = await prismadb.billboard.delete({
      where: {
        id: params.billboardId,
      }
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}