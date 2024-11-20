import { sql } from "../database/database.js";

const getQuestionAnswersByOptionId = async (optionId) => {
  await sql`SELECT * FROM question_answers WHERE question_answer_option_id  = ${optionId}`;
};

const deleteQuestionAnswersByOptionId = async (optionId) => {
  await sql`DELETE FROM question_answers WHERE question_answer_option_id  = ${optionId}`;
};

const storeUserAnswer = async (userId, questionId, optionId) => {
  await sql`INSERT INTO question_answers (user_id, question_id, question_answer_option_id )
    VALUES (${userId}, ${questionId}, ${optionId})`;
};



export {
  getQuestionAnswersByOptionId,
  deleteQuestionAnswersByOptionId,
  storeUserAnswer,
};
