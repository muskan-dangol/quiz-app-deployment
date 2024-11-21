import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as questionAnswers from "../../services/questionAnswerService.js";

const showMain = async ({ render }) => {
  const topics = await topicService.listTopics();
  const topicLength = topics ? topics.length : 0;

  const questions = await questionService.getAllQuestion();
  const questionLength = questions ? questions.length : 0;

  const questionAnswersList = await questionAnswers.getAllQuestionAnswers();
  const questionAnswersLength = questionAnswersList
    ? questionAnswersList.length
    : 0;

  render("main.eta", {
    topicLength,
    questionLength,
    questionAnswersLength,
  });
};

export { showMain };
