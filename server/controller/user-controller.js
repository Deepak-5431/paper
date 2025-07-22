
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


export const ProxyLogin = async (req, res) => {
  try {
    const { data } = await axios.post("https://iblib.com/api/login", req.body); 
    return res.status(200).json(data);
    // console.log(" here is the response:", data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Proxy login failed",
      details: error.message,
    });
  }
};



export const ProxyTestPaper = async (req, res) => {
  try {
    const { paperId } = req.params;
    const url = `https://test.iblib.com/api/study/testpaper/${paperId}`;

    const forwardedHeaders = {
      'Authorization': req.headers.authorization,
      'User-Agent': req.headers['user-agent'] || 'Node-Proxy-Client',
    };

    // --- Start of Debugging Logs ---
  //  console.log("\n----- Proxying Request -----");
  //  console.log("Function: ProxyTestPaper");
  //  console.log("Paper ID:", paperId);
  //  console.log("Target URL:", url);
  //  console.log("Forwarded Headers:", forwardedHeaders);
    // --- End of Debugging Logs ---
    
    const { data } = await axios.get(url, {
      headers: forwardedHeaders
    });

    return res.status(200).json(data);

  } catch (error) {
    console.error("ProxyTestPaper Error:", error.message);
    return res.status(error.response?.status || 500).json({ 
      message: "Failed to fetch test paper details" 
    });
  }
};


export const ProxyQuestions = async (req, res) => {
  try {
    const { paperId } = req.params;
    const url = `https://test.iblib.com/api/study/testpaper/questions/${paperId}`;

    const forwardedHeaders = {
      'Authorization': req.headers.authorization,
      'Accept': 'application/json',
      'User-Agent': req.headers['user-agent'] || 'Node-Proxy-Client',
    };

    
   // console.log("\n----- Proxying Request -----");
    //  console.log("Function: ProxyQuestions");
   // console.log("Paper ID:", paperId);
   // console.log("Target URL:", url);
   // console.log("Forwarded Headers:", forwardedHeaders);
   

    const { data } = await axios.get(url, {
      headers: forwardedHeaders
    });

    return res.status(200).json(data);

  } catch (error) {
    console.error("ProxyQuestions Error:", error.message);
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Proxy question fetch failed",
    });
  }
};

