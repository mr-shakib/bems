import {z} from 'zod';
import {ID, Query} from 'node-appwrite';
import {zValidator} from '@hono/zod-validator';

import {getMember} from '@/features/members/utils';

import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from '@/config';
import { sessionMiddleware } from '@/lib/session-middleware';
import { Hono } from 'hono';
import { createProjectSchema, updateProjectSchema } from '../schemas';
import { Project } from '../types';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
const app = new Hono()
    .post(
        "/",
        sessionMiddleware,
        zValidator("form", createProjectSchema),
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");

            const { name, image, workspaceId } = c.req.valid("form");

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });
            if (!member) {
                return c.json({ error: 'Unauthorized' }, 401);
            }

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
                imageUrl: uploadedImageUrl,
                workspaceId,
            };

            // Only add imagePublicId if it exists (for backward compatibility)
            if (imagePublicId) {
                createData.imagePublicId = imagePublicId;
            }

            const project = await databases.createDocument(
                DATABASE_ID,
                PROJECTS_ID,
                ID.unique(),
                createData,
            );

            return c.json({ data: project });
        }
    )
    .get(
        "/",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const user = c.get('user');
            const databases = c.get('databases');
            const {workspaceId} = c.req.valid('query');
            if (!workspaceId){
                return c.json({ error: 'Missing workspaceId' }, 400);
            }
            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });
            if (!member) {
                return c.json({ error: 'Unauthorized' }, 401);
            }
            const projects = await databases.listDocuments(
            DATABASE_ID,
            PROJECTS_ID,[
                Query.equal('workspaceId', workspaceId),
                Query.orderDesc('$createdAt'),
            ],
            );
            return c.json({data: projects});
        }

    )
    .patch(
            "/:projectId",
            sessionMiddleware,
            zValidator("form", updateProjectSchema),
            async (c) => {
                const databases = c.get("databases");
                const user = c.get("user");
    
                const {projectId} = c.req.param();
                const {name, image, imagePublicId} = c.req.valid("form");

                const existingProject = await databases.getDocument<Project>(
                    DATABASE_ID,
                    PROJECTS_ID,
                    projectId
                );

                const member = await getMember({
                    databases,
                    workspaceId: existingProject.workspaceId,
                    userId: user.$id,
                });
    
                if(!member){
                    return c.json({
                        error: "Unauthorized"
                    },401
                );
                }
                let uploadedImageUrl: string | undefined;
                let newImagePublicId: string | undefined;
    
                if(image instanceof File) {
                    // Delete previous image if it exists
                    if (existingProject.imagePublicId) {
                        try {
                            await deleteFromCloudinary(existingProject.imagePublicId);
                        } catch (error) {
                            console.error('Error deleting previous image from Cloudinary:', error);
                        }
                    }

                    try {
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
    
                // Prepare update data - only include imagePublicId if it exists
                const updateData: any = {
                    name,
                    imageUrl: uploadedImageUrl,
                };

                // Only add imagePublicId if it exists and is not empty (for backward compatibility)
                if (newImagePublicId && newImagePublicId.trim() !== '') {
                    updateData.imagePublicId = newImagePublicId;
                }

                const project = await databases.updateDocument(
                    DATABASE_ID,
                    PROJECTS_ID,
                    projectId,
                    updateData,
                );
    
                return c.json({ data: project });
            }
        )
        .delete(
            "/:projectId",
            sessionMiddleware,
            async (c) => {
                const databases = c.get("databases");
                const user = c.get("user");

                const { projectId } = c.req.param();

                // Get the project to check permissions and image
                const project = await databases.getDocument(
                    DATABASE_ID,
                    PROJECTS_ID,
                    projectId
                ) as Project;

                const member = await getMember({
                    databases,
                    workspaceId: project.workspaceId,
                    userId: user.$id,
                });

                if (!member) {
                    return c.json({
                        error: "Unauthorized"
                    }, 401);
                }

                // Delete image from Cloudinary if it exists
                if (project.imagePublicId) {
                    try {
                        await deleteFromCloudinary(project.imagePublicId);
                    } catch (error) {
                        console.error("Failed to delete image from Cloudinary:", error);
                        // Continue with project deletion even if image deletion fails
                    }
                }

                // Delete the project document
                await databases.deleteDocument(
                    DATABASE_ID,
                    PROJECTS_ID,
                    projectId
                );

                return c.json({ data: { $id: projectId } });
            }
        )



export default app;