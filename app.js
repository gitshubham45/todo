
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
require('dotenv').config();


const app = express();

const mongoDBUrl =  'mongodb://127.0.0.1:27017/todolistDB';
mongoose.connect(mongoDBUrl);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const itemsSchema = {
    name: String
}

const Item = mongoose.model('Item', itemsSchema);


const item1 = new Item({
    name: "study"
});

const item2 = new Item({
    name: "eat"
});

const item3 = new Item({
    name: "sleep"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model('List', listSchema);


app.get('/', (req, res) => {
    Item.find()
        .then((items) => {
            if (items.length === 0) {
                Item.insertMany(defaultItems)
                    .then((items) => {
                        console.log(items);
                        console.log('Items added!');
                    }).catch((err) => {
                        console.log(err);
                    })
            }

            res.render('list', { listTitle: "Today", newListItems: items });

        }).catch((err) => {
            console.log(err);
        });
});



app.get('/:customListName', (req, res) => {

    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName })
        .then((foundList) => {
            if (foundList === null) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect('/' + customListName);

            } else {
                res.render('list', { listTitle: foundList.name, newListItems: foundList.items });
            }
        }).catch((err) => {
            console.log(err);
        });
});



app.post('/', function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        const savedItem = itemName;
        item.save();

        Item.findOne({ name: itemName })
            .then((result) => {
                res.json({ resultID: result._id });
            })
            .catch((error) => {
                console.log(error);
            })
        //res.redirect('/');
    }

    else {
        List.findOne({ name: listName })
            .then((foundList) => {
                if (foundList) {
                    const savedItem = itemName;
                    foundList.items.push(item);
                    foundList.save();
                    //res.redirect('/' + listName)
                    console.log(foundList);

                    const itemsArray = foundList.items;
                    let savedItemId = "";

                    itemsArray.forEach((item)=>{
                        if(item.name === itemName) {
                            savedItemId = item._id
                        }}
                    )  
                    res.json({resultId : savedItemId});
                }
            }).catch((err) => {
                console.log(err);
            });
    }
});


app.get('/about', (req, res) => {
    res.render('about');
});

app.post('/delete', (req, res) => {
    const itemID = req.body._id;
    const listName = req.body.listTitle;

    if (listName === "Today") {
        Item.findOneAndDelete({ _id: itemID })
            .then((result) => {
                console.log("from find one and delete Today");

            }).catch((err) => {
                console.log(err);
            });
        //res.redirect('/');
        Item.find()
            .then((result) => {
                console.log("delete success");
                res.json({ newListItems: result });

            }).catch((err) => {
                console.log(err);
            });

    }
    else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: itemID } } })
            .then((result) => {
                console.log(result);
                //res.redirect('/'+listName);
            }).catch((err) => {
                console.log(err);
            });
    }

});


let port = process.env.PORT || 3000;

app.listen(3000, () => {
    console.log('Todo app listening on port 3000!');
});