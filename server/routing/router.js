

import express from "express"
import {UserController,Getting,Mittaro,loogin,ProxyLogin, ProxyQuestions,ProxyTestPaper} from "../controller/user-controller.js"


const router = express.Router();

router.post("/quests",UserController);
router.get("/quest",Getting);
router.post("/registerbhejo",Mittaro);
//router.post("/login-local", loogin);
//router.post("/login", loogin);
router.post("/login", ProxyLogin);
//router.post("/questions",ProxyQuestions);
//router.get("/questions/:paperId", ProxyQuestions);
//router.post("/questions2",ProxyQuestions2);
router.get("/testpaper/:paperId", ProxyTestPaper);
router.get("/questions/:paperId", ProxyQuestions);

//router.get('/answer',Hamare)
export default router;