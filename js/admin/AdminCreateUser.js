import React from 'react'
import { Field, reduxForm, SubmissionError, initialize } from 'redux-form'
import { isEmail } from '../lib/is-email'
import { AppButton, FormCard, FormHeader, formInput, GenericError } from '../app/form-components'
import { createUser } from './actions'

export default class AdminCreateUser extends React.Component {
  submit = ({email, firstname, lastname}) => {
    this.props.dispatch(createUser(email, firstname, lastname))
    return new Promise((resolve, reject) => {
      this.submitPromise = {resolve, reject}
    })
  }

  componentWillReceiveProps ({createUserSuccess, createUserError}) {
    if (createUserSuccess) {
      this.submitPromise.resolve()
      this.props.dispatch(initialize('adminCreateUser', {}))
    }
    if (createUserError) {
      this.submitPromise.reject(new SubmissionError({_error: createUserError}))
    }
  }

  render () {
    return <AdminCreateUserForm onSubmit={this.submit} />
  }
}

const validate = ({email, firstname, lastname}) => ({
  email: !email || !isEmail(email),
  firstname: !firstname || firstname.length < 1,
  lastname: !lastname || lastname.length < 1
})

const AdminCreateUserForm = reduxForm({
  form: 'adminCreateUser',
  validate
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed}) => (
  <FormCard half>
    <form name='form' onSubmit={handleSubmit}>
      <FormHeader submitSucceeded={submitSucceeded} icon='person_add'>New user</FormHeader>
      <div className='card-block'>
        <div className='alert alert-info' role='alert'>
          <i className='material-icons'>info</i>
          <span>New users are automatically activated and their password is <code>12345678</code>.</span>
        </div>
        <Field
          component={formInput}
          tabIndex='1'
          type='email'
          required
          disabled={submitting ? 'disabled' : ''}
          name='email'
          id='email'
          label='email address'
          autoFocus
        />
        <Field
          component={formInput}
          tabIndex='2'
          type='text'
          required
          disabled={submitting ? 'disabled' : ''}
          name='firstname'
          id='firstname'
          label='first name'
        />
        <Field
          component={formInput}
          tabIndex='3'
          type='text'
          required
          disabled={submitting ? 'disabled' : ''}
          name='lastname'
          id='lastname'
          label='last name'
        />
      </div>
      <div className='card-footer'>
        <div className='controls'>
          <AppButton submitting={submitting} valid={valid} submitFailed={submitFailed}
            submitSucceeded={submitSucceeded}>Create</AppButton>
        </div>
        { error && <GenericError problem={error} /> }
        { submitSucceeded && (
          <div className='success-info'>
            <div className='alert alert-success' role='alert'>
              <i className='material-icons'>check_ok</i> User created!
            </div>
          </div>
        )}
      </div>
    </form>
  </FormCard>
))
