const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose')
const app = express();

//map  global promise to get rid of warning
mongoose.Promise = global.Promise;

//Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev',{ useNewUrlParser: true })
.then(()=>console.log('MongoDB Connected....'))
.catch((err)=>{ console.log(err)});

//Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
 
//INDEX Route
app.get('/', (req,res)=>{
    res.render('index',{title:'index'})
});

//About Route
app.get('/about', (req,res)=>{
    res.render('about')
});

const port = 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
});