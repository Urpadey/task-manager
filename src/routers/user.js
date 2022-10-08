const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/User')
const multer = require('multer')
const sharp = require('sharp')
const mail = require('../emails/account')
const router = new express.Router()



router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        mail(user.email, user.name, 'Welcome Message', `
        We at Pharma App, warmly welcome to you to our platform,we happy to have you here and we know together we will do great things
        Thanks for Joining`)


        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.status(200).send('sucessfully logged out')
    } catch (e) {
        res.status(500).send()
    }
})
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send('all users logged out')
    } catch (error) {
        res.status(500).send()
    }

})
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)

})



router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: "Updating an element that is not available" })
    }
    try {
        // const user = await User.findById(id)
        // const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete("/users/me", auth, async (req, res) => {

    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send({ error: "user does not exist" })
        // }
        await req.user.remove()
        res.status(200).send(req.user)
        mail(req.user.email, req.user.name, 'Goodbye Message', `Pharma App has tried to do our very possible best to give the best services to our clients,
        if we feel short of those services, we are apologize and we will worked harder to do better,
        Thank You`)
    } catch (e) {
        res.status(500).send()
    }
})

// multer file upload
const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('files must be a JPG or JPEG or PNG'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send(error.message)
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(400).send()
    }
})


router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error('image not found')
        }
        res.set("Content-Type", 'image/png')
        res.send(user.avatar)

    } catch (error) {
        res.status(404).send()

    }
})




module.exports = router