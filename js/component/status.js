import React from 'react'

export default ({frontendVersion, backendVersion}) => {
  return (
    <dl className='status'>
      <dt>Frontend version</dt>
      <dd>{frontendVersion || '?'}</dd>
      <dt>Backend version</dt>
      <dd>{backendVersion || '?'}</dd>
    </dl>
  )
}
