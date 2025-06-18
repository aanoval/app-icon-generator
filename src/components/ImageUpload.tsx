
import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    }
  }, [onImageUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    }
  }, [onImageUpload]);

  return (
    <div className="text-center">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-slate-300 hover:border-slate-400 bg-slate-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            dragActive ? 'bg-blue-100' : 'bg-slate-200'
          }`}>
            {dragActive ? (
              <Upload className="h-8 w-8 text-blue-600" />
            ) : (
              <ImageIcon className="h-8 w-8 text-slate-600" />
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {dragActive ? 'Drop your image here' : 'Upload your app icon'}
            </h3>
            <p className="text-slate-600 mb-4">
              Drag and drop your image or click to browse
            </p>
            <p className="text-sm text-slate-500">
              Supports PNG and JPG • Best results with square images (1:1 ratio) • 512px+ recommended
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
