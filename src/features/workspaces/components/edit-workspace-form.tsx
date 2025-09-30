"use client";
import Image from "next/image";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef } from "react";
import { AlertTriangle, ArrowLeftIcon, CopyIcon, ImageIcon, Trash } from "lucide-react";
import { updateWorkspaceSchema } from "../schemas";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useRouter } from "next/navigation";
import { Workspace } from "../types";

import { Avatar, AvatarFallback,  } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { useResetInviteCode } from "../api/use-reset-invite-code";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm = ({ onCancel, initialValues }: EditWorkspaceFormProps) => {
    console.log("Initial values in EditWorkspaceForm:", initialValues);
    console.log("Invite code in EditWorkspaceForm:", initialValues.inviteCode);
    
    const router = useRouter();
    const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace(); 
    const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace();
    const { mutate: resetInviteCode, isPending: isResettingInviteCode } = useResetInviteCode();

    const [DeleteDialog, confirmDelete] = useConfirm(
        "Delete Workspace",
        "This action cannot be undone. This will permanently delete the workspace and all of its contents.",
        "destructive"
    );

    const [ResetDialog, confirmReset] = useConfirm(
        "Reset Invite Link",
        "This action will reset the invite link for the workspace.",
        "destructive"
    );

    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            name: initialValues.name,
            image: initialValues.imageUrl ?? undefined,
        },
    });

    const handleDelete = async () => {
        const ok = await confirmDelete();
        if (!ok) return;
        
        deleteWorkspace({
            param: { workspaceId: initialValues.$id }
        }, {
            onSuccess: () => {
                window.location.href = "/";
            }
        });
    };

    const handleResetInviteCode = async () => {
        const ok = await confirmReset();
        if (!ok) return;
        
        resetInviteCode({
            param: { workspaceId: initialValues.$id }
        });
    };

    const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
        const finalValues = {
            name: values.name || initialValues.name,
            image: values.image instanceof File ? values.image : "",
        };

        updateWorkspace({
            form: finalValues,
            param: { workspaceId: initialValues.$id }
        }, {
            onSuccess: () => {
                form.reset();
            },
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file);
        }
    };

    // Change from function to computed value
    const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;
    console.log("Full invite link:", fullInviteLink);

    const handleCopyInviteLink = () => {
        navigator.clipboard.writeText(fullInviteLink)
        .then(() => toast.success("Invite link copied to clipboard"));
    }

    const isPending = isUpdatingWorkspace || isDeletingWorkspace;

    return (
        <div className="flex flex-col gap-y-6">
            <DeleteDialog />
            <ResetDialog />
            
            {/* Workspace Overview Card */}
            <Card className="w-full border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-x-4 p-6 space-y-0 border-b border-gray-200">
                    <div className="w-10 h-10 bg-gray-50 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3v3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 18v3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 12h3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 12h3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            {initialValues.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">Configure workspace settings and preferences</p>
                    </div>
                </CardHeader>
                <div className="px-6">
                    <DottedSeparator className="py-4" />
                </div>
                <CardContent className="px-6 pb-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Workspace Name Section */}
                                <div className="space-y-2">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Workspace Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter workspace name"
                                                        className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Workspace Image Section */}
                                <div className="space-y-2">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Visual Identity</h3>
                                    </div>
                                    <FormField 
                                        control={form.control}
                                        name="image"
                                        render={({ field }) => (
                                            <div className="space-y-3">
                                                <div className="flex flex-col gap-y-3">
                                                    <div className="flex items-center gap-x-4 p-4 bg-white rounded-md border border-gray-100">
                                                        {field.value ? (
                                                            <div className="size-[72px] relative rounded-md overflow-hidden shadow-sm border border-gray-100">
                                                                <Image 
                                                                    src={field.value instanceof File
                                                                        ? URL.createObjectURL(field.value)
                                                                        : field.value
                                                                    }
                                                                    alt="Workspace Logo"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ) : initialValues.imageUrl ? (
                                                            <div className="size-[80px] relative rounded-xl overflow-hidden shadow-lg border-2 border-white">
                                                                <Image 
                                                                    src={initialValues.imageUrl}
                                                                    alt="Workspace Logo"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="size-[72px] bg-gray-100 rounded-md flex items-center justify-center shadow-sm border border-gray-100">
                                                                <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7h18v10H3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                            </div>
                                                        )}
                                                        <div className="flex-1 space-y-2">
                                                            <p className="text-sm font-medium text-gray-900">Workspace Icon</p>
                                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                                Upload a high-quality image to represent your workspace. PNG, JPG, SVG, JPEG (max. 1MB)
                                                            </p>
                                                            <input
                                                                className="hidden"
                                                                type="file"
                                                                accept=".jpg, .jpeg, .png, .svg"
                                                                ref={inputRef}
                                                                onChange={handleImageChange}
                                                                disabled={isPending}
                                                            />
                                                            <div className="flex gap-3 mt-3">
                                                                <Button
                                                                    type="button"
                                                                    variant="secondary"
                                                                    onClick={() => inputRef.current?.click()}
                                                                    disabled={isPending}
                                                                    size="sm"
                                                                    className="h-9 px-4"
                                                                >
                                                                    Upload Image
                                                                </Button>
                                                                {(field.value || initialValues.imageUrl) && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            form.setValue("image", "");
                                                                            if (inputRef.current) {
                                                                                inputRef.current.value = "";
                                                                            }
                                                                        }}
                                                                        disabled={isPending}
                                                                        size="sm"
                                                                        className="h-9 px-4"
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                            
                            <DottedSeparator className="py-4" />

                            <div className="flex items-center justify-end pt-2 gap-3">
                                <Button 
                                    type="button" 
                                    size="lg"
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={isPending}
                                    className={cn(!onCancel && "invisible")}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    size="lg"
                                    variant="primary"
                                    disabled={isPending}
                                >
                                    {isUpdatingWorkspace ? (
                                        <>
                                            <div className="relative w-4 h-4 mr-2">
                                                <div className="w-4 h-4 border border-slate-200 rounded-full"></div>
                                                <div className="absolute inset-0 w-4 h-4 border border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>Save Changes</>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="w-full border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-x-4 p-6 space-y-0 border-b border-gray-200">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <div className="w-5 h-5 bg-blue-600 rounded-sm"></div>
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                        Invite Members
                    </CardTitle>
                </CardHeader>
                <div className="px-6">
                    <DottedSeparator className="py-4" />
                </div>
                <CardContent className="p-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <p className="text-sm font-medium text-gray-900">Share this link to invite team members</p>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                                    Use the link below to invite members to your workspace. <strong className="text-blue-700">{initialValues.name}</strong> will be able to access all projects and collaborate with the team.
                                </p>
                                <div className="mt-4">
                                    <div className="flex items-center gap-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <Input 
                                            disabled
                                            value={fullInviteLink} 
                                            className="flex-1 h-10 bg-white border-gray-300 focus:border-blue-500"
                                        />
                                        <Button 
                                            variant="primary"
                                            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                                            onClick={handleCopyInviteLink}
                                        >
                                            <CopyIcon className="size-4 mr-2"/>
                                            Copy
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 lg:ml-6">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        type="button"
                                        disabled={isPending || isResettingInviteCode}
                                        onClick={handleResetInviteCode}
                                        className="w-fit h-9 px-4 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
                                    >
                                        {isResettingInviteCode ? (
                                            <>
                                                <div className="relative w-3 h-3 mr-2">
                                                    <div className="w-3 h-3 border border-slate-200 rounded-full"></div>
                                                    <div className="absolute inset-0 w-3 h-3 border border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                                Resetting...
                                            </>
                                        ) : (
                                            <>
                                                Reset Invite Link
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="w-full border border-red-200 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-x-4 p-6 space-y-0 border-b border-red-200">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-red-900">
                        Danger Zone
                    </CardTitle>
                </CardHeader>
                <div className="px-6">
                    <DottedSeparator className="py-4" />
                </div>
                <CardContent className="p-6">
                    <div className="bg-white rounded-lg border border-red-200 p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                        Permanent Action
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900">Delete Workspace</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                                        Once you delete this workspace, there is no going back. This will permanently 
                                        delete the <strong className="text-red-700">{initialValues.name}</strong> workspace and all of its contents, 
                                        including files, projects, and settings.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 lg:ml-6">
                                <Button
                                    size="lg"
                                    variant="destructive"
                                    type="button"
                                    disabled={isPending}
                                    onClick={handleDelete}
                                    className="w-full lg:w-auto min-w-[160px] h-10 bg-red-600 hover:bg-red-700 shadow-sm hover:shadow-md"
                                >
                                    {isDeletingWorkspace ? (
                                        <>
                                            <div className="relative w-4 h-4 mr-2">
                                                <div className="w-4 h-4 border border-slate-200 rounded-full"></div>
                                                <div className="absolute inset-0 w-4 h-4 border border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                            Deleting Workspace...
                                        </>
                                    ) : (
                                        <>
                                            <Trash className="h-4 w-4 mr-2" />
                                            Delete Workspace
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-center text-gray-500 lg:text-right">
                                    This action cannot be undone
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

