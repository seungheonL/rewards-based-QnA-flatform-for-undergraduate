import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config.js';
import authRouter from './router/auth.js';
import * as listController from './controller/listController.js';
import { Course, Department, Question } from './database/mongodb.js';
import { isAuth } from './middleware/auth.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.get('/departments', listController.getDepartments);
app.get('/courses', listController.getCourses);
app.post('/questions', isAuth, (req, res) => {
  const { email } = req.decoded;
  const { title, content } = req.body;

  Question.create({
    writer: email,
    title,
    content,
  });

  res.json({
    message: 'success',
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '프론트의 신 변찬혁..',
  });
});

app.get('/test', async (req, res) => {});

app.listen(config.SERVER_PORT, () => {
  console.log(`server is running on port ${config.SERVER_PORT}`);
});
