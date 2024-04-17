"use client";

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Size } from "@prisma/client";

import { Trash } from "lucide-react";

import Heading from "@/components/ui/heading";
import ImageUpload from "@/components/ui/images-upload";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";


interface SizeFormProps {
  initialData: Size | null;
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;

export default function SizeForm({ initialData }: SizeFormProps) {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit size" : "Create size";
  const toastMesage = initialData ? "Size updated" : "Size created";
  const action = initialData ? "Save changes" : "Create";


  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: ""
    }
  });

  const onSubmit = async (values: SizeFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, values);
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, values);
      }

      router.push(`/${params.storeId}/sizes`)
      router.refresh();
      toast.success(toastMesage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.push(`/${params.storeId}/sizes`);
      router.refresh();
      toast.success('Size deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all products using this size first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash
              className="h-4 w-4"
            />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Size name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Size value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading}
            type="submit"
            className="ml-auto"
          >
            {action}
          </Button>
        </form>
      </Form>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
    </>
  )
}
