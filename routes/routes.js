import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as questionController from "./controllers/questionController.js";
import * as answerOptionsController from "./controllers/answerOptionsController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import * as quizController from "./controllers/quizController.js";
import * as questionsApi from "./apis/questionsApi.js";
import * as answerApi from "./apis/answerApi.js";

import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics", adminMiddleware, topicController.listTopics);
router.post("/topics", topicController.addTopic);
router.post("/topics/:id/delete", topicController.deleteTopic);

router.get("/topics/:id", questionController.showQuestionForm);
router.post("/topics/:id/questions", questionController.addQuestion);
router.post(
  "/topics/:tId/questions/:qId/delete",
  questionController.deleteQuestionById
);

router.get(
  "/topics/:id/questions/:qId",
  answerOptionsController.showAnswerOptionForm
);
router.post(
  "/topics/:id/questions/:qId/options",
  answerOptionsController.addAnswerOption
);
router.post(
  "/topics/:tId/questions/:qId/options/:oId/delete",
  answerOptionsController.deleteAnswerOptionsById
);

router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);

router.get("/quiz", quizController.listQuizTopics);
router.get("/quiz/:id", quizController.startQuiz);
router.get("/quiz/:id/questions/:qId", quizController.showQuizQuestion);
router.post(
  "/quiz/:tId/questions/:qId/options/:oId",
  quizController.SubmitAnswerOptions
);
router.get("/quiz/:tId/questions/:qId/correct", quizController.showCorrectPage);
router.get(
  "/quiz/:tId/questions/:qId/incorrect",
  quizController.showIncorrectPage
);

router.get("/api/questions/random", questionsApi.getRandomQuestion);
router.post("/api/questions/answer", answerApi.checkAnswer);

export { router };
