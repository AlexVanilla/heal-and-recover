// Service file we worked in React (we utilized axios module)

const axios = require('axios')

module.exports = {
    read: _read,
    readById: _readById,
    readSiteWide: _readSiteWide,
    readByClientId: _readByClientId,
    create: _create,
    update: _update,
    delete: _delete,
    readIcons: _readIcons,
    createIcons: _createIcons,
    readIconById: _readIconById
}

function onSuccess(response) {
    return response.data
}

function onError(xhr) {
    console.log(xhr)
    return Promise.reject(xhr.data)
}

function _readSiteWide() {
    return axios.get('/api/some-entity/site-wide').then(onSuccess).catch(onError)
}

function _readByClientId(clientId) {
    return axios.get(`/api/some-entity?clientId=${clientId}`).then(onSuccess).catch(onError)
}

function _read() {
    return axios.get('/api/some-entity').then(onSuccess).catch(onError)
}

function _readById(id) {
    return axios.get(`/api/some-entity/${id}`).then(onSuccess).catch(onError);
}

function _create(tagData) {
    return axios.post('/api/some-entity/', tagData).then(onSuccess).catch(onError);
} 

function _update(tagData) {
    return axios.put('/api/some-entity/' + tagData._id, tagData).then(onSuccess).catch(onError);
}

function _delete(id) {
    return axios.delete('/api/some-entity/' + id).then(onSuccess).catch(onError);
}

function _readIcons() {
    return axios.get('/api/some-entity/icons').then(onSuccess).catch(onError)
}

function _readIconById(IconId) {
    return axios.get(`/api/some-entity/icons/${IconId}`).then(onSuccess).catch(onError)
}

function _createIcons(iconData) {
    return axios.post('/api/some-entity/icons', iconData).then(onSuccess).catch(onError)
}

