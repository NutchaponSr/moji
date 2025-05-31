"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import { 
  FileMetadata,
  FileUploadAction, 
  FileUploadOptions, 
  FileUploadState, 
  FileWithPreview
} from "@/types/file";
import { formatBytes } from "@/lib/utils";

export const useFileUpload = (options: FileUploadOptions = {}): [FileUploadState, FileUploadAction] => {
  const {
    maxFiles = Infinity,
    maxSize = Infinity,
    accept = "",
    multiple = false,
    initialFiles = [],
    enableEdgeStoreUpload = false,
    edgeStore,
    edgeStoreUploader,
    onFilesChange,
    onFilesAdded,
  } = options;

  const [state, setState] = useState<FileUploadState>({
    files: initialFiles.map((file) => ({
      file,
      id: file.id,
      preview: file.url,
    })),
    isUploading: false,
    isDragging: false,
    uploadProgress: 0,
    errors: [],
    previousFileUrl: "",
  });

  const inputRef= useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File | FileMetadata): string | null => {
    if (file instanceof File) {
      if (file.size > maxSize) {
        return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`
      }
    } else {
      if (file.size > maxSize) {
        return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`
      }
    }


    if (accept !== "*") {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const fileType = file instanceof File ? file.type || "" : file.type;
      const fileExtension = `.${file instanceof File ? file.name.split(".").pop() : file.name.split(".").pop()}`;

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return fileExtension.toLowerCase() === type.toLowerCase();
        }

        if (type.endsWith("/*")) {
          const baseType = type.split("/")[0];
          return fileType.startsWith(`${baseType}/`);
        }

        return fileType === type;
      });

      if (!isAccepted) {
        return `File "${file instanceof File ? file.name : file.name}" is not an accepted file type.`;
      }
    }

    return null
  }, [accept, maxSize]);

  const createPreview = useCallback((file: File | FileMetadata): string | undefined => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }

    return file.url;
  }, []);

  const generateUniqueId = useCallback((file: File | FileMetadata): string => {
    if (file instanceof File) {
      return `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    return file.id;
  }, []);

  const uploadFile = useCallback(async (id: string) => {
    if (!enableEdgeStoreUpload || !edgeStoreUploader) {
      console.warn("EdgeStore upload not configuared");
      return;
    }

    const fileToUpload = state.files.find((file) => file.id === id);

    if (!fileToUpload || !(fileToUpload.file instanceof File)) {
      return;
    }

    setState((prev) => ({
      ...prev,
      files: prev.files.map((file) => 
        file.id === id
          ? { 
            ...file, 
            uploadStatus: "uploading" as const, 
            uploadProgress: 0,
            error: undefined,
          } 
          : file
      ),
      isUploading: true,
    }));

    try {
      const result = await edgeStoreUploader(fileToUpload.file, {
        onProgress: (progress) => {
          setState((prev) => ({
            ...prev,
            files: prev.files.map((file) => 
              file.id === id
                ? { ...file, uploadProgress: progress }
                : file
            )
          }))
        },
        onSuccess: (uploadResult) => {
          setState((prev) => ({
            ...prev,
            files: prev.files.map((file) => 
              file.id === id
                ? {
                  ...file,
                  uploadStatus: "success" as const,
                  uploadedUrl: uploadResult.url,
                  uploadProgress: 100,
                }
              : file
            )
          }))
        },
        onError: (error) => {
          setState((prev) => ({
            ...prev,
            files: prev.files.map((file) => 
                file.id === id
                  ? {
                    ...file,
                    uploadStatus: "error" as const,
                    uploadProgress: 0,
                    error: error.message
                  }
                : file
            )
          }))
        }
      });

      // Final success state update
      setState((prev) => ({
        ...prev,
        files: prev.files.map((file) => 
          file.id === id
            ? {
              ...file,
              uploadStatus: "success" as const, 
              uploadedUrl: result.url,
              uploadProgress: 100
            }
            : file
        ),
        isUploading: prev.files.some((file) => file.id !== id && file.uploadStatus === "uploading"),
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        files: prev.files.map((file) => 
          file.id === id
            ? {
              ...file,
              uploadStatus: "error" as const,
              error: error instanceof Error ? error.message : "Upload failed",
              uploadProgress: 0,
            }
            : file
        ),
        isUploading: prev.files.some((file) => file.id !== id && file.uploadStatus === "uploading"),
      }))
    }
  }, [state.files, enableEdgeStoreUpload, edgeStoreUploader]);

  const uploadFileAll = useCallback(async () => {
    if (!enableEdgeStoreUpload || !edgeStoreUploader) {
      console.warn("EdgeStore upload not configuared");
      return;
    }

    const filesToUpload = state.files.filter((file) => 
      file.file instanceof File && (file.uploadStatus === "idle" || file.uploadStatus === "error" || !file.uploadStatus)
    );

    // Upload files sequentially to avoid overwhelming the server
    for (const file of filesToUpload) {
      await uploadFile(file.id)
    }
  }, [state.files, uploadFile, enableEdgeStoreUpload, edgeStoreUploader]);

  const clearFiles = useCallback(() => {
    setState((prev) => {
      // Clean up object URLs
      prev.files.forEach((file) => {
        if (
          file.preview && 
          file.file instanceof File &&
          file.file.type.startsWith("image/")
        ) {
          URL.revokeObjectURL(file.preview);
        }
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      const newState = {
        ...prev,
        files: [],
        errors: [],
      }

      onFilesChange?.(newState.files);
      return newState;
    });
  }, [onFilesChange]);

  const addFiles = useCallback((newFile: FileList | File[]) => {
    if (!newFile || newFile.length === 0) return;

    const newFileArray = Array.from(newFile);
    const errors: string[] = [];

    // Clear existing errors when new files are uploaded
    setState((prev) => ({ ...prev, errors: [] }));

    // In single file mode, clear existing files first
    if (!multiple) clearFiles();

    // Check if adding these files would exceed maxFiles (only in multiple mode)
    if (multiple && maxFiles !== Infinity && state.files.length + newFileArray.length > maxFiles) {
      errors.push(`You can only upload a maximum of ${maxFiles} files.`);
      setState((prev) => ({ ...prev, errors }));
      return;
    }

    const validFiles: FileWithPreview[] = [];

    newFileArray.forEach((file) =>  {
      // Only check for duplicates if multiple files are allowed
      if (multiple) {
        const isDuplicate = state.files.some(
          (existingFile) =>
            existingFile.file.name === file.name &&
            existingFile.file.size === file.size
        );

        // Skip duplicate files silently
        if (isDuplicate) {
          return;
        }
      }

      // Check file size
      if (file.size > maxSize) {
        errors.push(
          multiple
            ? `Some files exceed the maximum size of ${formatBytes(maxSize)}.`
            : `File exceed the maximum size of ${formatBytes(maxSize)}.`
        );

        return;
      }

      const error = validateFile(file);

      if (error) {
        errors.push(error);
      } else {
        validFiles.push({
          file,
          id: generateUniqueId(file),
          preview: createPreview(file),
        });
      }
    });

    // Only update state if we have valid files to add
    if (validFiles.length > 0) {
      // Call the onFilesAdded callback with the newly added valid files
      onFilesAdded?.(validFiles);

      setState((prev) => {
        const newFiles = !multiple
          ? validFiles
          : [...prev.files, ...validFiles]

        onFilesChange?.(newFiles);

        return {
          ...prev,
          files: newFiles,
          errors,
        };
      });
    } else if (errors.length > 0) {
      setState((prev) => ({
        ...prev,
        errors,
      }));
    }

    // Reset input value after handling files
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [
    state.files,
    maxFiles,
    multiple,
    maxSize,
    validateFile,
    createPreview,
    generateUniqueId,
    clearFiles,
    onFilesChange,
    onFilesAdded,
  ]);

  const removeFile = useCallback((id: string) => {
    setState((prev) => {
      const fileToRemove = prev.files.find((file) => file.id === id);

      if (
        fileToRemove &&
        fileToRemove.preview &&
        fileToRemove.file instanceof File && 
        fileToRemove.file.type.startsWith("image/")
      ) { 
        URL.revokeObjectURL(fileToRemove.preview);
      }

      const newFiles = prev.files.filter((file) => file.id !== id);

      onFilesChange?.(newFiles);

      return {
        ...prev,
        files: newFiles,
        errors: [],
      };
    });
  }, [onFilesChange]);

  const clearErrors = useCallback(() => {
    setState((prev) => ({
      ...prev,
      errors: [],
    }))
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setState((prev) => ({ ...prev, isDragging: false }));

    // Don't process files if the input is disabled
    if (inputRef.current?.disabled) {
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // In single file mode, only use the first file
      if (!multiple) {
        const file = e.dataTransfer.files[0];
        addFiles([file]);
      } else {
        addFiles(e.dataTransfer.files);
      }
    }
  }, [addFiles, multiple]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  }, [addFiles]);

  const openFileDialog = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const getInputProps = useCallback(
    (props: React.InputHTMLAttributes<HTMLInputElement> = {}) => {
      return {
        ...props,
        type: "file" as const,
        onChange: handleFileChange,
        accept: props.accept || accept,
        multiple: props.multiple !== undefined ? props.multiple : multiple,
        ref: inputRef,
      }
    },
    [accept, multiple, handleFileChange]
  )

  const deleteFile = useCallback(
    async (urlToDelete: string) => {
      if (!urlToDelete || !edgeStore?.publicImages) {
        console.warn("EdgeStore not configured or invalid URL");
        return;
      }
      try {
        await edgeStore.publicImages.delete({ url: urlToDelete });
      } catch (error) {
        console.error("Failed to delete file:", error);
        setState((prev) => ({
          ...prev,
          errors: [...prev.errors, `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`],
        }));
      }
    },
    [edgeStore?.publicImages],
  );

  const setPreviousFileUrl = useCallback((url: string) => {
    setState((prev) => ({
      ...prev,
      previousFileUrl: url,
    }));
  }, []);

  const clearPreviousFileUrl = useCallback(() => {
    setState((prev) => ({
      ...prev,
      previousFileUrl: "",
    }));
  }, []);

  const removeAndDeleteFile = useCallback(async (id: string) => {
    const fileToRemove = state.files.find((file) => file.id === id);
    
    if (!fileToRemove) return;

    if (fileToRemove.uploadedUrl) {
      try {
        await deleteFile(fileToRemove.uploadedUrl);
      } catch (error) {
        console.error("Failed to delete file:", error);
        setState((prev) => ({
          ...prev,
          errors: [...prev.errors, `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`],
        }));
      }
    }

    removeFile(id);
    clearPreviousFileUrl();
  }, [state.files, deleteFile, removeFile, clearPreviousFileUrl]);

  return [
    state,
    {
      addFiles,
      removeFile,
      deleteFile,
      removeAndDeleteFile,
      clearFiles,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      uploadFile,
      uploadFileAll,
      openFileDialog,
      getInputProps,
      setPreviousFileUrl,
      clearPreviousFileUrl,
    },
  ];
}