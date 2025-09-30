"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Save,
  Upload,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useUpdateProject } from "@/features/projects/api/use-update-project";
import { toast } from "sonner";
import { Project } from "@/features/projects/types";

interface ProjectSettingsClientProps {
  project: Project;
  workspaceId: string;
}

export const ProjectSettingsClient = ({ project, workspaceId }: ProjectSettingsClientProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState(project.name);
  const [imageUrl] = useState(project.imageUrl);
  
  const { mutate: updateProject } = useUpdateProject();

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setIsLoading(true);
    
    updateProject({
      param: { projectId: project.$id },
      form: {
        name: name.trim(),
        image: imageUrl,
      }
    }, {
      onSuccess: () => {
        toast.success("Project updated successfully");
        router.push(`/workspaces/${workspaceId}/projects/${project.$id}`);
      },
      onError: () => {
        toast.error("Failed to update project");
        setIsLoading(false);
      }
    });
  };

  const handleImageUpload = () => {
    toast.info("Image upload feature coming soon");
  };

  return (
    <div className="h-full flex flex-col space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Project Settings</h1>
            <p className="text-muted-foreground">
              Manage your project settings and preferences
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleSave}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Image */}
          <div className="space-y-2">
            <Label>Project Image</Label>
            <div className="flex items-center gap-4">
              <ProjectAvatar
                name={name}
                image={imageUrl}
                className="size-16"
                fallbackClassName="text-xl"
              />
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleImageUpload}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <p className="text-xs text-muted-foreground">
                  Recommended: Square image, at least 400x400px
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground">
              This name will be visible to all team members
            </p>
          </div>

          {/* Project Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Project Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p className="font-medium">
                  {new Date(project.$createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated:</span>
                <p className="font-medium">
                  {new Date(project.$updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Project ID:</span>
                <p className="font-mono text-xs">{project.$id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Workspace:</span>
                <p className="font-medium">{project.workspaceId}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end pt-6 border-t">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            asChild
            disabled={isLoading}
          >
            <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
              Cancel
            </Link>
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};