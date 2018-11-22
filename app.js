const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');


//map  global promise to get rid of warning
mongoose.Promise = global.Promise;

//Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected....'))
    .catch((err) => { console.log(err) });



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

// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

//Connect flash middleware
  app.use(flash());

//Global Variables 
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
//INDEX Route
app.get('/', (req, res) => {
    res.render('index', { title: 'index' });
});

//About Route
app.get('/about', (req, res) => {
    res.render('about')
});

//Use Routes
app.use('/ideas', ideas);
app.use('/users',users);

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});