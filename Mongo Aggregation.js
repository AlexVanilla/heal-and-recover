function _readThreadById(threadId) {
    return conn.db().collection("threads").aggregate([
            {
                $match: {
                    _id: new ObjectId(threadId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "threadAuthor",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $addFields: {
                    threadAuthorAvatar: "$user.imageUrl"
                }
            },
            {
                $project: {
                    threadAuthor: 0,
                    user: 0,
                    posts: 0
                }
            }
        ]).toArray()
        .then(thread => {
            thread[0]._id = thread[0]._id.toString()
            return thread[0]
        })
        .catch(error => { _onError(error) })
}

