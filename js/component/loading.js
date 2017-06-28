import React from 'react'

export default ({loading, appName}) => {
  if (!loading) return null
  return (
    <div id='app-loading'>
      <p>
        <i className='material-icons spin'>hourglass_empty</i>
        <span>Loading {appName} …</span>
      </p>
    </div>
  )
}
