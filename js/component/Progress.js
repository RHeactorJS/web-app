import React from 'react'

export const Progress = ({now, min = 0, max = 100}) => (
  <div className='progress'>
    <div className='progress-bar progress-bar-striped progress-bar-animated' style={{width: `${now}%`}} role='progressbar' aria-valuenow={now} aria-valuemin={min} aria-valuemax={max} />
  </div>
)
