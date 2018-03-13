// Created PureComponent for certain places in our site

const React = require('react')
const Modal = require('react-bootstrap').Modal
const anotherService = require('../../services/another.service')
const authenticationService = require('../../services/authentication.service')
const someService = require('../../services/some.service')

class MyClients extends React.PureComponent {
    constructor(props, context) {
        super(props, context)

        // Functions for modal
        this.handleShow = this.handleShow.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this)
        this.handleLastNameChange = this.handleLastNameChange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handleUserNameChange = this.handleUserNameChange.bind(this)
        this.validityCheck = this.validityCheck.bind(this)
        this.submit = this.submit.bind(this)

        this.state = {
            userClients: [],
            show: false,
            formData: {
                firstName: "",
                lastName: "",
                email: "",
                username: ""
            },
            submitted: false,
            title: ''
        }
    }

    handleClose() {
        this.setState({ show: false })
    }

    handleShow() {
        this.setState({ show: true })
    }

    componentDidMount() {
        // Get currently logged in user
        const userId = authenticationService.getCurrentUser().userId

        anotherService.readUserClients(userId)
            .then(data => {
                this.setState({ userClients: data.items.slice() })
            })
            .catch(err => console.warn(err))

        const userType = authenticationService.getCurrentUser().userType
        if (userType == "Potatoe (Renamed stuff)") {
            this.setState({ title: "My Clients" })
        } else {
            this.setState({ title: "Pototototatoe" })
        }
    }

    validityCheck(propertyName) {
        return (this.state.submitted && this[propertyName] && !this[propertyName].validity.valid ? ' has-error has-feedback' : '')
    }

    handleFirstNameChange(event) {
        const userInput = event.target.value
        const regexFirstName = /^[A-zÀ-ÿ]{2,16}$/

        if (!regexFirstName.test(userInput)) { event.target.setCustomValidity('This field can contain letters and must be between 2 and 16 in length.') }
        else { event.target.setCustomValidity('') }

        this.setState(prevState => {
            const newFormData = { ...prevState.formData }
            newFormData.firstName = userInput
            return {
                formData: newFormData
            }
        })
    }

    handleLastNameChange(event) {
        const userInput = event.target.value
        const regexLastName = /^[A-zÀ-ÿ]{2,20}$/

        if (!regexLastName.test(userInput)) { event.target.setCustomValidity('This field can contain letters and must be between 2 and 20 in length.') }
        else { event.target.setCustomValidity('') }

        this.setState(prevState => {
            const newFormData = { ...prevState.formData }
            newFormData.lastName = userInput
            return {
                formData: newFormData
            }
        })
    }

    handleEmailChange(event) {
        const userInput = event.target.value
        const regexEmail = /\S+@\S+\.\S+/

        if (!regexEmail.test(userInput)) { event.target.setCustomValidity('Email needs to be in proper format (i.e.: email@example.com)') }
        else { event.target.setCustomValidity('') }

        this.setState(prevState => {
            const newFormData = { ...prevState.formData }
            newFormData.email = userInput
            newFormData.username = ''
            return {
                formData: newFormData
            }
        })
    }

    handleUserNameChange(event) {
        const userInput = event.target.value
        const regexUserName = /^[a-zA-Z0-9-_]{5,18}$/

        if (!regexUserName.test(userInput)) { event.target.setCustomValidity('Username must be between 5 and 18 characters') }
        else { event.target.setCustomValidity('') }

        this.setState(prevState => {
            const newFormData = { ...prevState.formData }
            newFormData.username = userInput
            newFormData.email = ''
            return {
                formData: newFormData
            }
        })
    }

    submit(event) {
        const payload = this.state.formData
        this.setState({ submitted: true })

        // If any of the inputs are invalid, don't run the AJAX function
        if (!this.firstNameElement.validity.valid || !this.lastNameElement.validity.valid || !this.emailElement.validity.valid || !this.usernameElement.validity.valid) { return }

        // Format the payload correctly
        if (payload.email) { delete payload.username }

        someService.create(payload)
            .then(data => {
                window.alert("Message successfully sent")

                // Clear the form and close the modal
                this.setState(() => {
                    return {
                        formData: {
                            firstName: "",
                            lastName: "",
                            email: "",
                            username: ""
                        },
                        show: false
                    }
                })
            })
            // NOTE: client unable to retrieve error message from backend
            .catch(errors => {
                alert("There was a problem submitting your request")
            })
    }

    render() {
        // if there's no data, as in the ajax call hasn't happened yet - don't display anything at all.
        if (this.state.userClients === null) { return null }

        let clients = this.state.userClients.map(userClient => (
            <li key={userClient._id}>
                <img src={userClient.imageUrl} alt="profile-pic" height="100" width="100" />
                <h4 className="text-ellipsis"><a href={`/profiles/${userClient._id}`}>{userClient.firstName} {userClient.lastName}</a></h4>
            </li>
        ))

        return (
            <div>
                <h1>{this.state.title}</h1>
                <div className="panel panel-inverse">
                    <div className="panel-heading">
                        <h4 className="panel-title">Index</h4>
                    </div>
                    <div className="panel-body">
                        <button className="btn btn-primary" onClick={this.handleShow}>Send Client Invite</button>
                        <ul className="registered-users-list clearfix">
                            {clients}
                        </ul>
                    </div>
                </div>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Invite a user</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref={ref => (this.formElement = ref)} id="formElement" noValidate>
                            <div className={"form-group" + this.validityCheck("firstNameElement")}>
                                <label htmlFor="firstName" className="control-label">First Name</label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    className="form-control"
                                    ref={ref => (this.firstNameElement = ref)}
                                    value={this.state.formData.firstName}
                                    onChange={this.handleFirstNameChange}
                                    placeholder="Enter first name"
                                    required
                                />
                                {this.validityCheck("firstNameElement") && <span className="fa fa-times form-control-feedback"></span>}
                                {this.validityCheck("firstNameElement") && this.firstNameElement.validity.valueMissing && <span className="help-block">First name is required</span>}
                                {this.validityCheck("firstNameElement") && this.firstNameElement.validity.customError && <span className="help-block">{this.firstNameElement.validationMessage}</span>}
                            </div>

                            <div className={"form-group" + this.validityCheck("lastNameElement")}>
                                <label htmlFor="lastName" className="control-label">Last Name</label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    className="form-control"
                                    ref={ref => (this.lastNameElement = ref)}
                                    value={this.state.formData.lastName}
                                    onChange={this.handleLastNameChange}
                                    placeholder="Enter last name"
                                    required
                                />
                                {this.validityCheck("lastNameElement") && <span className="fa fa-times form-control-feedback"></span>}
                                {this.validityCheck("lastNameElement") && this.lastNameElement.validity.valueMissing && <span className="help-block">Last name is required</span>}
                                {this.validityCheck("lastNameElement") && this.lastNameElement.validity.customError && <span className="help-block">{this.lastNameElement.validationMessage}</span>}
                            </div>

                            <div className={"form-group" + !this.state.formData.username && this.validityCheck("emailElement")}>
                                <label htmlFor="email" className="control-label">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="form-control"
                                    ref={ref => (this.emailElement = ref)}
                                    value={this.state.formData.email}
                                    onChange={this.handleEmailChange}
                                    placeholder="email@example.com"
                                    required
                                    disabled={this.state.formData.username}
                                />
                                {!this.state.formData.username && this.validityCheck("emailElement") && <span className="fa fa-times form-control-feedback"></span>}
                                {!this.state.formData.username && this.validityCheck("emailElement") && this.emailElement.validity.valueMissing && <p className="help-block">Valid username or email required</p>}
                                {/* NOTE: Not relying on .typeMismatch because it doesn't exactly match an email format we want */}
                                {!this.state.formData.username && this.validityCheck("emailElement") && this.emailElement.validity.customError && <span className="help-block">{this.emailElement.validationMessage}</span>}
                            </div>

                            <div className={"form-group" + !this.state.formData.email && this.validityCheck("usernameElement")}>
                                <label htmlFor="username" className="control-label">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    className="form-control"
                                    ref={ref => (this.usernameElement = ref)}
                                    value={this.state.formData.username}
                                    onChange={this.handleUserNameChange}
                                    placeholder="Enter username"
                                    required
                                    disabled={this.state.formData.email}
                                />
                                {!this.state.formData.email && this.validityCheck("usernameElement") && <span className="fa fa-times form-control-feedback"></span>}
                                {!this.state.formData.email && this.validityCheck("usernameElement") && this.usernameElement.validity.valueMissing && <p className="help-block">Valid username or email required.</p>}
                                {!this.state.formData.email && this.validityCheck("usernameElement") && <span className="help-block">{this.usernameElement.validationMessage}</span>}
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-success" onClick={this.submit}>Send invite</button>
                        <button type="button" className="btn btn-default" onClick={this.handleClose}>Cancel</button>
                    </Modal.Footer>
                </Modal>
            </div >
        )
    }
}

module.exports = MyClients
