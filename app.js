const express = require("express")
const app = express();
const https = require("https");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const _ = require("lodash")

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/toDoListDB")

const itemSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model("Item", itemSchema)

const Item1 = new Item({
        name: "Welcome to your ToDoList"
    }
)
const Item2 = new Item({
    name: "Hit the + button to add an item"
})
const Item3 = new Item({
        name: "Click the checkbox to delete an item"
    }
)

const defaultItems = [Item1, Item2, Item3]

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
})

const List = mongoose.model("List", listSchema)

app.get("/", function (req, res) {
    Item.find({}, function (err,foundItems) {
        if(err)
            console.log(err)
        else {
            if (foundItems.length === 0) {
                Item.insertMany(defaultItems, function (err) {
                    if (err)
                        console.log(err);
                    else
                        console.log("Successfully added default list to items collection");
                })
                res.redirect("/");
            } else
                res.render("index", {titleName: "Today", newItemsList: foundItems})
        }
    })
})

app.get("/:title",function(req,res){
    const newListTitle = _.capitalize(req.params.title)
    List.findOne({name: newListTitle},function (err,foundList) {
        if(err)
            console.log(err)
        else{
            if(!foundList){
                const newList = new List({
                    name: newListTitle,
                    items: defaultItems
                })
                newList.save();
                res.redirect("/"+newListTitle);
            }
            else
                res.render("index", {titleName: foundList.name, newItemsList:foundList.items})
        }
    })
})

app.post("/", function (req, res) {
    console.log(req.body.list)
    console.log(req.body.newItem)
    const item = new Item({
        name: req.body.newItem
    })
    console.log(item)
    if (req.body.list === "Today") {
        item.save();
        res.redirect("/")
    } else {
        List.findOne({name: req.body.list},function(err,foundList){
            console.log(foundList.items)
            foundList.items.push(item);
            foundList.save();
        })
        res.redirect("/" + req.body.list)
    }
})

app.post("/delete",function(req,res){
    const deleteID = req.body.checkbox;
    const listName = req.body.listName;
    if(listName==="Today"){
        Item.findByIdAndDelete(deleteID,function (err) {
            if(err)
                console.log(err)
            else
                res.redirect('/');
        })
    }
    else{
        List.findOneAndUpdate({name:listName},{$pull: {items: {_id: deleteID} }}, function (err,foundList) {
            if(!err)
                res.redirect("/"+listName)
        })
    }
})

app.listen("3000", function () {
    console.log("server is running on port 3000");
})



