// ExpressJS route on one of the CRUD entities

'use strict'

const router = require('express').Router()
const someControllerFactory = require('../controllers/some.controller')

// Validations (created middleware for validation)
const validateBody = require('../filters/validate.body')
const validateId = require('../filters/id.filter')
const joiModel = require('../models/joiModel.responses') // We implmented JOI for further validation

module.exports = apiPrefix => {
    const someController = someControllerFactory(apiPrefix)

    // api routes ===========================================================
    // NOTE: validateBody is where we get rid of req.body and substitue it with req.model.  Most of the validations are dependent to req.model
    router.get('/', someController.readAll)
    router.get('/:id([0-9a-fA-F]{24})', someController.readById)
    router.post('/', validateBody(joiModel), validateId.bodyIdDisallowed, someController.create)
    router.put('/:id([0-9a-fA-F]{24})', validateBody(joiModel), validateId.bodyIdRequired, validateId.putIdsIdentical, someController.update)
    router.delete('/deactivate/:id([0-9a-fA-F]{24})', someController.deactivateData)

    return router
}

