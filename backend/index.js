const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')

const PORT = 4000



//database connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>{
    console.log("mongodb connected");
}).catch((err)=>{
    console.log(`error : ${err}`)
})


//userschema
const userschema = mongoose.Schema({
    name: String,
    occupation: String,
    email: String,
    age: Number
})

//model
const user = mongoose.model("user", userschema)


//middlewares
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))



//routes
app.get('/', (req,res)=>{
    res.render("index")
});


//create user - GET method
app.get('/create', async (req,res)=>{
    const formuser = req.query;
    await user.create(formuser).then(()=>{
        res.redirect(`/read`)
    }).catch((err)=>{
        console.log(`err : ${err}`)
    })
});

app.get("/read", async (req,res)=>{
    
    let readusers = await user.find({});
    res.render("read", {user : readusers})
}
)

app.get('/delete/:id', async (req,res)=>{

   let deleteUser = await user.findOneAndDelete({_id: req.params.id})
   res.redirect("/read")
})

app.get('/edit/:id', async (req,res)=>{

   let editUser = await user.findOne({_id: req.params.id})
   res.render("edit", {user : editUser})
})

app.post('/update/:id', async (req,res)=>{
    let {name, email, age, occupation} = req.body;
    let editUser = await user.findOneAndUpdate({_id: req.params.id}, {name, email, age, occupation}, {new : true})
    res.redirect("/read")
 })







app.listen(PORT, ()=>{
    console.log(`app is listening on port : ${PORT}`)
})
