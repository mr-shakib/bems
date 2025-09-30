"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { Task, TaskStatus, TASK_STATUS_LABELS } from "../types";
import { KanbanColumn } from "./kanban-column";
import { KanbanTaskCard } from "./kanban-task-card";
import { useUpdateTask } from "../api/use-update-task";

interface KanbanBoardProps {
  tasks: (Task & {
    assignee?: {
      $id: string;
      name: string;
      email: string;
    } | null;
  })[];
  onEdit?: (task: Task) => void;
  onView?: (task: Task) => void;
}

export const KanbanBoard = ({ tasks, onEdit, onView }: KanbanBoardProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { mutate: updateTask } = useUpdateTask();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = Object.values(TaskStatus);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.position - b.position);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.$id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Get the task being dragged
    const activeTask = tasks.find((t) => t.$id === activeId);
    if (!activeTask) return;

    // Check if we're hovering over a column
    const overColumn = columns.find((col) => col === overId);
    if (overColumn && activeTask.status !== overColumn) {
      // Update task status when dragging over a different column
      updateTask({
        param: { taskId: activeTask.$id },
        json: {
          status: overColumn,
        } as any,
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.$id === activeId);
    const overTask = tasks.find((t) => t.$id === overId);

    if (!activeTask) return;

    // If dropped on another task in the same column, reorder
    if (overTask && activeTask.status === overTask.status) {
      const activeIndex = tasks.findIndex((t) => t.$id === activeId);
      const overIndex = tasks.findIndex((t) => t.$id === overId);

      if (activeIndex !== overIndex) {
        const newTasks = arrayMove(tasks, activeIndex, overIndex);
        // Update positions based on new order
        newTasks.forEach((task, index) => {
          if (task.status === activeTask.status) {
            updateTask({
              param: { taskId: task.$id },
              json: {
                position: index,
              } as any,
            });
          }
        });
      }
    }
  };

  return (
    <div className="flex-1 overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 min-h-[600px] pb-6">
          {columns.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              title={TASK_STATUS_LABELS[status]}
              tasks={getTasksByStatus(status)}
              onEdit={onEdit}
              onView={onView}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <KanbanTaskCard
              task={activeTask}
              onEdit={onEdit}
              onView={onView}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};