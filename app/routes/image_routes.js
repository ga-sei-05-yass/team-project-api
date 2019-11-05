const express = require('express')
const multer = require('multer')
const storage = multer.memoryStorage()
const multerUpload = multer({ storage: storage })
const passport = require('passport')

const Upload = require('../models/image')

const imageApi = require('../../lib/imageApi')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404

const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
router.get('/images', requireToken, (req, res, next) => {
  Upload.find()
    .then(images => {
      return images.map(image => image.toObject())
    })

    .then(images => res.status(200).json({ images: images }))
})

// SHOW
router.get('/images/:id', requireToken, (req, res, next) => {
  Upload.findById(req.params.id)
    .then(handle404)
    .then(image => res.status(200).json({ image: image.toObject() }))
    .catch(next)
})

// CREATE
router.post('/images', multerUpload.single('file'), requireToken, (req, res, next) => {
  console.log(req.file)

  imageApi(req.file)
    .then(awsResponse => {
      console.log(awsResponse)
      return Upload.create({
        fileName: awsResponse.key,
        fileType: req.file.mimetype,
        owner: req.user.id
      })
    })
    .then(image => {
      res.status(201).json({ image: image.toObject() })
    })
    .catch(next)
})

// UPDATE
router.patch('/images/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.image.owner

  Upload.findById(req.params.id)
    .then(handle404)
    .then(image => {
      requireOwnership(req, image)
      return image.updateOne(req.body.image)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
router.delete('/images/:id', requireToken, (req, res, next) => {
  Upload.findById(req.params.id)
    .then(handle404)
    .then(image => {
      requireOwnership(req, image)
      image.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
