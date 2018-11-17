const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')


const app = express();

//map  global promise to get rid of warning
mongoose.Promise = global.Promise;

//Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected....'))
    .catch((err) => { console.log(err) });

//Load Ideas Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method Overrider middleware
app.use(methodOverride('_method'));


//INDEX Route
app.get('/', (req, res) => {
    res.render('index', { title: 'index' });
});

//About Route
app.get('/about', (req, res) => {
    res.render('about')
});

//Idea Index Page
app.get('/ideas', (req,res)=>{
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas =>{
        res.render('ideas/index', {
            ideas:ideas
        }); 
    })
});

//Add Idea Form Route
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//Edit Idea Form Route
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        res.render('ideas/edit',{
            idea:idea
        });
    })
});

//Process form
app.post('/ideas', (req, res) => {
    var errors = []
    if (!req.body.title) {
        errors.push({ text: 'Please add title' })
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add detail' })
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
        .save()
        .then(idea =>{
            res.redirect('/ideas')
        })
    }
})

// Edit Form Process
app.put('/ideas/:id',(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{
        // new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea=>{
            res.redirect('/ideas');
        })
    })
});

//Delete Idea
app.delete('/ideas/:id',(req,res)=>{
    Idea.remove({_id:req.params.id})
    .then(()=>{
        res.redirect('/ideas');
    })
}); 

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});