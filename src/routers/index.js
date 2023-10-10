import BlogRouter from "./BlogRouter.js";


function routers(app) {
    app.use("/blog", BlogRouter);
}

export default routers;
