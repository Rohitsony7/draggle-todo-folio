
import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useTaskContext } from "@/context/TaskContext";
import TaskList from "./TaskList";
import TagManager from "./TagManager";
import GhibliHeader from "./GhibliHeader";

const GhibliToDo: React.FC = () => {
  const { taskLists, moveTask } = useTaskContext();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Move task
    moveTask(
      source.droppableId,
      source.index,
      destination.droppableId,
      destination.index
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <GhibliHeader />
      
      <div className="container mx-auto px-4 py-8 flex-1 max-w-7xl">
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex space-x-4 overflow-x-auto pb-4 pt-2 items-start min-h-[70vh]">
                {taskLists.map((list) => (
                  <TaskList key={list.id} list={list} />
                ))}
              </div>
            </DragDropContext>
          </div>
          
          <div className="w-full xl:w-64 mt-6 xl:mt-0">
            <TagManager />
            
            {/* Ghibli decorative elements */}
            <div className="mt-6 ghibli-card p-4 text-center relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 w-24 h-24 opacity-20 animate-gentle-spin">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50,20 A30,30 0 1,1 50,80 A30,30 0 1,1 50,20 Z" fill="none" stroke="#b0d8b2" strokeWidth="4"/>
                  <circle cx="50" cy="35" r="8" fill="#a8d8ea"/>
                  <circle cx="50" cy="65" r="8" fill="#f2c4c4"/>
                </svg>
              </div>
              <div className="relative">
                <h3 className="font-medium text-gray-800 mb-2">Ghibli Tasks</h3>
                <p className="text-sm text-gray-600">Organize your tasks with the magic of Ghibli</p>
              </div>
            </div>
            
            <div className="mt-6 text-xs text-center text-gray-500">
              Inspired by the enchanting worlds of Studio Ghibli
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GhibliToDo;
