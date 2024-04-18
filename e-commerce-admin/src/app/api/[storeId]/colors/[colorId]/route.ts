import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
  req: NextRequest,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("color id id is required", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId
      }
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { colorId: string, storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const storeId = params.storeId;
    const colorId = params.colorId
    const { name, value } = body;

    const colorExist = await prismadb.color.findUnique({
      where: {
        id: colorId
      }
    });
    if (!colorExist) return NextResponse.json({ msg: "Color not found" }, { status: 404 });

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!value) return new NextResponse("value url is required", { status: 400 });
    if (!colorId) return new NextResponse("color id id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
    if (!storeByUserId) return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });

    const color = await prismadb.color.updateMany({
      where: {
        id: colorId,
      },
      data: {
        name,
        value
      }
    })

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: { colorId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const storeId = params.storeId;
    const colorId = params.colorId

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });
    if (!colorId) return new NextResponse("color id id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
    if (!storeByUserId) return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });

    const colorExist = await prismadb.color.findUnique({
      where: {
        id: colorId
      }
    });
    if (!colorExist) return NextResponse.json({ msg: "Color not found" }, { status: 404 });

    const color = await prismadb.color.delete({
      where: {
        id: params.colorId,
      }
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}