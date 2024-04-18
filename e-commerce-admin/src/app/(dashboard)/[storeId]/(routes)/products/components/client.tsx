"use client";

import { Plus } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';

import { ProductColumn, columns } from './columns';

import ApiList from '@/components/ui/api-list';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';

interface ProductClientProps {
  data: ProductColumn[]
}

export default function ProductClient({ data }: ProductClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Product (${data.length})`}
          description='Manage products for your store'
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/products/new`)}
        >
          <Plus className='h-4 w-4 mr-2' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='name' />
      <Heading
        title="API"
        description='API calls for products'
      />
      <Separator />
      <ApiList
        entityName='products'
        entityIdName='productId'
      />
    </>
  )
}
