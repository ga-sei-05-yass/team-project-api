const express = require('express')
const multer = require('multer')
const storage = multer.memoryStorage()
const multerImage = multer({
  storage: storage
})
const passport = require('passport')

const Image = require('../models/image')

const imageApi = require('../../lib/imageApi')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404

const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', {
  session: false
})

const router = express.Router()

// INDEX
router.get('/images', requireToken, (req, res, next) => {
  Image.find()
    .then(images => {
      return images.map(image => image.toObject())
    })

    .then(images => res.status(200).json({
      images: images
    }))
})

// SHOW
router.get('/images/:id', requireToken, (req, res, next) => {
  Image.findById(req.params.id)
    .then(handle404)
    .then(image => res.status(200).json({
      image: image.toObject()
    }))
    .catch(next)
})

// CREATE
router.post('/images', multerImage.single('file'), requireToken, (req, res, next) => {
  console.log(req.file)
  console.log('req.file is', req.file)
  console.log('req.body is', req.body)

  imageApi(req.file)
    .then(awsResponse => {
      return Image.create({
        fileName: awsResponse.key,
        fileType: req.file.mimetype,
        tag: req.body.tag,
        description: req.body.description,
        owner: req.user.id
      })
    })
    .then(image => {
      res.status(201).json({
        image: image.toObject()
      })
    })
    .catch(next)
})

// UPDATE
router.patch('/images/:id', multerImage.single('file'), requireToken, removeBlanks, (req, res, next) => {
  let storeImage
  // finds the current resource we are trying to edit
  Image.findById(req.params.id)
    // send error if we didnt find the resource
    .then(handle404)
    // makes sure they own the resource
    .then(image => {
      requireOwnership(req, image)
      // reassigning the image variable so it can be used in the promise
      storeImage = image
      // uploading image to s3
      return imageApi(req.file)
    })
    .then(awsResponse => {
      return storeImage.updateOne({
        // using the same fields as 'create', except for owner
        // owner does not update
        fileName: awsResponse.key,
        fileType: req.file.mimetype
      })
    })
    // send a successful response
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
router.delete('/images/:id', requireToken, (req, res, next) => {
  Image.findById(req.params.id)
    .then(handle404)
    .then(image => {
      requireOwnership(req, image)
      image.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
