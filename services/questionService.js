import { sql } from "../database/database.js";

const getQuestionById = async (questionId) => {
  const result = await sql`SELECT * FROM questions WHERE id =${questionId}`;
  return result[0];
};

const getQuestionsByTopicId = async (topicId) => {
  const result = sql`SELECT * FROM questions WHERE topic_id = ${topicId}`;
  return result;
};

const addQuestion = async (userId, topicId, question) => {
  await sql`INSERT INTO questions (user_id, topic_id, question_text) VALUES (${userId}, ${topicId}, ${question})`;
};

const deleteQuestionById = async (questionId) => {
  await sql`DELETE FROM questions WHERE id = ${questionId}`;
};

const getRandomQuestion = async () => {
  const question = await sql`
    SELECT id, question_text
    FROM questions 
    ORDER BY RANDOM()
    LIMIT 1
  `;

  if (question.length === 0) {
    return null;
  }

  const questionId = question[0].id;

  const answerOptions = await sql`
    SELECT id, option_text
    FROM question_answer_options
    WHERE question_id = ${questionId}
  `;

  return {
    id: questionId,
    question_text: question[0].question_text,
    answerOptions,
  };
};

export {
  getQuestionById,
  getQuestionsByTopicId,
  addQuestion,
  deleteQuestionById,
  getRandomQuestion,
};
