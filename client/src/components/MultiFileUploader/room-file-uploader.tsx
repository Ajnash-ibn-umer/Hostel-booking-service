import { useRef } from "react";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { Button } from "../ui/button";
interface FileWithPreview extends File {
  preview: string;
}
interface MultiFileUplaoderProps {
  onChange: Function;

  files: FileWithPreview[];
}
export default function RoomMultiFileUploader({
  onChange,
  files,
}: Readonly<MultiFileUplaoderProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        }),
      );
      onChange([...files, ...newFiles]); // Pass updated files to parent
    }
  };

  const removeFile = (fileToRemove: FileWithPreview) => {
    const updatedFiles = files.filter((file: any) => file !== fileToRemove);
    onChange(updatedFiles); // Update parent with filtered files
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div
        className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center"
        onClick={() => fileInputRef.current?.click()}
      >
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
        />
        <p>Click to select files or drag and drop here</p>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Uploaded Files:</h2>

          <ul className="space-y-2">
            {files.map((file: any, index: number) => (
              <li
                key={index}
                className="flex items-center justify-between rounded bg-gray-100 p-2"
              >
                <div key={index} className="flex items-center space-x-2">
                  {file.preview && (
                    <img
                      className="h-10 w-10 rounded object-cover"
                      src={file.preview}
                      alt="Preview"
                    />
                  )}
                  <span className="max-w-[200px] truncate text-sm">
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e: any) => {
                      e.preventDefault();
                      removeFile(file);
                    }}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {/* <button onClick={() => removeFile(file)}>Remove</button> */}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
