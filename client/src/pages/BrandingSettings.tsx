import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X, Palette, Type, Building2 } from "lucide-react";
import { useLocation } from "wouter";

export default function BrandingSettings() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch current branding
  const { data: branding, isLoading, refetch } = trpc.branding.get.useQuery();
  
  // Mutations
  const updateBranding = trpc.branding.update.useMutation();
  const uploadLogo = trpc.branding.uploadLogo.useMutation();

  // Local state
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    primaryColor: branding?.primaryColor || "#000000",
    secondaryColor: branding?.secondaryColor || "#f5f5f5",
    accentColor: branding?.accentColor || "#ffffff",
    fontFamily: branding?.fontFamily || "Inter",
    companyName: (branding && 'companyName' in branding && branding.companyName) || "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form when branding loads
  useEffect(() => {
    if (branding) {
      setFormData({
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        accentColor: branding.accentColor,
        fontFamily: branding.fontFamily,
        companyName: ('companyName' in branding && branding.companyName) || "",
      });
      if ('logoUrl' in branding && branding.logoUrl) {
        setLogoPreview(branding.logoUrl);
      }
    }
  }, [branding]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to access branding settings.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading branding settings...</p>
      </div>
    );
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to S3
    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]); // Remove data:image/png;base64, prefix
        };
        reader.readAsDataURL(file);
      });

      const result = await uploadLogo.mutateAsync({
        fileName: file.name,
        fileData: base64,
        mimeType: file.type,
      });

      toast.success("Logo uploaded successfully");
      
      // Update branding with new logo URL
      await updateBranding.mutateAsync({
        ...formData,
        logoUrl: result.url,
      });
      
      refetch();
    } catch (error: any) {
      toast.error(`Failed to upload logo: ${error.message}`);
    }
  };

  const handleRemoveLogo = async () => {
    setLogoPreview(null);
    try {
      await updateBranding.mutateAsync({
        ...formData,
        logoUrl: undefined,
      });
      toast.success("Logo removed");
      refetch();
    } catch (error: any) {
      toast.error(`Failed to remove logo: ${error.message}`);
    }
  };

  const handleSave = async () => {
    try {
      await updateBranding.mutateAsync({
        ...formData,
        logoUrl: branding && 'logoUrl' in branding ? (branding.logoUrl || undefined) : undefined,
      });
      toast.success("Branding settings saved!");
      refetch();
    } catch (error: any) {
      toast.error(`Failed to save: ${error.message}`);
    }
  };

  const handleReset = () => {
    setFormData({
      primaryColor: "#000000",
      secondaryColor: "#f5f5f5",
      accentColor: "#ffffff",
      fontFamily: "Inter",
      companyName: "",
    });
    setLogoPreview(null);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            ← Back
          </Button>
          <h1 className="text-4xl font-bold text-black">Brand Settings</h1>
          <p className="text-gray-700 mt-2">
            Customize how your proposals look with your brand identity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Form */}
          <div className="space-y-6">
            {/* Logo Upload */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-black" />
                <h2 className="text-xl font-semibold text-black">Logo</h2>
              </div>
              
              <div className="space-y-4">
                {logoPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-24 w-auto object-contain border border-gray-200 rounded-lg p-2"
                    />
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No logo uploaded</p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadLogo.isPending}
                >
                  {uploadLogo.isPending ? "Uploading..." : "Upload Logo"}
                </Button>
                <p className="text-xs text-gray-500">
                  Recommended: PNG or SVG, max 2MB
                </p>
              </div>
            </Card>

            {/* Colors */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-black" />
                <h2 className="text-xl font-semibold text-black">Colors</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, primaryColor: e.target.value })
                      }
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, primaryColor: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, secondaryColor: e.target.value })
                      }
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, secondaryColor: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="accentColor"
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) =>
                        setFormData({ ...formData, accentColor: e.target.value })
                      }
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.accentColor}
                      onChange={(e) =>
                        setFormData({ ...formData, accentColor: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Typography & Company */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Type className="w-5 h-5 text-black" />
                <h2 className="text-xl font-semibold text-black">Typography & Company</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <select
                    id="fontFamily"
                    value={formData.fontFamily}
                    onChange={(e) =>
                      setFormData({ ...formData, fontFamily: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    placeholder="Your Company Name"
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleSave}
                disabled={updateBranding.isPending}
                className="flex-1 bg-black hover:bg-gray-800 text-white"
              >
                {updateBranding.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                Reset to Defaults
              </Button>
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-black mb-4">Preview</h2>
              
              <div
                className="rounded-lg p-8 text-center"
                style={{
                  background: `linear-gradient(135deg, ${formData.primaryColor} 0%, ${formData.secondaryColor} 100%)`,
                  fontFamily: formData.fontFamily,
                }}
              >
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="h-16 w-auto mx-auto mb-4 object-contain"
                  />
                )}
                
                <h1
                  className="text-4xl font-bold mb-2"
                  style={{ color: formData.accentColor }}
                >
                  {formData.companyName || "Your Company"}
                </h1>
                <p
                  className="text-lg opacity-90"
                  style={{ color: formData.accentColor }}
                >
                  Proposal for Client Name
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Primary Color</span>
                  <div
                    className="w-12 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Secondary Color</span>
                  <div
                    className="w-12 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: formData.secondaryColor }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Accent Color</span>
                  <div
                    className="w-12 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: formData.accentColor }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Font</span>
                  <span className="text-sm font-medium" style={{ fontFamily: formData.fontFamily }}>
                    {formData.fontFamily}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

