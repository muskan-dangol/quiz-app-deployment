import { sql } from "../database/database.js";

const addAnswerOptions = async (questionId, optionText, isCorrect) => {
  await sql`INSERT INTO question_answer_options (question_id, option_text, is_correct ) VALUES (${questionId}, ${optionText}, ${isCorrect})`;
};

const getAnswerOptionsByQuestionId = async (questionId) => {
  const query =
    await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId}`;
  return query;
};

const deleteAnswerOptionsById = async (optionId) => {
  await sql`DELETE FROM question_answer_options WHERE id = ${optionId}`;
};

const getAnswerOptionById = async (optionId) => {
  const result =
    await sql`SELECT * FROM question_answer_options WHERE id =${optionId}`;
  return result[0];
};

const getCorrectAnswerForQuestion = async (questionId) => {
  const result =
    await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId} AND is_correct = ${true}`;
  return result[0];
};

const checkAnswer = async (questionId, optionId) => {
  const result = await sql`
  SELECT is_correct
  FROM question_answer_options
  WHERE id = ${optionId} AND question_id = ${questionId}
`;

  return result.length > 0 ? result[0].is_correct : false;
};

export {
  addAnswerOptions,
  getAnswerOptionsByQuestionId,
  deleteAnswerOptionsById,
  getAnswerOptionById,
  getCorrectAnswerForQuestion,
  checkAnswer,
};
