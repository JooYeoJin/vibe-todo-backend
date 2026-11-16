const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
require('./models/Todo');
const todoRouter = require('./routes/todos');

const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000; // Heroku 사용시 포트번호 자동으로 설정
const MONGODB_URI = (
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo'
).trim();

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      // Windows/Node에서 IPv6로 시도 시 Atlas 접속 실패하는 경우 방지 (Compass는 IPv4 사용)
      family: 4,
    });
    console.log('연결 성공');

    app.use(cors());
    app.use(express.json());
    app.use('/todos', todoRouter); // 도메인 뒤에 /todos 붙여서 사용

    const server = app.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `포트 ${PORT}이(가) 이미 사용 중입니다. 기존 서버를 끄거나(Ctrl+C) 다른 터미널의 node를 종료한 뒤 다시 실행하세요.`
        );
        process.exit(1);
      }
      throw err;
    });
  } catch (err) {
    console.error('MongoDB 연결 실패:', err.message);
    process.exit(1);
  }
}

start();
