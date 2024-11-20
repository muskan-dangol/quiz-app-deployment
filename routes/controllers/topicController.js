import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as answerOptionService from "../../services/answerOptionService.js";
import { validasaur } from "../../deps.js";

const topicValidationRules = {
  name: [validasaur.required, validasaur.minLength(1)],
};

const getTopicData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    name: params.get("name"),
  };
};

const addTopic = async ({ request, response, render, state }) => {
  const topicData = await getTopicData(request);
  const user = await state.session.get("user");
  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const userId = user.id;
  const [passes, errors] = await validasaur.validate(
    topicData,
    topicValidationRules
  );

  if (!passes) {
    topicData.validationErrors = errors;
    render("topics.eta", {
      ...topicData,
      isAdmin: true,
    });
  } else {
    await topicService.addTopic(userId, topicData.name);
    response.redirect("/topics");
  }
};

const listTopics = async ({ render, state }) => {
  const user = await state.session.get("user");
  render("topics.eta", {
    availableTopics: await topicService.listTopics(),
    isAdmin: user && user.admin,
  });
};

const deleteTopic = async ({ params, response }) => {
  const topicId = params.id;
  try {
    await topicService.deleteTopicById(topicId);
    response.redirect("/topics");
  } catch (error) {
    console.error("Error deleting topic:", error);
    response.status = 500;
    response.body = "An error occurred while deleting the topic.";
  }
};

export { listTopics, addTopic, deleteTopic };
