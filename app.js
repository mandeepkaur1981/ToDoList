const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid/v4");
var date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public")) //shared folder for static files
mongoose.connect('mongodb://localhost:27017/todoListDB', {useNewUrlParser: true, useUnifiedTopology: true});


const listSchema = new mongoose.Schema({
    pageType:String,
    listItems:String
});
const List = mongoose.model('List', listSchema);





var items = [];
var workItems = [];
    var day = date(); 
app.get("/", function(req, res){
    item=[];
    console.log("in GET");
    var page = "Home";
    List.find({pageType:page},function(err, todos){
        if(err){
            
            console.log("Home items not found");
        }
        else{
            items=todos;
            console.log("Items here:");
            console.log(items);
            res.render("list", {pageSelected:page, dayOfWeek:day, newListItem:items});
        }
    });

    
});
app.get("/work", function(req, res){
    var page = "Work";
    List.find({pageType:page},function(err, todos){
        if(err){
            console.log("Work items not found");
            
        }
        else{
            items=todos;
            res.render("list", {pageSelected:page, dayOfWeek:day, newListItem:items});
        }
    });
    
});
app.get("/contact", function(req, res){
    
    res.render("contact");
});
app.post("/", function(request, response){

    var item = request.body.addItem;

    if(validate(String(item).trim())){
        if(request.body.pageSubmit === "Work"){
            List.insertMany([{pageType:"Work", listItems:item}], function(err){
                if(err){
                    console.log("Error in inserting Work item");

                }
                else{
                    console.log("Inserted successfully", item);
                    response.redirect("/work");
                }
            })

            
        }
        else{
            List.insertMany([{pageType:"Home", listItems:item}], function(err){
                if(err){
                    console.log("Error in inserting Home item");

                }
                else{
                    console.log("Inserted successfully", item);
                    response.redirect("/");
                }
            })

            
        }
        
    };    
});
app.post("/remove", function(request, response){
    var values = request.body.remove.split("*");
    var item = values[1];
    if(values[0] === "Work"){
        List.deleteOne({_id:item}, function(err){
            if(err){
                console.log("Error in deleting Work item");

            }
            else{
                console.log("Deleted successfully", item);
                response.redirect("/work");
            }
        });

        
    }
    else{
        List.deleteOne({_id:item}, function(err){
            if(err){
                console.log("Error in deleting Work item");

            }
            else{
                console.log("Deleted successfully", item);
                response.redirect("/");
            }
        });

        
    }
});


function validate(item){
    let valid = false;
    if(item.length > 0)
        valid = true;
    else
        valid = false;

    if(items.indexOf(item) === -1 && valid)
    valid = true;
    else
    valid = false;

    return valid;
}

app.listen(process.env.PORT || 4000, function(){
    console.log("My app is listening on port 3000. Click the link http://localhost:4000 to access.");
})