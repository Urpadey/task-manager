const express = require('express')
const Task = require('../models/Task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        author: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})


// get /tasks/completed=true
// limit skip
// get /task?sortby=createdAt_ascending created_desc
router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({ author: req.user._id })
        const match = {}
        const sort = {}
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params

    try {
        const task = await Task.findOne({ _id, author: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send()

    }
})



router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: "Updating an element that is not available" })
    }
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, author: req.user.id })

        // const task = await Task.findById(id)

        // const task = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})



router.delete("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id
    try {
        // const task = await Task.findByIdAndDelete(id)
        const task = await Task.findOne({ _id, author: req.user._id })
        task.remove()
        if (!task) {
            return res.status(404).send({ error: "task does not exist" })
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})
module.exports = router