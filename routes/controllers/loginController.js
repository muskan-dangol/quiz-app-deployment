import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

const processLogin = async ({ request, response, state, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  const userFormDatabase = await userService.findUserByEmail(
    params.get("email")
  );
  if (!userFormDatabase || userFormDatabase.length !== 1) {
    render("login.eta", { error: "Invalid email or password." });
    return;
  }

  const user = userFormDatabase[0];
  const passwordMatches = await bcrypt.compare(
    params.get("password"),
    user.password
  );

  if (!passwordMatches) {
    render("login.eta", { error: "Invalid email or password." });
    return;
  }

  await state.session.set("user", user);
  const currentUser = await state.session.get("user");
  if (currentUser.admin === true) {
    response.redirect("/topics");
  } else {
    response.redirect("/quiz");
  }
};

const showLoginForm = ({ render }) => {
  render("login.eta");
};

export { processLogin, showLoginForm };
