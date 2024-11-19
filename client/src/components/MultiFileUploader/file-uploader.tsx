"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface FileWithPreview extends File {
  preview: string;
}
interface MultiFileUplaoderProps {
  onChange: Function;
  setFiles: Function;
  images?: any;
  setImages?: Function;
  files: FileWithPreview[];
}
export default function MultiFileUploader({
  onChange,
  setFiles,
  setImages,
  files,
}: Readonly<MultiFileUplaoderProps>) {
  // const [files, setFiles] = useState<FileWithPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("setting file", files);
    onChange(files);
  }, [files]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log("files", event.target.files);
      const newFiles = Array.from(event.target.files).map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        }),
      );
      setFiles((prevFiles: any) => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (fileToRemove: FileWithPreview) => {
    setFiles(files.filter((file) => file !== fileToRemove));
    setImages && setImages(files.filter((file) => file !== fileToRemove));

    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const newFiles = Array.from(event.dataTransfer.files).map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        }),
      );
      setFiles((prevFiles: any) => [...prevFiles, ...newFiles]);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div
        className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <p>Click to select files or drag and drop here</p>
      </div>
      {files?.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Uploaded Files:</h2>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded bg-gray-100 p-2"
              >
                <div className="flex items-center space-x-2">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={`Preview of ${file.name}`}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-300 text-gray-600">
                      {file.name.split(".").pop()?.toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[200px] truncate text-sm">
                    {file.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFile(file);
                  }}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
