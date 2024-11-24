import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/TaskModel.js";

export const createTask = asyncHandler(async (req, res) => {

    try {
        const { title, description, dueDate, priority, status } = req.body;

        if (!title || title.trim() === "" ){
            res.status(400).json({ message: "Title is required" });
        }

        if (!description || description.trim() === "" ){
            res.status(400).json({ message: "Description is required" });
        }

        const task = new TaskModel({
            title,
            description,
            dueDate,
            priority,
            status,
            user: req.user._id,
        });

        await task.save();

        res.status(201).json({ message: "Task created successfully", task});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating task" });
    }
});

export const getTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "User  is not logged in" });
    }

    const tasks = await TaskModel.find({ user: userId });

    // Send a JSON response with a message and the tasks
    res.status(200).json({ message: "Tasks fetched successfully", tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting tasks" });
  }
});

