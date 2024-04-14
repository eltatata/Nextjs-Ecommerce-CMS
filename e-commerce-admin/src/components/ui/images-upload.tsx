"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

import { ImagePlus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
  disable?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value?: string[];

}

export default function ImageUpload({
  disable,
  onChange,
  onRemove,
  value
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value?.map((url) => (
          <div key={url} className="relative w-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                size="icon"
                onClick={() => onRemove(url)}
                variant="destructive"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Image
              width={500}
              height={500}
              className="object-cover"
              alt="image"
              src={url}
            />
          </div>
        ))}
      </div>
      <CldUploadWidget
        onUpload={onUpload}
        uploadPreset="umav1rfo"
      >
        {({ open }) => {
          const onClick = () => {
            open();
          }

          return (
            <Button
              type="button"
              disabled={disable}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div >
  )
}
