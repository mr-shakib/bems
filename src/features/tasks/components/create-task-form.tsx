"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DottedSeparator } from "@/components/dotted-separator";
import { cn } from "@/lib/utils";
import { TaskStatus, TaskPriority, TaskType } from "../types";
import { useCreateTask } from "../api/use-create-task";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCurrent } from "@/features/auth/api/use-current";

// Define form schema inline
const formSchema = z.object({
  name: z.string().trim().min(1, "Task name is required"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  assigneeId: z.string().min(1, "Please select an assignee"),
  projectId: z.string().min(1, "Please select a project"),
  dueDate: z.string().optional(),
  // Temporarily disabled unsupported fields
  // priority: z.nativeEnum(TaskPriority),
  // type: z.nativeEnum(TaskType),
  // estimatedHours: z.number().min(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTaskFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
  projectId?: string;
}

export const CreateTaskForm = ({ 
  onCancel, 
  onSuccess,
  projectId: initialProjectId 
}: CreateTaskFormProps) => {
  const workspaceId = useWorkspaceId();
  const { mutate: createTask, isPending } = useCreateTask();
  const { data: projects } = useGetProjects({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });
  const { data: currentUser } = useCurrent();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: TaskStatus.TODO,
      projectId: initialProjectId || "",
      assigneeId: "", // Will be set when currentUser loads
      dueDate: "",
      // Temporarily disabled
      // priority: TaskPriority.MEDIUM,
      // type: TaskType.TASK,
      // estimatedHours: 0,
    },
  });

  // Set assigneeId when currentUser is available
  React.useEffect(() => {
    if (currentUser?.$id && !form.getValues("assigneeId")) {
      form.setValue("assigneeId", currentUser.$id);
    }
  }, [currentUser, form]);

  const onSubmit = (values: FormValues) => {
    const finalValues = {
      ...values,
      dueDate: values.dueDate || undefined,
      // Temporarily disabled
      // estimatedHours: values.estimatedHours || undefined,
    };

    createTask(
      { json: finalValues },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create New Task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter task name..."
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe the task..."
                      disabled={isPending}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects?.documents.map((project) => (
                        <SelectItem key={project.$id} value={project.$id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {members?.documents.map((member: any) => (
                        <SelectItem key={member.$id} value={member.userId}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DottedSeparator className="py-7" />
            
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};