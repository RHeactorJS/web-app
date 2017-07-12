import React from 'react'
import { FormHeader, FormCard } from '../app/form-components'

export default () => (
  <FormCard>
    <FormHeader icon='lock'>Access Denied</FormHeader>
    <div className='card-block'>
      <div className='alert alert-danger' role='alert'>
        <i className='material-icons'>warning</i> You are not allowed to access this section!
      </div>
    </div>
  </FormCard>
)
