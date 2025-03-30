
import React, { useState } from "react";
import { Tag } from "@/types";
import { useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tag as TagIcon, Plus, Edit, Trash } from "lucide-react";

const TagManager: React.FC = () => {
  const { allTags, addTag, updateTag, deleteTag } = useTaskContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#b0d8b2");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName, newTagColor);
      setNewTagName("");
      setNewTagColor("#b0d8b2");
      setIsAddDialogOpen(false);
    }
  };

  const handleEditTag = () => {
    if (editingTag && newTagName.trim()) {
      updateTag(editingTag.id, newTagName, newTagColor);
      setIsEditDialogOpen(false);
      setEditingTag(null);
    }
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTag = (tagId: string) => {
    deleteTag(tagId);
  };

  // Ghibli-inspired color options
  const colorOptions = [
    { name: "Sky", value: "#a8d8ea" },
    { name: "Forest", value: "#b0d8b2" },
    { name: "Field", value: "#f6e7a3" },
    { name: "Blossom", value: "#f2c4c4" },
    { name: "Earth", value: "#d8b78e" },
  ];

  return (
    <div className="ghibli-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center">
          <TagIcon className="h-4 w-4 mr-2" />
          Tags
        </h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-ghibli-sky hover:bg-ghibli-sky/90">
              <Plus className="h-4 w-4 mr-1" /> Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Tag</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="ghibli-input"
              />
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-8 h-8 rounded-full ${
                        newTagColor === color.value
                          ? "ring-2 ring-offset-2 ring-ghibli-sky"
                          : ""
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setNewTagColor(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTag} className="bg-ghibli-sky hover:bg-ghibli-sky/90">
                Add Tag
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {allTags.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {allTags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-2 rounded-lg"
                style={{ backgroundColor: tag.color + "30" }}
              >
                <div className="flex items-center">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span>{tag.name}</span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => openEditDialog(tag)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">No tags created yet</div>
        )}
      </div>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          {editingTag && (
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="ghibli-input"
              />
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-8 h-8 rounded-full ${
                        newTagColor === color.value
                          ? "ring-2 ring-offset-2 ring-ghibli-sky"
                          : ""
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setNewTagColor(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTag} className="bg-ghibli-sky hover:bg-ghibli-sky/90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagManager;
