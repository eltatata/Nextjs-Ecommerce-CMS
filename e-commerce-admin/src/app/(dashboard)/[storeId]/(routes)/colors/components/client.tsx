"use client";

import { Plus } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';

import { ColorColumn, columns } from './columns';

import ApiList from '@/components/ui/api-list';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';

interface ColorsClientProps {
  data: ColorColumn[]
}

export default function ColorsClient({ data }: ColorsClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Colors (${data.length})`}
          description='Manage colors for your store'
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/colors/new`)}
        >
          <Plus className='h-4 w-4 mr-2' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='name' />
      <Heading
        title="API"
        description='API calls for colors'
      />
      <Separator />
      <ApiList
        entityName='colors'
        entityIdName='colorId'
      />
    </>
  )
}
