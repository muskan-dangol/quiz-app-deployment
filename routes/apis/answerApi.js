import * as answerOptionService from "../../services/answerOptionService.js";

const checkAnswer = async ({ response, request }) => {
  try {
    const body = await request.body().value;

    const { questionId, optionId } = body;

    if (!questionId || !optionId) {
      response.status = 400;
      response.body = {
        error: "Invalid input. 'questionId' and 'optionId' are required.",
      };
      return;
    }

    const isCorrect = await answerOptionService.checkAnswer(
      questionId,
      optionId
    );

    response.body = { correct: isCorrect };
  } catch (error) {
    response.status = 500;
    response.body = {
      error: "An error occurred while processing the request.",
    };
  }
};

export { checkAnswer };
