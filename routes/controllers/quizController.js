import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as answerOptionService from "../../services/answerOptionService.js";
import * as userService from "../../services/userService.js";
import * as questionAnswerService from "../../services/questionAnswerService.js";


const listQuizTopics = async ({ render, state }) => {
  const user = await state.session.get("user");
  render("quizTopic.eta", {
    availableTopics: await topicService.listTopics(),
    isAdmin: user && user.admin,
  });
};

const startQuiz = async ({ params, response, render }) => {
  const topicId = params.id;
  try {
    if (await questionService.getQuestionsByTopicId(topicId)) {
      const questions = await questionService.getQuestionsByTopicId(topicId);
      const randomIndex = Math.floor(Math.random() * questions.length);
      const randomQuestion = questions[randomIndex];

      response.redirect(`/quiz/${topicId}/questions/${randomQuestion.id}`);
    }
  } catch (error) {
    render("no_questions.eta", { topicId });
    return;
  }
};

const showQuizQuestion = async ({ params, render }) => {
  const { id: topicId, qId: questionId } = params;
  const question = await questionService.getQuestionById(questionId);
  const topic = await topicService.getTopicById(topicId);
  const options = await answerOptionService.getAnswerOptionsByQuestionId(
    questionId
  );
  render("quiz_question.eta", {
    topic,
    question,
    options,
  });
};

const SubmitAnswerOptions = async ({ params, response, state }) => {
  const { tId: topicId, qId: questionId, oId: optionId } = params;
  const user = await state.session.get("user");
  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const userId = user.id;
  try {
    const answerOption = await answerOptionService.getAnswerOptionById(
      optionId
    );
    if (!answerOption) {
      response.status = 400;
      response.body = "Invalid answer option!";
      return;
    }
    await questionAnswerService.storeUserAnswer(userId, questionId, optionId);

    if (answerOption.is_correct) {
      response.redirect(`/quiz/${topicId}/questions/${questionId}/correct`);
    } else {
      const correctAnswer =
        await answerOptionService.getCorrectAnswerForQuestion(questionId);
      response.redirect(`/quiz/${topicId}/questions/${questionId}/incorrect`);
    }
  } catch (error) {
    console.error("Error Submitting answer option:", error);
    response.status = 500;
  }
};

const showCorrectPage = async ({ params, render }) => {
  const { tId: topicId } = params;
  render("correctAnswer.eta", { topicId });
};

const showIncorrectPage = async ({ params, render, request }) => {
  const { tId: topicId, qId: questionId } = params;
  const correctAnswer = await answerOptionService.getCorrectAnswerForQuestion(
    questionId
  );

  render("incorrect.eta", { topicId, correctAnswer });
};

export {
  listQuizTopics,
  startQuiz,
  showQuizQuestion,
  SubmitAnswerOptions,
  showCorrectPage,
  showIncorrectPage,
};
