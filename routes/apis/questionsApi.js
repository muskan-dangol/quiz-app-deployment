import * as questionService from "../../services/questionService.js";

const getRandomQuestion = async ({ response }) => {
  const question = await questionService.getRandomQuestion();

  if (!question) {
    response.status = 404;
    response.body = { error: "No questions available" };
    return;
  }

  response.body = {
    questionId: question.id,
    questionText: question.question_text,
    answerOptions: question.answerOptions.map((option) => ({
      optionId: option.id,
      optionText: option.option_text,
    })),
  };
};

export { getRandomQuestion };