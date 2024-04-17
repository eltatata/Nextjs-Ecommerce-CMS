import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
import { Console } from "console";

export async function GET(req: NextRequest, { params }: { params: { storeId: string } }) {
  try {
    const storeId = params.storeId
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });

    const categories = await prismadb.category.findMany({
      where: {
        storeId
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function POST(req: NextRequest, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const storeId = params.storeId;
    const { name, billboardId } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("name is required", { status: 400 });
    if (!billboardId) return new NextResponse("billboard id is required", { status: 400 });
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
    if (!storeByUserId) return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};