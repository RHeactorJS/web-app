import React from 'react'

export class Status extends React.Component {
  /**
   * @param {{api:{API}, frontendVersion:string}} props
   */
  constructor (props) {
    super(props)
    this.api = props.api
    this.frontendVersion = props.frontendVersion
    this.state = {status: false}
  }

  componentDidMount () {
    this.fetchStatus()
  }

  fetchStatus () {
    return this.api.status()
      .then(status => this.setState({status}))
  }

  render () {
    const {status} = this.state
    if (!status) {
      return (
        <dl>
          <dt>Frontend version</dt>
          <dd>{this.frontendVersion}</dd>
        </dl>
      )
    } else {
      return (
        <dl>
          <dt>Frontend version</dt>
          <dd>{this.frontendVersion}</dd>
          <dt>Backend version</dt>
          <dd>{status.version}</dd>
        </dl>
      )
    }
  }
}
