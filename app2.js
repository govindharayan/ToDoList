const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");
const mongodbUrl = process.env.MONGODB_URL || 'mongodb+srv://text:Gaurav1102@cluster0.rdvefwg.mongodb.net/toDoListDB?retryWrites=true&w=majority';
mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connection made successfully");
}).catch(error=> {
    console.log(error);
})

//mongoose.connect('mongodb+srv://text:Gaurav1102@cluster0.rdvefwg.mongodb.net/?retryWrites=true&w=majority/toDoListDB');

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name: "Welcome to your todoList!"
})

const item2 = new Item({
    name: "Hit the + button to add a new item"
})

const item3 = new Item({
    name: "<-- Hit this to delete an item."
})

const date = require(__dirname + "/date.js");
const day = date.getDay();
const defaultItems = [item1,item2,item3];


const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
})


const List = mongoose.model("List", listSchema);
//var items=["Buy Food","Cook Food","Eat Food"];
var workItems=[];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));


app.use(express.static("public"));
app.get("/", function(req,res){
    Item.find().then(foundItems => {
        if(foundItems.length==0) {
            Item.insertMany(defaultItems).then(()=>{
    
                console.log("successfully inserted default items");
            }).catch(error=> {
                console.log(error);
            })
            res.redirect("/");
        }
        
        else {
            console.log(foundItems);
            
            console.log(day);
            res.render("lists", {listTitle: day, newListItem: foundItems});
            //res.render("home",{homeContent:homeContent, posts: foundItems});
        }
        
        
            
    }).catch(error => {
        console.log(error);
    }); 
    
})

app.get("/:customListName",function(req,res){
    
    const customListName = _.capitalize(req.params.customListName);
    if(customListName == day) {
        res.redirect("/");
    }
    else {
        List.findOne({name: customListName}).then(foundList=>{
            console.log(customListName);
            console.log(foundList); 
            if(foundList==null){
                const list1 = new List({
                    name: customListName,
                    items: defaultItems
                });
                list1.save().then(()=>{
                    console.log("successfully saved data into database")
                }).catch(error=>{
                    console.log(error);
                })
                res.redirect("/" + customListName);
    
            }
            else {
                
                res.render("lists", {
                    listTitle: foundList.name,
                    newListItem: foundList.items
               });
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

})






app.post("/",function (req,res){
    const item = req.body.newItem;
    const listName = req.body.list;
    const newIt = new Item ({
        name: item
    })
    
    if(listName == day ) {
        newIt.save().then(()=>{
            console.log("successfully saved data into database");
        }).catch(error=>{
            console.log(error);
        })
        res.redirect("/" + listName);  
    } else {
        List.findOne({name: listName}).then(foundList=>{
            foundList.items.push(newIt);
            foundList.save().then(()=>{
                console.log("successfully saved data into database");
            }).catch(error=>{
                console.log(error);
            })
            res.redirect("/" + listName);
        }).catch(error=>{
            console.log(error);
        })
    }

    
    // if(req.body.list==="Work") {
    //     workItems.push(newIt);
    //     res.redirect("/work")
    // }
    // items.push(item);
      
}) 

// app.get("/work",function(req,res) {
//     res.render("lists",{listTitle: "Work List",newListItem: workItems});
// })

app.get("/about",function(req,res){
    res.render("about");
}) 

app.post("/delete",function(req,res){
    const toDeleteID = req.body.delname;
    const delRoute = req.body.listTitle;
    console.log(toDeleteID);
    console.log(delRoute);
    if (delRoute == day) {
        Item.findByIdAndDelete(toDeleteID).then(()=>{
            console.log("successfully deleted by id");
        }).catch(error =>{
            console.log(error);
        })
        res.redirect("/");
    }
    else {
        List.findOneAndUpdate({name: delRoute},{$pull: {items: {_id: toDeleteID}}} ).then(foundList => {
            console.log("deleted from custom route");
        }).catch(error=>{
            console.log(error);
        })
        res.redirect("/"+ delRoute)
    }
    
    


})
app.listen(3000, function () {
    console.log("server started on port 3000");
})
