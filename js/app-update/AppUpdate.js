import React from 'react'
import compareVersions from 'compare-versions'

export default ({backendVersion, frontendVersion, appName}) => {
  if (!backendVersion || !frontendVersion) return null
  const updateNeeded = compareVersions(backendVersion, frontendVersion) > 0
  if (!updateNeeded) return null
  console.debug(`Server version ${backendVersion} is newer than my version ${frontendVersion}!`)
  return (
    <div className='alert alert-warning'>
      <i className='material-icons'>warning</i>
      {appName} has been updated to version {backendVersion}<br />
      <strong>Please reload the page.</strong>
    </div>
  )
}
