import React from 'react'

export const Progress = (now, min = 0, max = 100) => (
  <div className='progress'>
    <div className='progress-bar' role='progressbar' aria-valuenow={now} aria-valuemin={min} aria-valuemax={max} />
  </div>
)
