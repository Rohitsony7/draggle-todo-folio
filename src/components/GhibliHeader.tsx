
import React from "react";
import { useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const GhibliHeader: React.FC = () => {
  const { addTaskList } = useTaskContext();
  const [newListName, setNewListName] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleAddList = () => {
    if (newListName.trim()) {
      addTaskList(newListName);
      setNewListName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <header className="p-6 bg-white/40 backdrop-blur-sm shadow-sm rounded-b-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="inline-block animate-float">🌸</span> Ghibli Tasks
          </h1>
          <p className="text-gray-600">Organize your tasks with a touch of magic</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ghibli-sky hover:bg-ghibli-sky/90">
              <Plus className="h-4 w-4 mr-2" /> New List
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="List name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="ghibli-input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddList();
                }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddList} className="bg-ghibli-sky hover:bg-ghibli-sky/90">
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default GhibliHeader;
