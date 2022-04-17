const express = require("express")
const app = express();
const https = require("https");
const date =require(__dirname+"/date.js")

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs');
app.use(express.static("public"))

const newItemsList =["Buy food","Cook Food","Eat food"]
const workItemsList = []

app.get("/", function (req, res) {
    const today = date.getDate()
    res.render('index', {titleName: today, newItemsList: newItemsList})
})

app.listen("3000", function () {
    console.log("server is running on port 3000");
})


app.post("/",function (req,res) {
    console.log(req.body)
    if(req.body.list==='Work') {
        workItemsList.push(req.body.newItem)
        res.redirect("/work")
    }
    else{
        newItemsList.push(req.body.newItem)
        res.redirect("/")
    }
})

app.get("/work",function (req,res) {
    res.render('index',{titleName: "Work list", newItemsList:workItemsList})
})
