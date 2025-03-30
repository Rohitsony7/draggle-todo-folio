
import React, { useState } from "react";
import { TaskList as TaskListType, Task } from "@/types";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTaskContext } from "@/context/TaskContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";

interface TaskListProps {
  list: TaskListType;
}

const TaskList: React.FC<TaskListProps> = ({ list }) => {
  const {
    addTask,
    updateTask,
    deleteTask,
    updateTaskList,
    deleteTaskList,
    toggleTaskCompletion,
    allTags,
    addTagToTask,
    removeTagFromTask,
    setTaskPriority,
    setTaskDueDate,
    setTaskEmailReminder,
    sendEmailReminder,
  } = useTaskContext();

  const [newTaskContent, setNewTaskContent] = useState("");
  const [editingListName, setEditingListName] = useState(false);
  const [editedListName, setEditedListName] = useState(list.name);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskContent.trim()) {
      addTask(list.id, newTaskContent);
      setNewTaskContent("");
    }
  };

  const handleUpdateListName = () => {
    if (editedListName.trim()) {
      updateTaskList(list.id, editedListName);
      setEditingListName(false);
    }
  };

  const handleDeleteList = () => {
    deleteTaskList(list.id);
    setDeleteDialogOpen(false);
  };

  // Check if this is the "To Do" list - only it should have the add task form
  const isToDoList = list.name === "To Do";

  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-xl shadow-md w-72 max-h-[90vh] flex flex-col">
      {/* List Header */}
      <div className="p-3 border-b flex items-center justify-between">
        {editingListName ? (
          <div className="flex flex-1">
            <Input
              value={editedListName}
              onChange={(e) => setEditedListName(e.target.value)}
              onBlur={handleUpdateListName}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUpdateListName();
                if (e.key === "Escape") {
                  setEditingListName(false);
                  setEditedListName(list.name);
                }
              }}
              className="py-1 text-sm ghibli-input"
              autoFocus
            />
          </div>
        ) : (
          <h3 className="font-medium text-gray-800">{list.name}</h3>
        )}
        <div className="flex items-center">
          <span className="text-xs text-gray-500 bg-white/50 rounded-full px-2 py-0.5 mr-2">
            {list.tasks.length}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setEditingListName(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete List</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to delete the list "{list.name}"? 
                This will delete all tasks in this list and cannot be undone.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteList}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Task List */}
      <Droppable droppableId={list.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto p-3"
          >
            {list.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                listId={list.id}
                onToggleComplete={toggleTaskCompletion}
                onDelete={deleteTask}
                onUpdate={updateTask}
                onAddTag={addTagToTask}
                onRemoveTag={removeTagFromTask}
                onSetPriority={setTaskPriority}
                onSetDueDate={setTaskDueDate}
                onSetEmailReminder={setTaskEmailReminder}
                onSendEmailReminder={sendEmailReminder}
                availableTags={allTags}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Task Form - Only show for the "To Do" list */}
      {isToDoList && (
        <div className="p-3 border-t">
          <form onSubmit={handleAddTask} className="flex items-center">
            <Input
              type="text"
              placeholder="Add a task..."
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              className="flex-1 py-1 text-sm ghibli-input"
            />
            <Button
              type="submit"
              disabled={!newTaskContent.trim()}
              size="sm"
              className="ml-2 bg-ghibli-sky hover:bg-ghibli-sky/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskList;
