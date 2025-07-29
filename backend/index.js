let express = require("express");
let dotenv = require("dotenv");
let { GoogleGenerativeAI } = require("@google/generative-ai");
let cors=require('cors')
let app = express();
app.use(express.json());
app.use(cors())
dotenv.config();
let API_Key="AIzaSyAABsw_dHMrrEx1Sa5S7mHCDf58AZhBY-I"
let genAI = new GoogleGenerativeAI(API_Key);
app.get("/", async (req, res) => {
  res.send("Hey AI Will Take Your JOB 🤷‍♂️");
});

app.post("/genrate", async (req, res) => {
    let {TopicName,TotalMarks,MarksForEachQuestion,QuestionType}=req.body;
    myPrompt=`Create a ${QuestionType} test of ${TotalMarks} marks on ${TopicName} where each question carries ${MarksForEachQuestion} marks. Format the output as a numbered list of questions.`
    console.log(myPrompt)
    let model= genAI.getGenerativeModel({model:"gemini-2.0-flash"});
    
    try {
        let response = await model.generateContent({
            contents:[{role:"user",parts:[{text:myPrompt}]}],
            generationConfig:{
                temperature:0.2,
                topK:1
            }
        });
        
        let AIresp = response.response.candidates[0].content.parts[0].text;
        
        res.status(201).json({
            success: true,
            ans: AIresp  // Changed from 'responce' to 'ans' to match frontend
        });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({
            success: false,
            error: "Failed to generate questions"
        });
    }
});

let PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log("Server started at:- http://localhost:" + PORT);
});
