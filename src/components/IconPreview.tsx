
import React from 'react';

interface IconPreviewProps {
  icons: { [key: string]: string };
}

export const IconPreview: React.FC<IconPreviewProps> = ({ icons }) => {
  // Sample icons to show in preview (we'll show a few representative sizes)
  const previewSizes = [
    { name: 'Android MDPI', key: 'android-48', size: '48px' },
    { name: 'Android XHDPI', key: 'android-96', size: '96px' },
    { name: 'iOS App Store', key: 'ios-1024', size: '1024px' },
    { name: 'iOS iPhone', key: 'ios-60', size: '60px' },
    { name: 'macOS', key: 'macos-512', size: '512px' },
    { name: 'macOS Small', key: 'macos-32', size: '32px' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {previewSizes.map((preview) => (
          <div key={preview.key} className="text-center">
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-2">
              {icons[preview.key] && (
                <img 
                  src={icons[preview.key]} 
                  alt={preview.name}
                  className="w-12 h-12 mx-auto object-contain"
                />
              )}
            </div>
            <div className="text-xs text-slate-600">
              <div className="font-medium">{preview.name}</div>
              <div className="text-slate-500">{preview.size}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <strong className="text-slate-800">Android:</strong> 5 icons (48px - 192px)
          </div>
          <div>
            <strong className="text-slate-800">iOS:</strong> 14 icons (20px - 1024px)
          </div>
          <div>
            <strong className="text-slate-800">macOS:</strong> 10 icons (16px - 1024px)
          </div>
        </div>
      </div>
    </div>
  );
};
