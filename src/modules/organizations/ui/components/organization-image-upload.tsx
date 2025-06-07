"use client"

import Image from "next/image";

import { useEffect } from "react";
import { UploadIcon, XIcon } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";

import { useEdgeStore } from "@/lib/edgestore";

import { useFileUpload } from "@/hooks/use-file-upload";

import { Button } from "@/components/ui/button";

import { AnimatedCircularProgressBar } from "@/components/animated-circular-progress-bar"

interface OrgImageUploadProps {
  setValue: UseFormSetValue<{ image: string | null; name: string; slug: string }>;
}

export const OrgImageUpload = ({ setValue }: OrgImageUploadProps) => {
  const { edgestore } = useEdgeStore();

  const [
    state,
    { 
      getInputProps, 
      removeAndDeleteFile,
      handleDragEnter, 
      handleDragLeave, 
      handleDragOver, 
      handleDrop, 
      uploadFile, 
      openFileDialog, 
      setPreviousFileUrl
    },
  ] = useFileUpload({
    maxFiles: 1,
    accept: "image/*",
    enableEdgeStoreUpload: true,
    edgeStore: edgestore,
    edgeStoreUploader: async (file, options) => {
      const res = await edgestore.publicImages.upload({ 
        file,
        options: {
          replaceTargetUrl: state.previousFileUrl || undefined
        },
        onProgressChange: (progress) => {
          options?.onProgress?.(progress);
        }
      });

      return {
        url: res.url,
        size: file.size,
        uploadedAt: new Date(),
      }
    },
  });

  const previewUrl = state.files[0]?.preview || null;
  const isUploading = state.isUploading || state.files[0]?.uploadStatus === "uploading";
  const uploadProgress = state.files[0]?.uploadProgress || 0;
  
  const handleRemoveImage = async () => {
    if (state.files.length > 0) {
      const file = state.files[0];
      await removeAndDeleteFile(file.id);
      setValue("image", null);
    }
  }

  useEffect(() => {
    const file = state.files[0];

    if (file?.uploadedUrl) {
      setPreviousFileUrl(file.uploadedUrl);
      setValue("image", file.uploadedUrl);
    }
  }, [state.files, setPreviousFileUrl, setValue]);

  useEffect(() => {
    const file = state.files[0]
    if (!file || state.isUploading) return

    const shouldUpload =
      file.uploadStatus !== "success" && file.uploadStatus !== "uploading" && file.file instanceof File

    if (shouldUpload) {
      uploadFile(file.id)
    }
  }, [state.files, state.isUploading, uploadFile]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex">
        {isUploading ? (
          <AnimatedCircularProgressBar
            max={100}
            min={0}
            value={uploadProgress}
            gaugePrimaryColor="rgb(79 70 229)"
            gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
            className="size-16 text-sm"
          /> 
        ) : (
          <>
            <button
              type="button"
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={state.isDragging || undefined}
              aria-label={previewUrl ? "Change image" : "Upload image"}
              className="border-input bg-accent/50 hover:bg-accent/90 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-16 items-center justify-center overflow-hidden rounded-sm border-2 border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none"
            >
              {previewUrl ? (
                <Image 
                  className="size-full object-cover"
                  src={previewUrl}
                  alt={state.files[0]?.file.name || "Uploaded image"}
                  width={64}
                  height={64}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div aria-hidden="true">
                  <UploadIcon className="size-5 opacity-60 stroke-[1.5]" />
                </div>
              )}
            </button>
            {previewUrl && (
              <Button
                onClick={handleRemoveImage}
                size="icon"
                className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
                aria-label="Remove image"
              >
                <XIcon className="size-3.5" />
              </Button>
            )}
          </>
        )}
        <input 
          {...getInputProps()}
          className="sr-only"
          tabIndex={-1}
        />
      </div>
    </div>
  )
}
