import React from 'react'
import { Link } from 'react-router-dom'
import { FormHeader, FormCard } from '../../app/form-components'
import { fetchUsers, fetchPreviousUsers, fetchNextUsers } from './actions'
import { debounce } from 'lodash'
import { isEmail } from '../../lib/is-email'

export default class AdminUsersList extends React.Component {
  componentWillMount () {
    this.props.dispatch(fetchUsers())
  }

  componentWillReceiveProps ({fetching, users}) {
    this.fetching = fetching
    this.users = users
  }

  onSearch = (value) => {
    this.props.dispatch(fetchUsers({email: value}))
  }

  render () {
    const prevButtonAttrs = {
      disabled: !this.users || !this.users.hasPrev
    }
    const nextButtonAttrs = {
      disabled: !this.users || !this.users.hasNext
    }
    return (
      <FormCard half>
        <FormHeader icon='people'>Users</FormHeader>
        <div className='list-group'>
          <div className='list-group-item' role='navigation'>
            <UserSearch onChange={this.onSearch} query={this.props.query} />
            { !this.users
              ? <span className='loading'><i className='material-icons spin'>hourglass_empty</i> <span>Loading users …</span></span>
              : <span><strong>{this.users.from}</strong>&ndash;<strong>{this.users.from}</strong> of <strong>{this.users.total}</strong></span>
            }
            { this.users && (
              <div className='btn-group' role='group' aria-label='Pager'>
                <button type='button'
                  className='btn btn-secondary btn-sm'
                  title='Previous'
                  {...prevButtonAttrs}
                  onClick={() => this.props.dispatch(fetchPreviousUsers(this.users))}
                >
                  <i className='material-icons'>navigate_before</i>
                </button>
                <button type='button'
                  className='btn btn-secondary btn-sm'
                  title='Next'
                  {...nextButtonAttrs}
                  onClick={() => this.props.dispatch(fetchNextUsers(this.users))}
                >
                  <i className='material-icons'>navigate_next</i>
                </button>
              </div>
            )}
          </div>
          {
            this.users && this.users.items.map(({$id, name, superUser}) => (<Link to={`/admin/user?id=${encodeURIComponent($id)}`} className='list-group-item' key={$id}>
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
    this.state = {searchTerm: (props.query && props.query.email) || ''}
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
