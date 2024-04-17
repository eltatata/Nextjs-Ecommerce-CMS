"use client";

import { Plus } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';

import { SizeColumn, columns } from './columns';

import ApiList from '@/components/ui/api-list';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';

interface SizesClientProps {
  data: SizeColumn[]
}

export default function SizesClient({ data }: SizesClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Sizes (${data.length})`}
          description='Manage sizes for your store'
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/sizes/new`)}
        >
          <Plus className='h-4 w-4 mr-2' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='name' />
      <Heading
        title="API"
        description='API calls for sizes'
      />
      <Separator />
      <ApiList
        entityName='sizes'
        entityIdName='sizeId'
      />
    </>
  )
}
