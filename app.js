const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express();

//map  global promise to get rid of warning
mongoose.Promise = global.Promise;

//Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev',{ useNewUrlParser: true })
.then(()=>console.log('MongoDB Connected....'))
.catch((err)=>{ console.log(err)});

//Load Ideas Model
require('./models/Idea');
const Idea = mongoose.model('ideas')

//Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
//INDEX Route
app.get('/', (req,res)=>{
    res.render('index',{title:'index'})
});

//About Route
app.get('/about', (req,res)=>{
    res.render('about')
});

//Idea Form Route
app.get('/ideas/add', (req,res)=>{
    res.render('ideas/add')
});

//Process form
app.post('/ideas', (req,res)=>{
    var errors = []
    if(!req.body.title){
        errors.push({text:'Please add title'})
    }
    if(!req.body.title){
        errors.push({text:'Please add detail'})
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors:errors,
            title:req.body.title,
            details:req.body.details
        })
    }else{
        res.send('ok')
    }
})

const port = 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
});