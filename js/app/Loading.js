import React from 'react'
import { FormHeader, FormCard } from '../app/form-components'

export default ({children}) => (
  <FormCard>
    <FormHeader icon='hourglass_empty' spin>Loading</FormHeader>
    <div className='card-block'>
      <p className='card-text'>
        {children}
      </p>
    </div>
  </FormCard>
)
