
import { useState } from 'react';
import { Upload, X, FileText, Check } from 'lucide-react';
import { Button } from '../ui/button';

interface FileUploadProps {
  onChange: (file: File | null) => void;
  label: string;
  accept?: string;
  maxSize?: number; // in bytes
}

const FileUpload = ({ 
  onChange, 
  label, 
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png', 
  maxSize = 5 * 1024 * 1024 // 5MB default
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      onChange(null);
      setError(null);
      return;
    }

    if (maxSize && selectedFile.size > maxSize) {
      setError(`File size exceeds maximum limit of ${maxSize / (1024 * 1024)}MB`);
      setFile(null);
      onChange(null);
      return;
    }

    const fileExtension = `.${selectedFile.name.split('.').pop()?.toLowerCase()}`;
    const acceptedTypes = accept.split(',');
    
    if (!acceptedTypes.some(type => 
      type === fileExtension || 
      type === selectedFile.type ||
      type === '*' || 
      type === '.*'
    )) {
      setError(`File type not supported. Accepted types: ${accept}`);
      setFile(null);
      onChange(null);
      return;
    }

    setFile(selectedFile);
    onChange(selectedFile);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0] || null;
    validateAndSetFile(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
    onChange(null);
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="w-10 h-10 text-gray-400" />;
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <img 
        src={URL.createObjectURL(file)} 
        alt="Preview" 
        className="w-10 h-10 object-cover rounded-md" 
      />;
    }
    
    return <FileText className="w-10 h-10 text-maroon" />;
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      {file ? (
        <div className="mt-2 flex items-center p-2 rounded-md bg-gray-50 border border-gray-200">
          <div className="flex-shrink-0">
            {getFileIcon()}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-sm text-gray-500">
              {(file.size / 1024).toFixed(0)} KB
              <Check className="inline-block ml-1 w-4 h-4 text-green-600" />
            </p>
          </div>
          <Button
            variant="ghost" 
            size="sm"
            className="ml-2 text-gray-500 hover:text-red-600"
            onClick={removeFile}
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mt-2 flex justify-center rounded-lg border border-dashed ${isDragging 
            ? 'border-maroon bg-maroon/5' 
            : 'border-gray-300 hover:border-maroon hover:bg-gray-50'
          } px-6 py-8 transition-colors cursor-pointer`}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer font-semibold text-maroon focus-within:outline-none focus-within:ring-2 focus-within:ring-maroon focus-within:ring-offset-2"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept={accept}
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PDF, DOC, DOCX, JPG, JPEG or PNG up to {maxSize / (1024 * 1024)}MB
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
