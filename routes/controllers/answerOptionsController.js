import * as answerOptionService from "../../services/answerOptionService.js";
import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as questionAnswerService from "../../services/questionAnswerService.js";

import { validasaur } from "../../deps.js";

const answerOptionValidationRules = {
  option_text: [validasaur.required, validasaur.minLength(1)],
};

const getAnswerOptionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    option_text: params.get("option_text"),
    is_correct: params.has("is_correct"),
  };
};

const addAnswerOption = async ({ request, response, render, params }) => {
  const { id, qId } = params;
  const answerOptionData = await getAnswerOptionData(request);

  const [passes, errors] = await validasaur.validate(
    answerOptionData,
    answerOptionValidationRules
  );

  if (!passes) {
    answerOptionData.validationErrors = errors;
    render("answerOption.eta", {
      ...answerOptionData,
      isAdmin: true,
      topicId: id,
      questionId: qId,
    });
  } else {
    await answerOptionService.addAnswerOptions(
      qId,
      answerOptionData.option_text,
      answerOptionData.is_correct
    );
    response.redirect(`/topics/${id}/questions/${qId}`);
  }
};

const showAnswerOptionForm = async ({ response, render, params, state }) => {
  const { id: topicId, qId: questionId } = params;
  const user = await state.session.get("user");
  if (!user) {
    response.redirect("/auth/login");
    return;
  }
  const isAdmin = user.admin;
  const topic = await topicService.getTopicById(topicId);
  const question = await questionService.getQuestionById(questionId);
  const answerOptions = await answerOptionService.getAnswerOptionsByQuestionId(
    questionId
  );
  console.log(answerOptions);

  render("answerOption.eta", {
    topic,
    question,
    isAdmin,
    answerOptions,
    option_text: "",
    is_correct: false,
  });
};

const deleteAnswerOptionsById = async ({ params, response }) => {
  const { tId: topicId, qId: questionId, oId: optionId } = params;
  try {
    await answerOptionService.deleteAnswerOptionsById(optionId);
    if (questionAnswerService.getQuestionAnswersByOptionId(optionId)) {
      await questionAnswerService.deleteQuestionAnswersByOptionId(optionId);
    }
    response.redirect(`/topics/${topicId}/questions/${questionId}`);
  } catch (error) {
    console.error("Error deleting answer option:", error);
    response.status = 500;
  }
};

export { addAnswerOption, showAnswerOptionForm, deleteAnswerOptionsById };
