"use client";

import { Plus } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';

import { BillboardColumn, columns } from './columns';

import ApiList from '@/components/ui/api-list';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';

interface BillboardClientProps {
  data: BillboardColumn[]
}

export default function BillboardClient({ data }: BillboardClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Billboard (${data.length})`}
          description='Manage billboards for your store'
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className='h-4 w-4 mr-2' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='label' />
      <Heading
        title="API"
        description='API calls for billboards'
      />
      <Separator />
      <ApiList
        entityName='billboards'
        entityIdName='billboardId'
      />
    </>
  )
}
