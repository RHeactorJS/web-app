import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { FormHeader, FormCard, ContainerRow } from '../app/form-components'
import { fetchUsers, fetchPreviousUsers, fetchNextUsers } from './actions'
import { debounce } from 'lodash'
import { isEmail } from '../lib/is-email'

export default class AdminUsersScreen extends React.Component {
  constructor (props) {
    super(props)
    this.pathname = props.location.pathname
    this.autologinComplete = props.autologinComplete
    this.user = props.user
  }

  componentWillReceiveProps ({autologinComplete, user, userQuery}) {
    if (autologinComplete) {
      this.autologinComplete = autologinComplete
      this.user = user
      this.userQuery = userQuery
    }
  }

  render () {
    if (!this.autologinComplete) return null
    return (this.user)
      ? (<ContainerRow>
        { this.user.superUser
          ? (<AdminUsersList {...this.props} />)
          : (<FormCard>
            <FormHeader icon='lock'>Access Denied</FormHeader>
            <div className='card-block'>
              <div className='alert alert-danger' role='alert'>
                <p>You are not allowed to access this section!</p>
              </div>
            </div>
          </FormCard>)
        }
      </ContainerRow>)
      : <Redirect to={{pathname: '/login', returnTo: this.pathname}} />
  }
}

class AdminUsersList extends React.Component {
  componentWillMount () {
    this.props.dispatch(fetchUsers())
  }

  componentWillReceiveProps ({fetchingUsers, usersList}) {
    this.fetchingUsers = fetchingUsers
    this.usersList = usersList
  }

  onSearch = (value) => {
    this.props.dispatch(fetchUsers({email: value}))
  }

  render () {
    const prevButtonAttrs = {
      disabled: !this.usersList || !this.usersList.hasPrev
    }
    const nextButtonAttrs = {
      disabled: !this.usersList || !this.usersList.hasNext
    }
    return (
      <FormCard half>
        <FormHeader icon='people'>Users</FormHeader>
        <div className='list-group'>
          <div className='list-group-item' role='navigation'>
            <UserSearch onChange={this.onSearch} userQuery={this.props.userQuery} />
            { !this.usersList
              ? <span className='loading'><i className='material-icons spin'>hourglass_empty</i> <span>Loading users …</span></span>
              : <span><strong>{this.usersList.from}</strong>&ndash;<strong>{this.usersList.from}</strong> of <strong>{this.usersList.total}</strong></span>
            }
            { this.usersList && (
              <div className='btn-group' role='group' aria-label='Pager'>
                <button type='button'
                  className='btn btn-secondary btn-sm'
                  title='Previous'
                  {...prevButtonAttrs}
                  onClick={() => this.props.dispatch(fetchPreviousUsers(this.usersList))}
                >
                  <i className='material-icons'>navigate_before</i>
                </button>
                <button type='button'
                  className='btn btn-secondary btn-sm'
                  title='Next'
                  {...nextButtonAttrs}
                  onClick={() => this.props.dispatch(fetchNextUsers(this.usersList))}
                >
                  <i className='material-icons'>navigate_next</i>
                </button>
              </div>
            )}
          </div>
          {
            this.usersList && this.usersList.items.map(({$id, name, superUser}) => (<Link to={`/admin/user?id=${encodeURIComponent($id)}`} className='list-group-item' key={$id}>
              { superUser && <i className='material-icons' title='SuperUser'>security</i> }
              <span>{name}</span>
            </Link>))
          }
        </div>
      </FormCard>
    )
  }
}

class UserSearch extends React.Component {
  constructor (props) {
    super(props)
    this.onChange = debounce(props.onChange, 250)
    this.state = {searchTerm: (props.userQuery && props.userQuery.email) || ''}
  }

  clear = () => {
    this.setState({searchTerm: ''})
    this.props.onChange()
  }

  handleChange = (event) => {
    const v = event.target.value
    this.setState({searchTerm: v})
    if (isEmail(v)) {
      this.onChange(v)
    }
    if (!v) this.onChange()
  }

  render () {
    return (
      <form name='userSearchForm'>
        <fieldset className='form-group one-line'>
          <label htmlFor='userSearch' className='sr-only'>Search</label>
          <div className='input-group'>
            <div className='input-group-addon'>
              <i className='material-icons'>email</i>
            </div>
            <input className='form-control'
              type='email'
              placeholder='Search by email …'
              id='userSearch'
              name='searchTerm'
              value={this.state.searchTerm}
              onChange={this.handleChange} />
            { this.state.searchTerm && (
              <div className='input-group-addon'>
                <i className='material-icons control'
                  onClick={this.clear}
                >delete</i>
              </div>
            )}
          </div>
        </fieldset>
      </form>
    )
  }
}
