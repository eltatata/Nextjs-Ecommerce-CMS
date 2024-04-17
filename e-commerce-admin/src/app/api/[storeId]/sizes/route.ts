import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(req: NextRequest, { params }: { params: { storeId: string } }) {
  try {
    const storeId = params.storeId
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });

    const sizes = await prismadb.size.findMany({
      where: {
        storeId
      }
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log('[SIZES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function POST(req: NextRequest, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const storeId = params.storeId;
    const { name, value } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!value) return new NextResponse("Value url is required", { status: 400 });
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
    if (!storeByUserId) return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });

    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId
      }
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log('[SIZES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};