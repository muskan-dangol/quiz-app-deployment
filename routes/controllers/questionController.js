import * as questionService from "../../services/questionService.js";
import * as topicService from "../../services/topicService.js";
import { validasaur } from "../../deps.js";

const questionValidationRules = {
  question_text: [validasaur.required, validasaur.minLength(1)],
};

const getQuestionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    question_text: params.get("question_text"),
  };
};

const addQuestion = async ({ request, response, render, params, state }) => {
  const { id: topicId } = params;
  const user = await state.session.get("user");
  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const userId = user.id;
  const questionData = await getQuestionData(request);

  const [passes, errors] = await validasaur.validate(
    questionData,
    questionValidationRules
  );

  if (!passes) {
    questionData.validationErrors = errors;
   
    render("topic.eta", {
      topic: await topicService.getTopicById(topicId),
      availableQuestions: await questionService.getQuestionsByTopicId(topicId),
      ...questionData,
      isAdmin: true,
    });
  } else {
    await questionService.addQuestion(
      userId,
      topicId,
      questionData.question_text
    );
    response.redirect(`/topics/${topicId}`);
  }
};

const showQuestionForm = async ({ render, params }) => {
  const { id: topicId } = params;

  const topic = await topicService.getTopicById(topicId);
  if (!topic) {
    res.status(404).send({ message: "Topic not found" });
    return;
  }
  render("topic.eta", {
    topic,
    availableQuestions: await questionService.getQuestionsByTopicId(topicId),
    isAdmin: true,
  });
};

const deleteQuestionById = async ({ params, response }) => {
  const { tId: topicId, qId: questionId } = params;
  try {
    await questionService.deleteQuestionById(questionId);

    response.redirect(`/topics/${topicId}`);
  } catch (error) {
    console.error("Error deleting answer option:", error);
    response.status = 500;
  }
};

export { addQuestion, showQuestionForm, deleteQuestionById };
