"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Save,
  Trash2,
  Upload,
  Settings,
  Users,
  Archive,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { Project } from "../types";
import { ProjectAvatar } from "./project-avatar";
import { useUpdateProject } from "../api/use-update-project";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

interface ProjectSettingsViewProps {
  project: Project;
  workspaceId: string;
}

export const ProjectSettingsView = ({ project, workspaceId }: ProjectSettingsViewProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(project.imageUrl);
  
  const { mutate: updateProject } = useUpdateProject();
  
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Project",
    "Are you sure you want to delete this project? This action cannot be undone and will delete all tasks and data associated with this project.",
    "destructive"
  );

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

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    // TODO: Implement delete project functionality
    toast.info("Delete functionality will be implemented soon");
  };

  const handleImageUpload = () => {
    // TODO: Implement image upload functionality
    toast.info("Image upload feature coming soon");
  };

  return (
    <>
      <ConfirmDialog />
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

            {/* Project Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description (optional)"
                className="max-w-md"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Provide a brief description of what this project is about
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

        {/* Team & Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team & Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Team Members</h3>
                <p className="text-sm text-muted-foreground">
                  Manage who has access to this project
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage Team
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Project Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Control who can see this project
                </p>
              </div>
              <Badge variant="secondary">Team Only</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Project Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Archive Project</h3>
                <p className="text-sm text-muted-foreground">
                  Archive this project to hide it from active projects
                </p>
              </div>
              <Button variant="outline" size="sm">
                Archive
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-red-800">Delete Project</h3>
                <p className="text-sm text-red-700">
                  Permanently delete this project and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </Button>
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
    </>
  );
};