import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(req: NextRequest, { params }: { params: { storeId: string } }) {
  try {
    const storeId = params.storeId
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId
      }
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log('[BILLBOARDS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function POST(req: NextRequest, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const storeId = params.storeId;
    const { label, imageUrl } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!label) return new NextResponse("Label is required", { status: 400 });
    if (!imageUrl) return new NextResponse("Image url is required", { status: 400 });
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
    if (!storeByUserId) return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId
      }
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARDS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};