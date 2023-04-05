
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');


const app = express();

mongoose.connect('mongodb+srv://shubhamkumarece22:Mongodbat79351@clustertodo.zdtax2o.mongodb.net/todolistDB');

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


let i = 0;
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
        item.save();
        res.redirect('/');
    }

    else {
        List.findOne({ name: listName })
            .then((foundList) => {
                if (foundList) {
                    foundList.items.push(item);
                    foundList.save();
                    res.redirect('/' + listName);
                }
            }).catch((err) => {
                console.log(err);
            });
    }
});


app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/delete/:_id/:listTitle', (req, res) => {
    const itemID = req.params._id;
    const listName = req.params.listTitle;

    if (listName === "Today") {
        Item.findOneAndDelete({ _id: itemID })
            .then((result) => {
                console.log(result);
            }).catch((err) => {
                console.log(err);
            });
            res.redirect('/');
    }
    else{
        List.findOneAndUpdate({ name: listName},{$pull:{ items: { _id : itemID}}})
        .then((result) => {
            console.log(result);
            res.redirect('/'+listName);
        }).catch((err) => {
            console.log(err);
        });
    }

});

app.listen(3000, () => {
    console.log('Todo app listening on port 3000!');
});