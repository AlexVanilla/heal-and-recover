// CRUD Service where we exported methods to make Mongo calls


'use strict'

const mongodb = require('../mongodb')
const conn = mongodb.connection
const ObjectId = mongodb.ObjectId // NOTE: Getting the ObjectId() constructor function to have ObjectId types

// Just get read function for now
module.exports = {
    readAll: _readAll,
    readById: _readById,
    create: _create,
    update: _update,
    deactivateData: _deactivateData
}

function _readAll() {
    return conn.db().collection('mongoCollection').find({ dateDeactivated: null }).toArray()
        .then(results => {
            for (let i = 0; i < results.length; i++) {
                let result = mongoCollection[i]
                // converting ObjectId to string
                result._id = result._id.toString()
                result.anotherId = result.anotherId.toString()
                result.moarId = result.moarId.toString()
            }
            return results
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function _create(model) {
    // copy known properties - last line of defense
    const safeDoc = {
        anotherId: new ObjectId(model.anotherId),
        dateCreated: new Date(),
        dateModified: new Date(),
        moarId: new ObjectId(model.moarId),
        answers: []
    }

    // Verifying objects in model.answers[]
    for (let answer of model.answers) {
        const safeAnswer = {
            questionIndex: answer.questionIndex,
            text: answer.text,
            answerIndices: []
        }

        for (let answerIndex of answer.answerIndices) {
            let safeAnswerIndex = answerIndex
            safeAnswer.answerIndices.push(safeAnswerIndex)
        }
        safeDoc.answers.push(safeAnswer)
    }

    return conn.db().collection('mongoCollection').insertOne(safeDoc)
        .then(result => result.insertedId.toString()) // "return" generated Id as string
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function _readById(id) {
    return conn.db().collection('mongoCollection').findOne({ _id: new ObjectId(id) })
        .then(someData => {
            // convert ObjectId back to string
            someData._id = someData._id.toString()
            someData.anotherId = someData.anotherId.toString()
            someData.moarId = someData.moarId.toString()
            return someData
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err.message)
        })
}

function _update(id, model) {
    // copy known properties - last line of defense
    const safeDoc = {
        _id: new ObjectId(model._id),
        moarId: new ObjectId(model.moarId),
        dateModified: new Date(), // Add dateModified property
        answers: []
    }

    // Verifying objects in model.answers[]
    for (let answer of model.answers) {
        const safeAnswer = {
            questionIndex: answer.questionIndex,
            text: answer.text,
            answerIndices: []
        } 

        for (let answerIndex of answer.answerIndices) {
            let safeAnswerIndex = answerIndex
            safeAnswer.answerIndices.push(safeAnswerIndex)
        }
        safeDoc.answers.push(safeAnswer)
    }

    return conn.db().collection('mongoCollection').updateOne({ _id: new ObjectId(id) }, { $set: safeDoc })
        .then(result => {
            return result.matchedCount
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

// Adds dateDeactivated property to mongo documents
function _deactivateData(id) {
    const safeDoc = {
        dateModified: new Date(),
        dateDeactivated: new Date()
    }
    return conn.db().collection('mongoCollection').updateOne({ _id: new ObjectId(id) }, { $set: safeDoc })
        .then(result => { return result.matchedCount })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}
