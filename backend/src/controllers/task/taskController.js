import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/TaskModel.js";
import { uploadImage, deleteImage } from "../../helpers/imageUpload.js";

export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!description || description.trim() === "") {
      return res.status(400).json({ message: "Description is required" });
    }

    const images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadImage(file, "task_images");
        images.push({ url: result.url, publicId: result.publicId });
      }
    }

    const task = new TaskModel({
      title,
      description,
      dueDate,
      priority,
      status,
      images,
      user: req.user._id,
    });

    await task.save();

    res.status(201).json({ message: "Task created successfully", task });
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
    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks: tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting tasks" });
  }
});

export const getTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "User  is not logged in" });
    }

    if (!id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!task.user.equals(userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this task" });
    }

    res.status(200).json({ message: "Task fetched successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting task" });
  }
});

export const updateTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, description, dueDate, priority, status, completed } =
      req.body;

    if (!userId) {
      return res.status(401).json({ message: "User is not logged in" });
    }

    if (!id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!task.user.equals(userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this task" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.completed = completed || task.completed;

    // Handle image updates
    if (req.files && req.files.length > 0) {
      // Delete existing images
      for (const image of task.images) {
        await deleteImage(image.publicId);
      }

      // Upload new images
      const newImages = [];
      for (const file of req.files) {
        const result = await uploadImage(file, "task_images");
        newImages.push({ url: result.url, publicId: result.publicId });
      }
      task.images = newImages;
    }

    await task.save();

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating task" });
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "User is not logged in" });
    }

    if (!id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!task.user.equals(userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this task" });
    }

    // Delete images from Cloudinary
    for (const image of task.images) {
      await deleteImage(image.publicId);
    }

    await TaskModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting task" });
  }
});