import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import moment from 'moment'

export default ({user, token, appName, connected}) => {
  const refreshToken = () => {}
  const tokenLifetime = token ? Math.max(token.exp.getTime() - Date.now(), 0) : 0
  const tokenLifetimeHuman = token ? moment.duration(tokenLifetime).humanize() : 'Expired'
  return (
    <nav className='navbar navbar-toggleable-sm navbar-inverse bg-primary fixed-top'>
      <button className='navbar-toggler navbar-toggler-right'
        type='button'
        data-toggle='collapse'
        data-target='#mainnavbar'
        aria-controls='mainnavbar'
        aria-expanded='false'
        aria-label='Toggle navigation'>
        <span className='navbar-toggler-icon' />
      </button>
      <a className='navbar-brand' href='/'>{appName}</a>
      <div className='collapse navbar-collapse' id='mainnavbar'>
        <ul className='navbar-nav mr-auto mt-2 mt-sm-0'>
          <li className='nav-item'>
            <Link to='/' className='nav-link'>
              Home
            </Link>
          </li>
        </ul>
        <ul className='navbar-nav ml-auto mt-2 mt-sm-0'>
          <li className='nav-item'>
            <abbr
              className={classNames({'nav-link': true, 'connection-error': true, ok: connected, error: !connected})}>
              {
                connected
                  ? <i className='material-icons spin' title='Connection ok'>sync</i>
                  : <i className='material-icons danger' title='Connection failed …'>sync_problem</i>
              }
            </abbr>
          </li>
          { user && (
            <li className='nav-item dropdown'>
              <a className='nav-link dropdown-toggle' id='accountDropdown' data-toggle='dropdown' aria-haspopup='true'
                aria-expanded='false'>
                { user.avatar
                  ? <img src={user.avatar} className='avatar' alt={`${user.firstname} ${user.lastname}`} />
                  : <i className='material-icons'>account_circle</i>
                }
                <span>{user.firstname || 'Anonymous'}</span>
              </a>
              <div className='dropdown-menu' aria-labelledby='accountDropdown'>
                <Link to='/account/profile' className='dropdown-item'>
                  <i className='material-icons'>face</i>
                  <span>Change profile</span>
                </Link>
                <a className='dropdown-item' href='#'>
                  <i className='material-icons'>photo</i>
                  <span>Change avatar</span>
                </a>
              </div>
            </li>
          )}
          { token && (
            <li className='nav-item'>
              <a className='nav-link' title='Remaining time until auto-logout. Click to prolong.' onClick={refreshToken}>
                { tokenLifetime > 0
                  ? <i className='material-icons'>schedule</i>
                  : <i className='material-icons'>warning</i>}
                <span>{tokenLifetimeHuman}</span>
              </a>
            </li>
          )}
          { token && (
            <li className='nav-item'>
              <Link to='/logout' className='nav-link'>
                <i className='material-icons'>power_settings_new</i>
                <span>Logout</span>
              </Link>
            </li>
          )}
          { !token && (
            <li className='nav-item'>
              <Link to='/register' className='nav-link'>
                <i className='material-icons'>person_add</i>
                <span>Register</span>
              </Link>
            </li>
          )}
          { !token && (
            <li className='nav-item'>
              <Link to='/login' className='nav-link'>
                <i className='material-icons'>person</i>
                <span>Login</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}
