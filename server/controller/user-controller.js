
import axios from "axios";


import { praninam,student } from "../Schema.js";



export const UserController = async (req, res) => {
  try {
    const saved = await praninam.insertMany(req.body);
    return res.status(201).json({ message: "Questions saved", data: saved });
  } catch (error) {
   return res.status(500).json({ error: "Failed to save questions", details: error });
  }
};


export const Getting = async (req, res) => {
 try{
     const questions = await praninam.find();
     return res.status(200).json({message:"questions are fetching successfully",questions: questions})
 }catch(error){
      return res.status(500).json({error: "failed to catch questions"})
 }

}


export const Mittaro = async (req,res) => {
  try{
    const hold = await student.create(req.body);
   return res.status(200).json({message:"data ja rha hai"});
  }catch(error){
    return  res.status(500).json({error:"messed up bad"})
  }
}





export const loogin = async( req,res) => {
  const {username,password} = req.body;
  try{
    const user = await student.findOne({username});
    if(!user){
      return res.status(404).json({message:"user not found"})
    }
      if(!user || user.password != password){
        return res.status(401).json({message:'messed up maybe incorrect password'});
      }
      return res.status(200).json({message:"user logged in succesfully",username: user.username});
  }catch(error){
      return res.status(500).json({error:"fix this is the error right"});
  }
}

const API_BASE_URL = "https://iblib.com/api";
const API_BASE2_URL = "https://test.iblib.com/api";
const DEFAULT_HEADERS = (req) => ({
  'Authorization': req.headers.authorization || '',
  'Accept': 'application/json',
  'User-Agent': req.headers['user-agent'] || 'Node-Proxy-Client',
  'Content-Type': 'application/json',
});


export const ProxyLogin = async (req, res) => {
  try {
    const { data } = await axios.post(`${API_BASE2_URL}/login`, req.body, { 
      headers: DEFAULT_HEADERS(req) 
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Proxy login failed",
      details: error.message,
    });
  }
};

export const ProxyTestPaper = async (req, res) => {
  try {
    const { data } = await axios.get(
      `${API_BASE2_URL}/study/testpaper/${req.params.paperId}`, 
      { headers: DEFAULT_HEADERS(req) }
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({ 
      message: "Failed to fetch test paper details" 
    });
  }
};


export const ProxyQuestions = async (req, res) => {
  try {
    const { data } = await axios.get(
      `${API_BASE2_URL}/study/testpaper/questions/${req.params.paperId}`, 
      { headers: DEFAULT_HEADERS(req) }
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Proxy question fetch failed",
    });
  }
};


export const ProxyAllTestPapers = async (req, res) => {
  try {
    const { data } = await axios.get(
      `${API_BASE2_URL}/study/testpapers/`, 
      { headers: DEFAULT_HEADERS(req) }
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: "Failed to fetch all test papers",
    });
  }
};

export const ProxySaveAnswer = async (req, res) => {
  try {
    const { data } = await axios.post(
      `${API_BASE2_URL}/study/testpaper/questions/${req.params.paperId}`,
      req.body,
      { headers: DEFAULT_HEADERS(req) }
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: "Failed to save answer",
      details: error.response?.data || error.message,
    });
  }
};




