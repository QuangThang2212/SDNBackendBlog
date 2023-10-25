import AccountRouter from "./AccountRouter.js";
import BlogRouter from "./BlogRouter.js";
import TopicRouter from "./TopicRouter.js";
import ProfileRouter from "./ProfileRouter.js";


function routers(app) {
    app.use("/blog", BlogRouter);
    app.use("/accounts", AccountRouter);
    app.use("/topic", TopicRouter);
    app.use("/users",ProfileRouter);
    
}

export default routers;
