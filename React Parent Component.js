// Worked with tying multiple components together

const React = require('react')
const Modal = require('react-bootstrap').Modal
const Select = require('react-select').default
const DateTime = require("react-datetime")
const TimelineView = require('../shared/timeline.view')
const someService = require('../../services/someStuff.service')
const authenticationService = require('../../services/authentication.service')
const usersService = require("../../services/users.service")


class MyTimeline extends React.PureComponent {
    constructor(props, context) {
        super(props, context)

        this.handleShow = this.handleShow.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleViewersChange = this.handleViewersChange.bind(this)
        this.handleBeginDateInputChange = this.handleBeginDateInputChange.bind(this)
        this.handleEndDateInputChange = this.handleEndDateInputChange.bind(this)
        this.handleRegularReactFormInputChange = this.handleRegularReactFormInputChange.bind(this)
        this.submit = this.submit.bind(this)

        this.state = {
            someStuff: [],
            username: "",
            formData: {
                beginDate: "",
                endDate: "",
                type: "Single",
                summary: "",
                description: "",
                viewerIds: "",
            },
            submitted: false,
            show: false,
            supporters: []
        }
    }

    submit() {
        let payload = this.state.formData

        // Format payload
        if (!this.state.formData.endDate) {
            payload.endDate = payload.beginDate
        }

        someService.create(payload)
            .then(someId => {
                window.alert("Post is successful")

                someService.readById(someId.item)
                    .then(newStuff => {
                        this.setState(prevState => {
                            const newStuffsArray = prevState.someStuff.slice()
                            newStuffsArray.push(newStuff.item)
                            newStuffsArray.sort((dateA, dateB) => {
                                return new Date(dateB.beginDate) - new Date(dateA.beginDate)
                            })

                            return {
                                someStuff: newStuffsArray,
                                formData: { beginDate: "", endDate: "", type: "Single", summary: "", description: "", viewerIds: "", },
                                show: false
                            }
                        })
                    })
            })
            .catch(data => alert("There was a problem submitting your request"))

    }

    handleBeginDateInputChange(moment) {
        const newDate = moment.toDate()

        this.setState(prevState => {
            const newFormData = Object.assign({}, prevState.formData)
            newFormData.beginDate = newDate
            return {
                formData: newFormData
            }
        })
    }

    handleEndDateInputChange(moment) {
        const newDate = moment.toDate()

        this.setState((prevState) => {
            const newFormData = Object.assign({}, prevState.formData)
            newFormData.endDate = newDate
            return {
                formData: newFormData
            }
        })
    }

    handleViewersChange(viewerIds) {
        viewerIds = viewerIds.map(supporter => supporter.value)

        this.setState(prevState => {
            const newFormData = Object.assign({}, prevState.formData)
            newFormData.viewerIds = viewerIds
            return {
                formData: newFormData
            }
        })
    }

    // NOTE: this handles the Type, Summary, and Description form inputs
    handleRegularReactFormInputChange(event) {
        let input = event.target.value
        let propertyName = event.target.name

        this.setState(prevState => {
            const newFormData = Object.assign({}, prevState.formData)
            newFormData[propertyName] = input
            return {
                formData: newFormData
            }
        })
    }

    handleClose() {
        this.setState({ show: false })
    }

    handleShow() {
        this.setState({ show: true })
    }

    componentDidMount() {
        someService.readMine()
            .then(data => {
                this.setState({ someStuff: data.items })
            })
            .catch(err => console.warn(err))
        someService.currentUser()
            .then(user => {
                this.setState({ username: user.item.username })
            })
            .catch(err => console.warn(err))
        usersService.readMySupporters()
            .then(response => {
                this.setState({
                    supporters: response.items
                })
            })
    }

    render() {
        if (this.state.someStuff === null) { return null }

        return (
            <div>
                <button className="btn btn-success m-b-20" onClick={() => { this.setState({ show: true }) }}>New Entry</button>
                <div id="content">
                    <h1 className="page-header m-b-30">{this.state.username} Timeline</h1>
                    <TimelineView
                        someStuff={this.state.someStuff}
                    />
                </div>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a Thing</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref={ref => (this.formElement = ref)} id="formElement" noValidate>
                            <div className="form-group">
                                <label htmlFor="beginDate" className="control-label input-group">Begin Date</label>
                                <div className="input-group date">
                                    <DateTime mode="date" name="beginDate" id="beginDate" timeFormat={false} value={this.state.formData.beginDate} placeholder="Enter text"
                                        onChange={this.handleBeginDateInputChange} inputProps={{ readOnly: true, ref: beginDateElement => { this.beginDateElement = beginDateElement; } }} closeOnSelect={true} required />
                                    <span className="input-group-addon" onClick={() => { this.beginDateElement.focus() }}>
                                        <i className="glyphicon glyphicon-calendar" />
                                    </span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="endDate" className="control-label input-group">End Date (Optional)</label>
                                <div className="input-group date">
                                    <DateTime mode="date" name="endDate" id="endDate" timeFormat={false} value={this.state.formData.endDate} placeholder="Enter text"
                                        onChange={this.handleEndDateInputChange} inputProps={{ readOnly: true, ref: endDateElement => { this.endDateElement = endDateElement; } }} closeOnSelect={true} />
                                    <span className="input-group-addon" onClick={() => { this.endDateElement.focus() }}>
                                        <i className="glyphicon glyphicon-calendar" />
                                    </span>
                                </div>
                            </div>

                            <div className='form-group'>
                                <label htmlFor="type">Type</label>
                                <select name="type" className="form-control" onChange={this.handleRegularReactFormInputChange}>
                                    <option defaultValue value="Single">Single</option>
                                    <option value="Intermittent">Intermittent</option>
                                    <option value="Ongoing">Ongoing</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="summary" className="control-label">Summary</label>
                                <textarea name="summary" maxLength="200" className="form-control" rows="5" onChange={this.handleRegularReactFormInputChange} value={this.state.formData.summary} required></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description" className="control-label">Description</label>
                                <textarea name="description" maxLength="2000" className="form-control" rows="5" onChange={this.handleRegularReactFormInputChange} value={this.state.formData.description} required></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="viewers" className="control-label">Choose which supporters may view this event</label>
                                <Select multi={true} ref={ref => (this.viewersElement = ref)} name="viewers" id="viewers" value={this.state.formData.viewerIds} onChange={this.handleViewersChange} options=
                                    {this.state.supporters.map(supporter => ({ value: supporter._id, label: supporter.username }))}
                                    placeholder="Select supporters from your support network"
                                />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-success m-r-5" type="submit" onClick={this.submit}>Submit</button>
                        <button className="btn btn-default" onClick={this.handleClose}>Cancel</button>
                    </Modal.Footer>
                </Modal>
            </div >
        )
    }
}

module.exports = MyTimeline
