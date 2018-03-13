// Made a nested Promise.all() in the React component lifecycle
componentDidMount() {
        Promise.all([someService.readSiteWide(), someService.readByClientId(authenticationService.getCurrentUser().userId),])
            // NOTE: Promise.all will return an array of responses
            .then(datas => {
                const nextStateObjects = []
                const iconPromises = []

                // Pushing our mongo entities to the nextState object
                for (let data of datas) {
                    nextStateObjects.push(...data.items)
                }

                // Need to update our nextState object and grab icon information
                for (let nextStateObject of nextStateObjects) {
                    iconPromises.push(
                        // Creating another array of promises for icons
                        someService.readIconById(nextStateObject.iconId)
                            .then(data => {
                                nextStateObject.icon = data.item
                                delete nextStateObject.iconId
                            }))
                }

                // After all of the icons have been retrieved and put in our nextState object, update this.state.someStateProperty
                Promise.all(iconPromises)
                    .then(() => {
                        this.setState({ someStateProperty: nextStateObjects })
                    })
            })
            .catch(err => {
                console.warn(err)
            })
    }

