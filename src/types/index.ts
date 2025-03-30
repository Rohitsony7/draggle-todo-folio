
export type Priority = 'low' | 'medium' | 'high';

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type Task = {
  id: string;
  content: string;
  completed: boolean;
  priority: Priority;
  tags: Tag[];
  dueDate?: Date;
  emailReminder?: string;
  reminderSent?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskList = {
  id: string;
  name: string;
  tasks: Task[];
};
