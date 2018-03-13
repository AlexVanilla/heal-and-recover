// Service file that we made in Angular

// NOTE: Angular function factory for our services 
// We used $http for our AJAX and $q for our promises
;(function() {
    'use strict'

    angular.module('client.services')
        .factory('someService', QuestionnaireResponsesServiceFactory)

    QuestionnaireResponsesServiceFactory.$inject = ['$http', '$q']

    function QuestionnaireResponsesServiceFactory($http, $q) {
        return {
            readAll: _readAll,
            create: _create,
            readById: _readById,
            update: _update,
            deactivateData: _deactivateData
        }

        function _readAll() {
            return $http.get('/api/some-entity')
                .then(xhrSuccess)
                .catch(onError)
        }

        function _readById(id) {
            return $http.get(`/api/some-entity/${id}`)
                .then(xhrSuccess)
                .catch(onError)
        }

        function _create(someData) {
            return $http.post('/api/some-entity', someData)
                .then(xhrSuccess)
                .catch(onError)
        }

        function _update(someData) {
            return $http.put(`/api/some-entity/${someData._id}`, someData)
                .then(xhrSuccess)
                .catch(onError)
        }

        function _deactivateData(id) {
            return $http.delete(`/api/some-entity/deactivate/${id}`)
                .then(xhrSuccess)
                .catch(onError)
        }

        function xhrSuccess(response) {
            return response.data
        }

        function onError(error) {
            console.log(error.data)
            return $q.reject(error.data)
        }
    }
})()
