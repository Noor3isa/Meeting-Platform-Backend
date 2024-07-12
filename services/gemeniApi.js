require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
const path = require('path');


const getResponse = async(prompt, image)=>{
    try{const result = await model.generateContent([prompt, image]);
    const response = await result.response;
    const text = response.text();
    // console.log(text);
    return text;
    } catch(err){
        console.log("error getting response from model " + err);
    }
}
const getJsonInference = async(response)=>{
    try{
        let jsonstr = response;
        jsonstr = jsonstr.split('\n')[1];
        jsonstr = jsonstr.replace(/'/g, '"');
        console.log(jsonstr);
        const newData = JSON.parse(jsonstr);
        console.log("parsed json inference!");
        return newData;

    }catch(err){
        console.log("parsing json error " + err)
    }
}

module.exports = { getResponse, getJsonInference};