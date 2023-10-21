import AccountRouter from "./AccountRouter.js";
import BlogRouter from "./BlogRouter.js";
import TopicRouter from "./TopicRouter.js";


function routers(app) {
    app.use("/blog", BlogRouter);
    app.use("/accounts", AccountRouter);
    app.use("/topic", TopicRouter);
}

export default routers;
