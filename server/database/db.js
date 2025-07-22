

import mongoose from "mongoose";

const URL = "mongodb+srv://couldmongo:cloudmongo@cluster0.chouc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const Connection = async () => {
  try{
     await mongoose.connect(URL);
      console.log("connection is successfull");
  }catch(error){
    console.log("error will be catched here",error);
  }
}

export default Connection;