const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, '할 일 내용을 입력해 주세요.'],
      trim: true,
      maxlength: [500, '할 일은 500자까지 입력할 수 있습니다.'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Todo', todoSchema);
