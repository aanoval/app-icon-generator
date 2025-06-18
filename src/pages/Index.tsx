import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Upload, Download, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { IconPreview } from '@/components/IconPreview';
import { generateIcons, downloadIconsAsZip } from '@/utils/iconGenerator';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedIcons, setGeneratedIcons] = useState<{ [key: string]: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSquare, setIsSquare] = useState(true);
  const [isHighRes, setIsHighRes] = useState(true);
  const { toast } = useToast();

  const handleImageUpload = useCallback(async (file: File) => {
    setUploadedImage(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // Check image dimensions
    const img = new Image();
    img.onload = async () => {
      const isSquareImage = img.width === img.height;
      const isHighResImage = img.width >= 512 && img.height >= 512;
      
      setIsSquare(isSquareImage);
      setIsHighRes(isHighResImage);
      
      if (!isSquareImage) {
        toast({
          title: "Image aspect ratio warning",
          description: "For best results, use a square image (1:1 aspect ratio)",
          variant: "default",
        });
      }
      
      if (!isHighResImage) {
        toast({
          title: "Low resolution warning", 
          description: "Image resolution is low. Consider using at least 512x512px for better quality",
          variant: "default",
        });
      }
      
      // Generate icons automatically
      setIsProcessing(true);
      try {
        const icons = await generateIcons(file);
        setGeneratedIcons(icons);
        toast({
          title: "Icons generated successfully!",
          description: "Your app icons are ready for download",
        });
      } catch (error) {
        toast({
          title: "Error generating icons",
          description: "Please try again with a different image",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };
    img.src = previewUrl;
  }, [toast]);

  const handleDownload = async () => {
    if (!uploadedImage || !generatedIcons) return;
    
    try {
      await downloadIconsAsZip(generatedIcons);
      toast({
        title: "Download started",
        description: "Your app icons ZIP file is being downloaded",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>App Icon Generator - Create Icons for Android, iOS, and macOS</title>
        <meta
          name="description"
          content="Easily generate app icons for Android, iOS, and macOS with our free online App Icon Generator. Upload your image and get a complete set of icons in seconds."
        />
        <meta
          name="keywords"
          content="app icon generator, create app icons, android icons, ios icons, macos icons, free icon generator"
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="og:title"
          content="App Icon Generator - Create Icons for Android, iOS, and macOS"
        />
        <meta
          name="og:description"
          content="Easily generate app icons for Android, iOS, and macOS with our free online App Icon Generator. Upload your image and get a complete set of icons in seconds."
        />
        <meta name="og:type" content="website" />
        <meta name="og:url" content="https://appicon.aibiz.id/" />
        <meta name="og:image" content="https://appicon.aibiz.id/icon-preview.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="App Icon Generator - Create Icons for Android, iOS, and macOS"
        />
        <meta
          name="twitter:description"
          content="Easily generate app icons for Android, iOS, and macOS with our free online App Icon Generator."
        />
        <meta name="twitter:image" content="https://appicon.aibiz.id/icon-preview.jpg" />
        <link rel="canonical" href="https://appicon.aibiz.id/" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-4">
            App Icon Generator
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your image and automatically generate launcher icons for Android, iOS, and macOS apps
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <Card className="p-8">
            <ImageUpload onImageUpload={handleImageUpload} />
          </Card>

          {/* Image Preview and Warnings */}
          {imagePreview && (
            <Card className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Uploaded Image</h3>
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Uploaded preview" 
                      className="w-full max-w-xs rounded-lg shadow-md mx-auto"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Image Analysis</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {isSquare ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      )}
                      <span className={isSquare ? "text-green-700" : "text-amber-700"}>
                        {isSquare ? "Perfect square aspect ratio" : "Not square (may crop unevenly)"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isHighRes ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      )}
                      <span className={isHighRes ? "text-green-700" : "text-amber-700"}>
                        {isHighRes ? "High resolution (512px+)" : "Low resolution (consider 512px+)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Processing State */}
          {isProcessing && (
            <Card className="p-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                <h3 className="text-lg font-semibold mb-2">Generating Icons</h3>
                <p className="text-slate-600">Please wait while we create all icon sizes...</p>
              </div>
            </Card>
          )}

          {/* Icon Preview */}
          {generatedIcons && !isProcessing && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Generated Icons Preview</h3>
                <Button onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download All Icons
                </Button>
              </div>
              <IconPreview icons={generatedIcons} />
            </Card>
          )}

          {/* Information Section */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">What you'll get</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-green-600 mb-2">📱 Android Icons</h4>
                <p className="text-slate-600">
                  Complete mipmap set: mdpi (48px), hdpi (72px), xhdpi (96px), xxhdpi (144px), xxxhdpi (192px)
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-600 mb-2">🍎 iOS Icons</h4>
                <p className="text-slate-600">
                  All required sizes from 20x20 to 1024x1024 for iPhone, iPad, and App Store
                </p>
              </div>
              <div>
                <h4 className="font-medium text-purple-600 mb-2">🖥️ macOS Icons</h4>
                <p className="text-slate-600">
                  Complete iconset from 16x16 to 1024x1024 for Mac applications
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;