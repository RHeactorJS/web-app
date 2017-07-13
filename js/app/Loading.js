import React from 'react'
import { ContainerRow, FormHeader, FormCard } from '../app/form-components'

export default ({children}) => (
  <ContainerRow>
    <FormCard>
      <FormHeader icon='hourglass_empty' spin>Loading</FormHeader>
      <div className='card-block'>
        <p className='card-text'>
          {children}
        </p>
      </div>
    </FormCard>
  </ContainerRow>
)
