var db = require("../models");
var path = require("path");

module.exports = function(app) {

    app.get("/form", function(req, res){
        res.sendFile(path.join(__dirname + "/../public/assets/form.html"));
    })

    // To retrive all donator cards from database
    app.get("/:id", function(req, res){
        
        db.RequestorCard.findAll({}).then(function (data) {
            var requestorCardObject = {
                requestorCards: data
            };
            // res.render("index2", requestorCardObject)
        
        db.DonatorCard.findAll({
            // order: db.DonatorCard.literal('enddate DESC')
            order: [['enddate', 'DESC']]
        }).then(function(result){
            console.log(result);
            donatorCard = {
                result: result
            }
            resultObj = {
                result: result,
                requestorCards: data
            }
            // console.log(donatorCard.result);
            console.log("MERGING RESULT OBJECTS");
            console.log(resultObj);
        res.render("index", resultObj);
    })
});
    })

    // Server side javascript to create a new donator card
    app.post("/api/new/donatorcard", function(req, res){

        db.DonatorCard.create({
            startdate: req.body.startDate,
            enddate: req.body.endDate,
            category: req.body.category,
            item: req.body.item,
            itemnumber: req.body.noOfItems,
            location: req.body.location,
            image: req.body.image
        }).then(function(result){
            res.json(result);
        }).catch(function(err){
            console.log(err);
        })
    })

        // Server side javascript to create a new request
        app.post("/api/new/request", function(req, res){
            console.log(req.body);
            console.log("Inside new request table");

            db.Request.create({
                amount:req.body.amount,
                UserId: req.body.userId,
                DonatorCardId: req.body.donatorCardId
            }).then(function(result){
                res.json(result);
            }).catch(function(err){
                console.log(err);
            })
        })

        // To update donatorCard table
        app.put("/api/donator/update/:id", function(req, res){
            var id = req.params.id;
            var amount = req.body.amount;

            console.log("CHECK");
            db.DonatorCard.findOne({
                where: {id: id}
            }).then(function(result){
                console.log("Find Onequery result");
                console.log(result.itemnumber);
                db.DonatorCard.update({
                    itemnumber: result.itemnumber - amount
                  }, {
                    where: {
                      id: id
                    }
                  })
            })

            
        })

        // To check number of items for a particular id
        app.get("/api/itemsnumber", function(req, res){
            db.DonatorCard.findAll({
            }).then(function(result){
                console.log("FIND ALL QUERY RESULT");
                console.log(result);
                console.log(result.itemnumber);
                res.send(result);
            })

        })

        // To delete when number of items is zero
        app.put("/api/delete/:id", function(req, res){
            var id = req.params.id;

            db.DonatorCard.destroy({
              where: {
                id: id
              }
            })
        })
}