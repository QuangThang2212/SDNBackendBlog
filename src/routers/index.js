import AccountRouter from "./AccountRouter.js";
import BlogRouter from "./BlogRouter.js";


function routers(app) {
    app.use("/blog", BlogRouter);
    app.use("/accounts", AccountRouter);
    app.use("/topic", AccountRouter);
}

export default routers;
