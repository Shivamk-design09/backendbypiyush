const express = require('express')
const app = express()
const users = require('./user_data.json')
const fs = require("fs")
const { json } = require('stream/consumers')
const mongoose = require("mongoose")
port = 8000


// thsese are alos middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


mongoose
    .connect("mongodb://127.0.0.1:27017/ytapp1")
    .then(() => console.log("mongoo db connectd"))
    .catch((error) => {
        console.log("mongodb error", error)
    })


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    jobTitle: {
        type: String
    },
    gender: {
        type: String
    }
},{timestamps:true})
const User = mongoose.model('user', userSchema)

// this is fs write file to append the data
app.use((req, res, next) => {
    console.log('hello from middlware 1')
    req.myUsername = "shivam bhanayak"
    next()
})


// we can access a req 
app.use((req, res, next) => {
    console.log(req.myUsername)
    next()
})
app.get('/', (req, res) => {
    return res.send(users)
})

app.get("/api/users", async(req, res) => {
const dbUser = await User.find({})
return res.status(200).json({
    dbUser
})

})


app.route('/api/users/:id').get( async(req, res) => {
  const dbUser = await User.findById(req.params.id)
  return res.status(200).json({
    dbUser
  })
}).put((req, res) => {
    // create a edit request here
}).delete((req, res) => {
    const { id } = req.body
    const userid = Number(id)

    const user = users.find(user => user.id === userid)
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    // jis user ki id userId ke barabar h use rehne do baakir saari data collect karo
    const updatedUser = users.filter(user => user.id !== userid)
    //all user but except this user

    fs.writeFile("./user_data.json", JSON.stringify(updatedUser), (err, data) => {

        return res.json({ status: "deleting" })
    })
    console.log(id)
})


app.post("/api/users", async (req, res) => {
    const body = req.body
    if (!body.name) {
        return res.json({
            message: "All fields are required"
        })
    }
    // after creating the user it will return the user object
    const newUser = await User.create({
        name: body.name,
        email: body.email,v
    })

   return res.status(201).json({
    newUser
   })

})

app.listen(port, () => {
    console.log(`server is lisetning on port  ${port}`)
})
