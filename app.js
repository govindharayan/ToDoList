const express = require("express");
const app = express();
app.set('view engine', 'ejs');


app.get("/", function (req, res) {
    var today = new Date();
    var currentDay = today.getDay();
    var day = "";
    switch (currentDay) {
        case 0:
            day = "Sunday"
            break;
        case 1:
            day = "Monday"
            break;
        case 2:
            day = "Tuesday"
            break;
        case 3:
            day = "Wednesday"
            break;
        case 4:
            day = "Thrusday"
            break;
        case 5:
            day = "Friday"
            break;
        case 6:
            day = "Saturday"
            break;

        default:
            console.log("error" + currentDay);
            break;
    }
    res.render("lists", {
        KindOfDay: day
    });


})


app.listen(8000, function () {
    console.log("server started on port 3000");
})