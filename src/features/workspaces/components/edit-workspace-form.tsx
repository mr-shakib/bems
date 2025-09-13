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
        <div className="flex flex-col gap-y-4">
            <DeleteDialog />
            <ResetDialog />
            <Button 
                size="sm" 
                variant="secondary"  
                onClick={onCancel ? onCancel: () => router.push(`/workspaces/${initialValues.$id}`)}
                className="w-fit"
            >
                <ArrowLeftIcon className="size-4 mr-2"/>
                Back
            </Button>
            
            <Card className="w-full h-full border-none shadow-none">
                <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                    <CardTitle className="text-xl font-bold">
                        {initialValues.name}
                    </CardTitle>
                </CardHeader>
                <div className="px-7">
                    <DottedSeparator />
                </div>
                <CardContent className="px-7">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="flex flex-col gap-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Workspace Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Workspace name"
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField 
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <div className="flex flex-col gap-y-2">
                                            <div className="flex items-center gap-x-5">
                                                {field.value ? (
                                                    <div className="size-[72px] relative rounded-md overflow-hidden">
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
                                                    <div className="size-[72px] relative rounded-md overflow-hidden">
                                                        <Image 
                                                            src={initialValues.imageUrl}
                                                            alt="Workspace Logo"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <Avatar className="size-[72px]">
                                                        <AvatarFallback>
                                                            <ImageIcon className="size-[36px] text-neutral-400" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className="flex flex-col">
                                                    <p className="text-sm">Workspace Icon</p>
                                                    <p className="text-xs text-muted-foreground">PNG, JPG, SVG, JPEG (max. 1MB)</p>
                                                    <input
                                                        className="hidden"
                                                        type="file"
                                                        accept=".jpg, .jpeg, .png, .svg"
                                                        ref={inputRef}
                                                        onChange={handleImageChange}
                                                        disabled={isPending}
                                                    />
                                                    <div className="flex gap-x-2 mt-2">
                                                        <Button
                                                            type="button"
                                                            variant="tertiary"
                                                            onClick={() => inputRef.current?.click()}
                                                            disabled={isPending}
                                                            size="xs"
                                                            className="w-fit"
                                                        >
                                                            Upload Image
                                                        </Button>
                                                        {(field.value || initialValues.imageUrl) && (
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                onClick={() => {
                                                                    form.setValue("image", "");
                                                                    if (inputRef.current) {
                                                                        inputRef.current.value = "";
                                                                    }
                                                                }}
                                                                disabled={isPending}
                                                                size="xs"
                                                                className="w-fit"
                                                            >
                                                                Remove Image
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                            <DottedSeparator className="py-7"/> 
                            <div className="flex items-center justify-between">
                                <Button 
                                    type="button" 
                                    size="lg"
                                    variant="secondary"
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
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="w-full border-primary/20 bg-primary/5">
                <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                    <CardTitle className="text-xl font-bold text-primary">
                        Invite Members
                    </CardTitle>
                </CardHeader>
                <div className="px-7">
                    <DottedSeparator />
                </div>
                <CardContent className="p-7">
                    <div className="rounded-lg border border-primary/20 bg-background p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1 space-y-2">
                                
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                                    Use the link below to invite members to your workspace. <strong>{initialValues.name}</strong>   
                                </p>
                                <div className="mt-4">
                                    <div className="flex items-center gap-x-2">
                                        <Input 
                                            disabled
                                            value={fullInviteLink} 
                                        />
                                        <Button 
                                        variant="secondary"
                                        className="size-12"
                                        onClick={handleCopyInviteLink}

                                        >
                                           <CopyIcon className="size-5"/>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 lg:ml-6">
                                <Button
                                    size="sm"
                                    variant="tertiary"
                                    type="button"
                                    disabled={isPending || isResettingInviteCode}
                                    onClick={handleResetInviteCode}
                                    className="mt-6 w-fit ml-auto"
                                >
                                    Reset Invite Link
                                </Button>
                                
                            </div>
                                
                            </div>
                            
                            
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="w-full border-destructive/20 bg-destructive/5">
                <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <CardTitle className="text-xl font-bold text-destructive">
                        Danger Zone
                    </CardTitle>
                </CardHeader>
                <div className="px-7">
                    <DottedSeparator />
                </div>
                <CardContent className="p-7">
                    <div className="rounded-lg border border-destructive/20 bg-background p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-foreground">
                                        Delete Workspace
                                    </h3>
                                    <div className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                                        Permanent
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                                    Once you delete this workspace, there is no going back. This will permanently 
                                    delete the <strong>{initialValues.name}</strong> workspace and all of its contents, 
                                    including files, projects, and settings.
                                </p>
                                
                            </div>

                            <DottedSeparator py-7/>

                            <div className="flex flex-col gap-2 lg:ml-6">
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    type="button"
                                    disabled={isPending}
                                    onClick={handleDelete}
                                    className="w-full lg:w-auto min-w-[140px]"
                                >
                                    {isDeletingWorkspace ? (
                                        <>
                                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash className="h-4 w-4 mr-2" />
                                            Delete Workspace
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground lg:text-right">
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

