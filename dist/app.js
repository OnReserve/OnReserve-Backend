import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./Routes/routes.js";
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use("/api", router);
app.get("/", (req, res, next) => {
    res.send(`Server is running on port ${port}`);
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
//# sourceMappingURL=app.js.map