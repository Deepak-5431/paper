import express from "express"
import {ProxyLogin,ProxySubmitTest, ProxyQuestions,ProxyTestPaper,ProxyAllTestPapers,ProxySaveAnswer} from "../controller/user-controller.js"


const router = express.Router();


router.post("/login", ProxyLogin);
router.get("/testpaper/:paperId", ProxyTestPaper);
router.get("/questions/:paperId", ProxyQuestions);
router.get("/testpapers", ProxyAllTestPapers);
router.post('/testpaper/questions/:paperId', ProxySaveAnswer); 
router.post('/submit/:paperId', ProxySubmitTest);

export default router;