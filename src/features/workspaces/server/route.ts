import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utils";
import { z } from "zod";
import { Workspace } from "../types";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

const app = new Hono()
    .get("/",
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");

            const members = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("userId", user.$id)]
            );

            if (members.total === 0) {
                return c.json({ data: { documents: [], total: 0 } });
            }

            const workspaceIds = members.documents.map((member) => member.workspaceId);

            const workspaces = await databases.listDocuments(
                DATABASE_ID,
                WORKSPACES_ID,
                [
                    Query.orderDesc("$createdAt"),
                    Query.contains("$id", workspaceIds)
                ]
            );

            return c.json({ data: workspaces });
        }
    )
    .post("/",
        zValidator("form", createWorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");

            const { name, image } = c.req.valid("form");

            let uploadedImageUrl: string | undefined;
            let imagePublicId: string | undefined;

            if(image instanceof File) {
                try {
                    const result = await uploadToCloudinary(image);
                    uploadedImageUrl = result.secure_url;
                    imagePublicId = result.public_id;
                } catch (error) {
                    console.error('Error uploading image to Cloudinary:', error);
                    throw new Error('Failed to upload image');
                }
            }

            // Prepare creation data - only include imagePublicId if it exists
            const createData: any = {
                name,
                userId: user.$id,
                imageUrl: uploadedImageUrl,
                inviteCode: generateInviteCode(9),
            };

            // Only add imagePublicId if it exists (for backward compatibility)
            if (imagePublicId) {
                createData.imagePublicId = imagePublicId;
            }

            const workspace = await databases.createDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                ID.unique(),
                createData,
            );

            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    userId: user.$id,
                    workspaceId: workspace.$id,
                    role: MemberRole.ADMIN,
                },
            );

            return c.json({ data: workspace });
        }
    )
    .patch(
        "/:workspaceId",
        sessionMiddleware,
        zValidator("form", updateWorkspaceSchema),
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");

            const {workspaceId} = c.req.param();
            const {name, image, imagePublicId} = c.req.valid("form");

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if(!member || member.role !== MemberRole.ADMIN){
                return c.json({
                    error: "Unauthorized"
                },401
            );
            }

            // Get existing workspace to check for previous image
            const existingWorkspace = await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId
            );

            let uploadedImageUrl: string | undefined;
            let newImagePublicId: string | undefined;

            if(image instanceof File) {
                try {
                    // Delete previous image from Cloudinary if it exists
                    if (existingWorkspace.imagePublicId) {
                        try {
                            await deleteFromCloudinary(existingWorkspace.imagePublicId);
                        } catch (deleteError) {
                            console.warn('Failed to delete previous image:', deleteError);
                            // Continue with upload even if deletion fails
                        }
                    }

                    // Upload new image
                    const result = await uploadToCloudinary(image);
                    uploadedImageUrl = result.secure_url;
                    newImagePublicId = result.public_id;
                } catch (error) {
                    console.error('Error uploading image to Cloudinary:', error);
                    throw new Error('Failed to upload image');
                }
            } else {
                uploadedImageUrl = image;
                // Only use imagePublicId if it's a non-empty string
                newImagePublicId = imagePublicId && imagePublicId.trim() !== '' ? imagePublicId : undefined;
            }

            // Prepare update data - only include imagePublicId if it's provided
            const updateData: any = {
                name,
                imageUrl: uploadedImageUrl,
            };

            // Only add imagePublicId if it exists and is not empty (for backward compatibility)
            if (newImagePublicId && newImagePublicId.trim() !== '') {
                updateData.imagePublicId = newImagePublicId;
            }

            const workspace = await databases.updateDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
                updateData,
            );

            return c.json({ data: workspace });
        }
    )
    .delete(
        "/:workspaceId",
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");

            const { workspaceId } = c.req.param();

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if (!member || member.role !== MemberRole.ADMIN) {
                return c.json({
                    error: "Unauthorized"
                }, 401);
            }

            // Get the workspace to check for image
            const workspace = await databases.getDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId
            ) as Workspace;

            // Delete image from Cloudinary if it exists
            if (workspace.imagePublicId) {
                try {
                    await deleteFromCloudinary(workspace.imagePublicId);
                } catch (error) {
                    console.error("Failed to delete image from Cloudinary:", error);
                    // Continue with workspace deletion even if image deletion fails
                }
            }

            // TODO: Delete all related documents (members, projects, etc.) when available
            // For now, we just delete the workspace document
            await databases.deleteDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId
            );

            return c.json({ data: { $id: workspaceId } });
        }
    )
    .post(
        "/:workspaceId/reset-invite-code",
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");

            const { workspaceId } = c.req.param();

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if (!member || member.role !== MemberRole.ADMIN) {
                return c.json({
                    error: "Unauthorized"
                }, 401);
            }

            const workspace = await databases.updateDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
                {
                    inviteCode: generateInviteCode(9),
                }
            );

            return c.json({ data: { $id: workspace } });
        }
    )
    .post("/:workspaceId/join",
        sessionMiddleware,
        zValidator("json", z.object({ code: z.string() })),
        async (c) => {
            const { workspaceId } = c.req.param();
            const { code } = c.req.valid("json");

            const databases = c.get("databases");
            const user = c.get("user");

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if (member) {
                return c.json({
                    error: "Already a member"
                }, 400);
            }

            const workspace = await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId
            );
            if (workspace.inviteCode !== code) {
                return c.json({
                    error: "Invalid invite code"
                }, 400);
            }

            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    userId: user.$id,
                    workspaceId,
                    role: MemberRole.MEMBER
                }
            );

            return c.json({ data: workspace });
        });

export default app;