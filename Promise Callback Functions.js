// Used DRY concepts to simplify commonly used code


// NOTE: Callback Functions to send status messages.  These should still have access to 'res' object
function _sendSuccessResponse() {
    res.status(200).json(new responses.SuccessResponse())
}

function _onItemSuccess(_id) {
    const responseModel = new responses.ItemResponse(_id) // _id will be put in responseModel.item
    res.status(201)
        .location(`${_apiPrefix}/${_id}`)
        .json(responseModel)
}

function _onItemsSuccess(data) {
    const responseModel = new responses.ItemsResponse(data) // data will be put in responseModel.items
    res.json(responseModel)
}

function _onError(error) {
    console.warn(error)
    return res.status(500).send(new responses.ErrorResponse(error))
}

