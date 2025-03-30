
import React, { useState } from "react";
import { Task, Tag } from "@/types";
import { Draggable } from "react-beautiful-dnd";
import { format } from "date-fns";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Mail, 
  MoreVertical, 
  Tag as TagIcon, 
  Trash, 
  Edit, 
  AlertCircle,
  CheckCircle 
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

interface TaskCardProps {
  task: Task;
  index: number;
  listId: string;
  onToggleComplete: (listId: string, taskId: string) => void;
  onDelete: (listId: string, taskId: string) => void;
  onUpdate: (listId: string, task: Task) => void;
  onAddTag: (listId: string, taskId: string, tag: Tag) => void;
  onRemoveTag: (listId: string, taskId: string, tagId: string) => void;
  onSetPriority: (listId: string, taskId: string, priority: "low" | "medium" | "high") => void;
  onSetDueDate: (listId: string, taskId: string, date: Date | undefined) => void;
  onSetEmailReminder: (listId: string, taskId: string, email: string | undefined) => void;
  onSendEmailReminder: (listId: string, taskId: string) => void;
  availableTags: Tag[];
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  listId,
  onToggleComplete,
  onDelete,
  onUpdate,
  onAddTag,
  onRemoveTag,
  onSetPriority,
  onSetDueDate,
  onSetEmailReminder,
  onSendEmailReminder,
  availableTags
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  const [openTagSelector, setOpenTagSelector] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [emailInput, setEmailInput] = useState(task.emailReminder || "");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSaveEdit = () => {
    if (editedContent.trim()) {
      onUpdate(listId, { ...task, content: editedContent });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedContent(task.content);
    }
  };

  const priorityClass = {
    low: "border-l-4 border-priority-low",
    medium: "border-l-4 border-priority-medium",
    high: "border-l-4 border-priority-high"
  };

  const priorityText = {
    low: "Low",
    medium: "Medium",
    high: "High"
  };

  const priorityIcon = {
    low: <AlertCircle className="w-4 h-4 text-priority-low" />,
    medium: <AlertCircle className="w-4 h-4 text-priority-medium" />,
    high: <AlertCircle className="w-4 h-4 text-priority-high" />
  };

  const handleSetEmailReminder = () => {
    // Simple email validation
    if (emailInput && !/\S+@\S+\.\S+/.test(emailInput)) {
      return; // Invalid email format
    }
    
    onSetEmailReminder(listId, task.id, emailInput || undefined);
    setDialogOpen(false);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`ghibli-card p-4 mb-3 ${priorityClass[task.priority]} ${
            snapshot.isDragging ? "shadow-lg" : ""
          } ${task.completed ? "opacity-70" : ""}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  className="ghibli-input mb-2 w-full"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSaveEdit}
                  autoFocus
                />
              ) : (
                <div
                  className={`text-sm ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.content}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap mt-2 gap-1">
                {task.tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="ghibli-tag flex items-center"
                    style={{ backgroundColor: tag.color + "50" }}
                  >
                    <span className="mr-1">{tag.name}</span>
                    <button
                      onClick={() => onRemoveTag(listId, task.id, tag.id)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                
                <Popover open={openTagSelector} onOpenChange={setOpenTagSelector}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-5 text-xs rounded-full px-2 bg-white/70"
                    >
                      <TagIcon className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 p-2">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Add Tags</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {availableTags
                          .filter(tag => !task.tags.some(t => t.id === tag.id))
                          .map(tag => (
                            <Button
                              key={tag.id}
                              variant="outline"
                              size="sm"
                              className="justify-start"
                              style={{ backgroundColor: tag.color + "30" }}
                              onClick={() => {
                                onAddTag(listId, task.id, tag);
                                setOpenTagSelector(false);
                              }}
                            >
                              {tag.name}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Due date */}
              {task.dueDate && (
                <div className="mt-2 text-xs flex items-center text-gray-600">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                </div>
              )}
              
              {/* Email reminder */}
              {task.emailReminder && (
                <div className="mt-1 text-xs flex items-center text-gray-600">
                  <Mail className="h-3 w-3 mr-1" />
                  {task.emailReminder}
                  {task.reminderSent ? (
                    <span className="ml-1 text-green-600 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Sent
                    </span>
                  ) : (
                    <button
                      onClick={() => onSendEmailReminder(listId, task.id)}
                      className="ml-1 text-blue-500 hover:text-blue-700 text-xs"
                    >
                      Send
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-start space-x-1">
              <button
                onClick={() => onToggleComplete(listId, task.id)}
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                <CheckCircle2 
                  className={`h-5 w-5 ${task.completed ? "text-green-600" : "text-gray-400"}`} 
                />
              </button>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-gray-500 hover:text-gray-700">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2">
                  <div className="space-y-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => {
                        setIsEditing(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit Task
                    </Button>
                    
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start"
                        >
                          <Mail className="h-4 w-4 mr-2" /> Set Email Reminder
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Set Email Reminder</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <Input
                            placeholder="your-email@example.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            {task.emailReminder ? 
                              "Current email: " + task.emailReminder : 
                              "No email reminder set"}
                          </p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSetEmailReminder}>
                            {task.emailReminder ? "Update" : "Set"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start"
                        >
                          <Calendar className="h-4 w-4 mr-2" /> Set Due Date
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={task.dueDate ? new Date(task.dueDate) : undefined}
                          onSelect={(date) => {
                            onSetDueDate(listId, task.id, date);
                            setOpenCalendar(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <div className="py-1">
                      <p className="px-2 text-xs font-medium">Priority</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => onSetPriority(listId, task.id, "low")}
                    >
                      <span className="w-3 h-3 rounded-full bg-priority-low mr-2" />
                      Low
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => onSetPriority(listId, task.id, "medium")}
                    >
                      <span className="w-3 h-3 rounded-full bg-priority-medium mr-2" />
                      Medium
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => onSetPriority(listId, task.id, "high")}
                    >
                      <span className="w-3 h-3 rounded-full bg-priority-high mr-2" />
                      High
                    </Button>
                    
                    <div className="pt-2">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => onDelete(listId, task.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Priority indicator at the bottom */}
          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center text-xs text-gray-500">
            <div className="flex items-center">
              {priorityIcon[task.priority]}
              <span className="ml-1">{priorityText[task.priority]} Priority</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
