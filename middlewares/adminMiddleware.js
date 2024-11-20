const adminMiddleware = async (context, next) => {
  const user = await context.state.session.get("user");
  if (user) {
    context.user = user;
  }
  if (!user || !user.admin) {
    context.response.status = 403;
    context.response.body = "Access denied";
    return;
  }

  await next();
};

export { adminMiddleware };
