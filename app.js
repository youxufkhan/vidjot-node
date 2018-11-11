const express = require('express');

const app = express();
const exphbs  = require('express-handlebars');


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
    res.send('about')
});

const port = 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
});