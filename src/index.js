const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()

const port = process.env.PORT

// multer file
// const multer = require('multer')
// const upload = multer({
//     dest: 'images'
// })
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`server is up ${process.env.PORT} `)
})

// the link relationship
// const task = await task.populate('author').execPopulate()
// console.log(task.author)

// const user = await User.findById('user Id 522e4dcb5eac678a23725b5b')
// await user.populate('tasks').execPopulate()
// console.log(user.tasks)