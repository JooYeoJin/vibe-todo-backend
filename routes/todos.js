const express = require('express');
const mongoose = require('mongoose');
const Todo = require('../models/Todo');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: '할 일 목록을 불러오지 못했습니다.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, completed } = req.body;

    if (title === undefined || title === null) {
      return res.status(400).json({ message: '할 일 내용을 입력해 주세요.' });
    }

    const todo = await Todo.create({
      title,
      ...(completed !== undefined && { completed }),
    });

    res.status(201).json(todo);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)
        .map((e) => e.message)
        .join(' ');
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: '할 일 생성에 실패했습니다.' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { title, completed } = req.body;

    if (title === undefined && completed === undefined) {
      return res.status(400).json({ message: '수정할 내용을 입력해 주세요.' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: '잘못된 할 일 ID입니다.' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (completed !== undefined) updates.completed = completed;

    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({ message: '할 일을 찾을 수 없습니다.' });
    }

    res.json(todo);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)
        .map((e) => e.message)
        .join(' ');
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: '할 일 수정에 실패했습니다.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: '잘못된 할 일 ID입니다.' });
    }

    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: '할 일을 찾을 수 없습니다.' });
    }

    res.json({ message: '할 일이 삭제되었습니다.', todo });
  } catch (err) {
    res.status(500).json({ message: '할 일 삭제에 실패했습니다.' });
  }
});

module.exports = router;
