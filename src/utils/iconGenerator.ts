
import { createIconsZip } from './zipGenerator';

// Icon size definitions for each platform
const iconSizes = {
  android: [
    { name: 'mdpi', size: 48, folder: 'mipmap-mdpi' },
    { name: 'hdpi', size: 72, folder: 'mipmap-hdpi' },
    { name: 'xhdpi', size: 96, folder: 'mipmap-xhdpi' },
    { name: 'xxhdpi', size: 144, folder: 'mipmap-xxhdpi' },
    { name: 'xxxhdpi', size: 192, folder: 'mipmap-xxxhdpi' },
  ],
  ios: [
    { name: 'Icon-20', size: 20 },
    { name: 'Icon-29', size: 29 },
    { name: 'Icon-40', size: 40 },
    { name: 'Icon-58', size: 58 },
    { name: 'Icon-60', size: 60 },
    { name: 'Icon-76', size: 76 },
    { name: 'Icon-80', size: 80 },
    { name: 'Icon-87', size: 87 },
    { name: 'Icon-120', size: 120 },
    { name: 'Icon-152', size: 152 },
    { name: 'Icon-167', size: 167 },
    { name: 'Icon-180', size: 180 },
    { name: 'Icon-512', size: 512 },
    { name: 'Icon-1024', size: 1024 },
  ],
  macos: [
    { name: 'icon_16x16', size: 16 },
    { name: 'icon_32x32', size: 32 },
    { name: 'icon_64x64', size: 64 },
    { name: 'icon_128x128', size: 128 },
    { name: 'icon_256x256', size: 256 },
    { name: 'icon_512x512', size: 512 },
    { name: 'icon_1024x1024', size: 1024 },
  ],
};

export const generateIcons = async (file: File): Promise<{ [key: string]: string }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const icons: { [key: string]: string } = {};

      // Generate Android icons
      iconSizes.android.forEach(({ name, size }) => {
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        icons[`android-${size}`] = canvas.toDataURL('image/png');
      });

      // Generate iOS icons
      iconSizes.ios.forEach(({ name, size }) => {
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        icons[`ios-${size}`] = canvas.toDataURL('image/png');
      });

      // Generate macOS icons
      iconSizes.macos.forEach(({ name, size }) => {
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        icons[`macos-${size}`] = canvas.toDataURL('image/png');
      });

      resolve(icons);
    };
    img.src = URL.createObjectURL(file);
  });
};

export const downloadIconsAsZip = async (icons: { [key: string]: string }) => {
  try {
    const zipBlob = await createIconsZip(icons);
    
    // Create download link
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'app-icons.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    throw error;
  }
};
