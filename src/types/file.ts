import { InputHTMLAttributes } from "react";

type EdgeStore = {
  publicImages: {
    upload: (options: { file: File; options?: { replaceTargetUrl?: string } }) => Promise<{ url: string }>;
    delete: (options: { url: string }) => Promise<void>;
  }
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  url: string;
  id: string;
}

export interface FileWithPreview {
  file: File | FileMetadata;
  id: string;
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: "idle" | "uploading" | "success" | "error";
  uploadedUrl?: string;
  error?: string;
}

export interface EdgeStoreUploadOptions {
  onProgress?: (progress: number) => void;
  onSuccess?: (result: { url: string; size: number; uploadedAt: Date }) => void;
  onError?: (error: Error) => void;
}

export interface EdgeStoreIntegration {
  enableEdgeStoreUpload?: boolean;
  edgeStoreUploader?: (file: File, options?: EdgeStoreUploadOptions) => Promise<{ url: string; size: number; uploadedAt: Date }>;
  autoUpload?: boolean;
  edgeStore?: EdgeStore;
}

export interface FileUploadOptions extends EdgeStoreIntegration {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  initialFiles?: FileMetadata[];
  onFilesChange?: (files: FileWithPreview[]) => void;
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void;
}

export interface FileUploadState {
  files: FileWithPreview[];
  isDragging: boolean;
  isUploading: boolean;
  uploadProgress: number;
  errors: string[];
  previousFileUrl: string;
}

export interface FileUploadAction {
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
  deleteFile: (url: string) => Promise<void>;
  removeAndDeleteFile: (id: string) => Promise<void>;
  clearFiles: () => void;
  clearErrors: () => void;
  handleDragEnter: (e: React.DragEvent<HTMLElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  openFileDialog: () => void;
  uploadFile: (id: string) => Promise<void>;
  uploadFileAll: () => Promise<void>;
  getInputProps: (props?: InputHTMLAttributes<HTMLInputElement>) => 
    InputHTMLAttributes<HTMLInputElement> & { ref: React.Ref<HTMLInputElement> };
  setPreviousFileUrl: (url: string) => void;
  clearPreviousFileUrl: () => void;
}