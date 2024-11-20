import { sql } from "../database/database.js";

const addTopic = async (userId, name) => {
  await sql`INSERT INTO topics (user_id, name) VALUES (${userId},${name})`;
};

const listTopics = async () => {
  const rows = await sql`SELECT * FROM topics ORDER BY name ASC`;
  return rows;
};

const getTopicById = async (topicId) => {
  const rows = await sql`SELECT * FROM topics WHERE id =${topicId}`;
  return rows[0];
};

const deleteTopicById = async (topicId) => {
  // Step 1: Delete answers related to the topic
  await sql`
    DELETE FROM question_answers
    WHERE question_id IN (
      SELECT id FROM questions WHERE topic_id = ${topicId}
    )
  `;

  // Step 2: Delete answer options related to the topic
  await sql`
    DELETE FROM question_answer_options
    WHERE question_id IN (
      SELECT id FROM questions WHERE topic_id = ${topicId}
    )
  `;

  // Step 3: Delete questions related to the topic
  await sql`
    DELETE FROM questions WHERE topic_id = ${topicId}
  `;

  // Step 4: Delete the topic itself
  await sql`
    DELETE FROM topics WHERE id = ${topicId}
  `;
};

export { addTopic, listTopics, getTopicById, deleteTopicById };
