"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X,
  ArrowLeft,
  Upload,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { useUpdateProfile } from "../api/use-update-profile";
import { uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } from "@/lib/cloudinary";
import { LoadingOverlay, FloatingLoader, SuccessAnimation } from "@/components/loading-components";

interface User {
  $id: string;
  name: string;
  email: string;
  $createdAt: string;
  $updatedAt: string;
  emailVerification?: boolean;
  labels?: string[];
  avatar?: string;
  avatarPublicId?: string;
}

interface ProfileViewProps {
  user: User;
  workspaceId: string;
}

export const ProfileView = ({ user, workspaceId }: ProfileViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState("");
  const [avatarPublicId, setAvatarPublicId] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const { mutate: updateProfile, isPending: isLoading } = useUpdateProfile();

  // Load avatar from localStorage on component mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem(`user-avatar-${user.$id}`);
    const savedAvatarPublicId = localStorage.getItem(`user-avatar-public-id-${user.$id}`);
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
    if (savedAvatarPublicId) {
      setAvatarPublicId(savedAvatarPublicId);
    }
  }, [user.$id]);

  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() ?? "U";

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    updateProfile(
      { json: { name: name.trim(), avatar: avatar || undefined, avatarPublicId: avatarPublicId || undefined } },
      {
        onSuccess: () => {
          setIsEditing(false);
          setShowSuccessAnimation(true);
        },
      }
    );
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      setIsUploadingImage(true);
      setUploadProgress(0);
      
      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.random() * 20;
          });
        }, 200);

        // Delete previous image from Cloudinary if it exists
        if (avatarPublicId) {
          setIsDeletingImage(true);
          try {
            await deleteFromCloudinary(avatarPublicId);
            toast.success("Previous image deleted successfully");
          } catch (deleteError) {
            console.warn("Failed to delete previous image:", deleteError);
            // Continue with upload even if deletion fails
          } finally {
            setIsDeletingImage(false);
          }
        }

        // Upload new image
        const result = await uploadToCloudinary(file);
        const imageUrl = result.secure_url;
        const newPublicId = result.public_id;
        
        // Complete progress
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setAvatar(imageUrl);
        setAvatarPublicId(newPublicId);
        
        // Save to localStorage immediately
        localStorage.setItem(`user-avatar-${user.$id}`, imageUrl);
        localStorage.setItem(`user-avatar-public-id-${user.$id}`, newPublicId);
        
        // Also update the profile in the backend
        updateProfile(
          { json: { name: name.trim(), avatar: imageUrl, avatarPublicId: newPublicId } },
          {
            onSuccess: () => {
              toast.success("Profile image updated successfully!");
              setShowSuccessAnimation(true);
            },
            onError: () => {
              toast.error("Image uploaded but failed to save to profile");
            }
          }
        );
      } catch (error) {
        toast.error("Failed to upload image");
        console.error(error);
      } finally {
        setIsUploadingImage(false);
        setUploadProgress(0);
      }
    };

    input.click();
  };

  const handleRemoveImage = async () => {
    if (!avatarPublicId) {
      // Just clear local image if no public ID
      setAvatar("");
      localStorage.removeItem(`user-avatar-${user.$id}`);
      localStorage.removeItem(`user-avatar-public-id-${user.$id}`);
      
      updateProfile(
        { json: { name: name.trim(), avatar: undefined, avatarPublicId: undefined } },
        {
          onSuccess: () => {
            toast.success("Profile image removed successfully!");
            setShowSuccessAnimation(true);
          },
        }
      );
      return;
    }

    setIsDeletingImage(true);
    
    try {
      // Delete from Cloudinary
      await deleteFromCloudinary(avatarPublicId);
      
      // Clear local state
      setAvatar("");
      setAvatarPublicId("");
      
      // Clear localStorage
      localStorage.removeItem(`user-avatar-${user.$id}`);
      localStorage.removeItem(`user-avatar-public-id-${user.$id}`);
      
      // Update profile
      updateProfile(
        { json: { name: name.trim(), avatar: undefined, avatarPublicId: undefined } },
        {
          onSuccess: () => {
            toast.success("Profile image removed successfully!");
            setShowSuccessAnimation(true);
          },
          onError: () => {
            toast.error("Image deleted but failed to update profile");
          }
        }
      );
    } catch (error) {
      toast.error("Failed to remove image");
      console.error(error);
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    // Don't reset avatar on cancel since it's saved independently
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild className="hover:bg-white/60">
            <Link href={`/workspaces/${workspaceId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Main Profile Card */}
        <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white/20 shadow-lg">
                    {avatar ? (
                      <img 
                        src={avatar} 
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-white/20 text-white text-xl sm:text-2xl font-bold backdrop-blur-sm">
                        {avatarFallback}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {isEditing && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0 bg-white border-2 border-white/20 hover:bg-gray-50 text-gray-700"
                      onClick={handleImageUpload}
                      disabled={isUploadingImage || isDeletingImage}
                    >
                      {isUploadingImage || isDeletingImage ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Edit3 className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                  {(isUploadingImage || isDeletingImage) && (
                    <FloatingLoader 
                      isVisible={true}
                      type={isUploadingImage ? 'upload' : 'delete'}
                      size="lg"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">{user.name}</h1>
                  <p className="text-blue-100 mb-2">{user.email}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {user.emailVerification && (
                      <Badge className="bg-green-500/20 text-green-100 border-green-400/30 hover:bg-green-500/30">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                      <User className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
              
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm"
                  variant="outline"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleCancel} 
                    disabled={isLoading}
                    className="bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    disabled={isLoading}
                    className="bg-white text-gray-900 hover:bg-gray-100"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          <CardContent className="p-6 space-y-8">
            {/* Edit Mode Profile Image Section */}
            {isEditing && (
              <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50 hover:border-blue-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-gray-200 shadow-lg">
                        {avatar ? (
                          <img 
                            src={avatar} 
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-semibold">
                            {avatarFallback}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {(isUploadingImage || isDeletingImage) && (
                        <FloatingLoader 
                          isVisible={true}
                          type={isUploadingImage ? 'upload' : 'delete'}
                          size="lg"
                        />
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Profile Picture</h3>
                      <div className="flex gap-2 justify-center">
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={handleImageUpload}
                          disabled={isUploadingImage || isDeletingImage}
                          className="bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          {isUploadingImage ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              {isDeletingImage ? "Replacing..." : "Uploading..."}
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              {avatar ? "Change Image" : "Upload Image"}
                            </>
                          )}
                        </Button>
                        {avatar && (
                          <Button 
                            type="button"
                            variant="outline" 
                            size="sm"
                            onClick={handleRemoveImage}
                            disabled={isUploadingImage || isDeletingImage}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            {isDeletingImage ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Removing...
                              </>
                            ) : (
                              <>
                                <X className="h-4 w-4 mr-2" />
                                Remove
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Square image recommended • Max 5MB
                      </p>
                      {isDeletingImage && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <p className="text-sm text-orange-700 flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Deleting previous image from cloud storage...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-900">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        disabled={isLoading}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Email */}
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</Label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900 flex-1">{user.email}</span>
                      {user.emailVerification && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-900">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                Account Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Account Created</Label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-900">
                        {format(new Date(user.$createdAt), "MMMM dd, yyyy")}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(new Date(user.$createdAt), "h:mm a")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Last Updated</Label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-900">
                        {format(new Date(user.$updatedAt), "MMMM dd, yyyy")}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(new Date(user.$updatedAt), "h:mm a")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Account Status */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-900">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                Account Status
              </h3>
              
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-3">
                    <Badge className="px-4 py-2 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
                      <User className="h-4 w-4 mr-2" />
                      Active User
                    </Badge>
                    {user.emailVerification && (
                      <Badge className="px-4 py-2 bg-green-100 text-green-700 border-green-200 hover:bg-green-200">
                        <Shield className="h-4 w-4 mr-2" />
                        Email Verified
                      </Badge>
                    )}
                    <Badge variant="outline" className="px-4 py-2 border-gray-300 text-gray-600">
                      ID: {user.$id.slice(-8)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-gray-900">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Change Password</h4>
                      <p className="text-sm text-gray-600">
                        Update your password to keep your account secure
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" disabled className="bg-gray-50">
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" disabled className="bg-gray-50">
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* Loading Overlays */}
      <LoadingOverlay 
        isVisible={isUploadingImage} 
        type="upload" 
        progress={uploadProgress}
        message="Uploading your profile image to cloud storage"
      />
      
      <LoadingOverlay 
        isVisible={isDeletingImage && !isUploadingImage} 
        type="delete" 
        message="Removing previous image from cloud storage"
      />
      
      <LoadingOverlay 
        isVisible={isLoading && !isUploadingImage && !isDeletingImage} 
        type="save" 
        message="Saving your profile changes"
      />

      {/* Success Animation */}
      <SuccessAnimation 
        isVisible={showSuccessAnimation}
        message="Profile Updated!"
        onComplete={() => setShowSuccessAnimation(false)}
      />
    </div>
  );
};