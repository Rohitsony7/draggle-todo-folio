
import React, { createContext, useContext, useState, useEffect } from "react";
import { Task, TaskList, Tag, Priority } from "../types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/sonner";

interface TaskContextType {
  taskLists: TaskList[];
  allTags: Tag[];
  addTaskList: (name: string) => void;
  updateTaskList: (id: string, name: string) => void;
  deleteTaskList: (id: string) => void;
  addTask: (listId: string, content: string) => void;
  updateTask: (listId: string, task: Task) => void;
  deleteTask: (listId: string, taskId: string) => void;
  toggleTaskCompletion: (listId: string, taskId: string) => void;
  moveTask: (sourceListId: string, sourceIndex: number, destinationListId: string, destinationIndex: number) => void;
  addTag: (name: string, color: string) => void;
  deleteTag: (id: string) => void;
  updateTag: (id: string, name: string, color: string) => void;
  addTagToTask: (listId: string, taskId: string, tag: Tag) => void;
  removeTagFromTask: (listId: string, taskId: string, tagId: string) => void;
  setTaskPriority: (listId: string, taskId: string, priority: Priority) => void;
  setTaskDueDate: (listId: string, taskId: string, dueDate: Date | undefined) => void;
  setTaskEmailReminder: (listId: string, taskId: string, email: string | undefined) => void;
  sendEmailReminder: (listId: string, taskId: string) => void;
}

// Default values
const defaultTags: Tag[] = [
  { id: uuidv4(), name: 'Work', color: '#f6e7a3' },
  { id: uuidv4(), name: 'Personal', color: '#b0d8b2' },
  { id: uuidv4(), name: 'Urgent', color: '#f2c4c4' },
];

const defaultTaskLists: TaskList[] = [
  {
    id: uuidv4(),
    name: 'To Do',
    tasks: [
      {
        id: uuidv4(),
        content: 'Meet Totoro in the forest',
        completed: false,
        priority: 'medium',
        tags: [defaultTags[1]],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        content: 'Help Kiki with deliveries',
        completed: false,
        priority: 'low',
        tags: [defaultTags[0]],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: uuidv4(),
    name: 'In Progress',
    tasks: [
      {
        id: uuidv4(),
        content: 'Visit the bathhouse with No-Face',
        completed: false,
        priority: 'high',
        tags: [defaultTags[2], defaultTags[1]],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: uuidv4(),
    name: 'Completed',
    tasks: [],
  },
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load data from localStorage
  const savedTaskLists = localStorage.getItem('ghibliTaskLists');
  const savedTags = localStorage.getItem('ghibliTags');

  const [taskLists, setTaskLists] = useState<TaskList[]>(
    savedTaskLists ? JSON.parse(savedTaskLists) : defaultTaskLists
  );
  const [allTags, setAllTags] = useState<Tag[]>(
    savedTags ? JSON.parse(savedTags) : defaultTags
  );

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('ghibliTaskLists', JSON.stringify(taskLists));
    localStorage.setItem('ghibliTags', JSON.stringify(allTags));
  }, [taskLists, allTags]);

  // Simulate sending email
  const sendEmailReminder = (listId: string, taskId: string) => {
    setTaskLists((prev) => 
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map((task) => {
              if (task.id === taskId) {
                const updatedTask = { 
                  ...task, 
                  reminderSent: true,
                  updatedAt: new Date()
                };
                
                // Show toast notification
                toast("Email reminder sent", {
                  description: `Reminder sent to ${task.emailReminder} for: ${task.content}`,
                });
                
                return updatedTask;
              }
              return task;
            }),
          };
        }
        return list;
      })
    );
  };

  const addTaskList = (name: string) => {
    const newList: TaskList = {
      id: uuidv4(),
      name,
      tasks: [],
    };
    setTaskLists([...taskLists, newList]);
  };

  const updateTaskList = (id: string, name: string) => {
    setTaskLists(prev => 
      prev.map(list => 
        list.id === id ? { ...list, name } : list
      )
    );
  };

  const deleteTaskList = (id: string) => {
    setTaskLists(prev => prev.filter(list => list.id !== id));
  };

  const addTask = (listId: string, content: string) => {
    const newTask: Task = {
      id: uuidv4(),
      content,
      completed: false,
      priority: 'medium',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTaskLists(prev => 
      prev.map(list => {
        if (list.id === listId) {
          return { ...list, tasks: [...list.tasks, newTask] };
        }
        return list;
      })
    );
  };

  const updateTask = (listId: string, updatedTask: Task) => {
    setTaskLists(prev => 
      prev.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map(task => 
              task.id === updatedTask.id ? 
                { ...updatedTask, updatedAt: new Date() } : 
                task
            )
          };
        }
        return list;
      })
    );
  };

  const deleteTask = (listId: string, taskId: string) => {
    setTaskLists(prev => 
      prev.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.filter(task => task.id !== taskId)
          };
        }
        return list;
      })
    );
  };

  const toggleTaskCompletion = (listId: string, taskId: string) => {
    setTaskLists(prev => 
      prev.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  completed: !task.completed,
                  updatedAt: new Date()
                };
              }
              return task;
            })
          };
        }
        return list;
      })
    );
  };

  const moveTask = (
    sourceListId: string, 
    sourceIndex: number, 
    destinationListId: string, 
    destinationIndex: number
  ) => {
    setTaskLists(prev => {
      const newLists = [...prev];
      
      // Find the source and destination lists
      const sourceListIndex = newLists.findIndex(list => list.id === sourceListId);
      const destListIndex = newLists.findIndex(list => list.id === destinationListId);
      
      if (sourceListIndex === -1 || destListIndex === -1) return prev;
      
      // Get the task to move
      const [removedTask] = newLists[sourceListIndex].tasks.splice(sourceIndex, 1);
      
      // Insert at the new location
      newLists[destListIndex].tasks.splice(destinationIndex, 0, {
        ...removedTask,
        updatedAt: new Date()
      });
      
      return newLists;
    });
  };

  const addTag = (name: string, color: string) => {
    const newTag: Tag = {
      id: uuidv4(),
      name,
      color,
    };
    setAllTags([...allTags, newTag]);
  };

  const deleteTag = (id: string) => {
    setAllTags(prev => prev.filter(tag => tag.id !== id));
    
    // Also remove this tag from all tasks
    setTaskLists(prev => 
      prev.map(list => ({
        ...list,
        tasks: list.tasks.map(task => ({
          ...task,
          tags: task.tags.filter(tag => tag.id !== id),
          updatedAt: new Date()
        }))
      }))
    );
  };

  const updateTag = (id: string, name: string, color: string) => {
    const updatedTags = allTags.map(tag => 
      tag.id === id ? { ...tag, name, color } : tag
    );
    
    setAllTags(updatedTags);
    
    // Update this tag in all tasks
    setTaskLists(prev => 
      prev.map(list => ({
        ...list,
        tasks: list.tasks.map(task => ({
          ...task,
          tags: task.tags.map(tag => 
            tag.id === id ? { ...tag, name, color } : tag
          ),
          updatedAt: task.tags.some(tag => tag.id === id) ? new Date() : task.updatedAt
        }))
      }))
    );
  };

  const addTagToTask = (listId: string, taskId: string, tag: Tag) => {
    setTaskLists(prev => 
      prev.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map(task => {
              if (task.id === taskId) {
                // Only add if tag isn't already present
                if (!task.tags.some(t => t.id === tag.id)) {
                  return {
                    ...task,
                    tags: [...task.tags, tag],
                    updatedAt: new Date()
                  };
                }
              }
              return task;
            })
          };
        }
        return list;
      })
    );
  };

  const removeTagFromTask = (listId: string, taskId: string, tagId: string) => {
    setTaskLists(prev => 
      prev.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  tags: task.tags.filter(tag => tag.id !== tagId),
                  updatedAt: new Date()
                };
              }
              return task;
            })
          };
        }
        return list;
      })
    );
  };

  const setTaskPriority = (listId: string, taskId: string, priority: Priority) => {
    setTaskLists(prev => 
      prev.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  priority,
                  updatedAt: new Date()
                };
              }
              return task;
            })
          };
        }
        return list;
      })
    );
  };

  const setTaskDueDate = (listId: string, taskId: string, dueDate: Date | undefined) => {
    setTaskLists(prev => 
      prev.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  dueDate,
                  updatedAt: new Date()
                };
              }
              return task;
            })
          };
        }
        return list;
      })
    );
  };

  const setTaskEmailReminder = (listId: string, taskId: string, email: string | undefined) => {
    setTaskLists(prev => 
      prev.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  emailReminder: email,
                  reminderSent: false,
                  updatedAt: new Date()
                };
              }
              return task;
            })
          };
        }
        return list;
      })
    );
  };

  const value = {
    taskLists,
    allTags,
    addTaskList,
    updateTaskList,
    deleteTaskList,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    moveTask,
    addTag,
    deleteTag,
    updateTag,
    addTagToTask,
    removeTagFromTask,
    setTaskPriority,
    setTaskDueDate,
    setTaskEmailReminder,
    sendEmailReminder,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
