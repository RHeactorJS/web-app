import React from 'react'
import classNames from 'classnames'

export const formInput = ({input, id, label, tabIndex, autoFocus, required, disabled, type, meta: {dirty, error}, children}) => {
  return (
    <fieldset className={classNames({'form-group': true, 'has-success': dirty && !error, 'has-danger': dirty && error})}>
      <label htmlFor={id}>{label}</label>
      <input {...input}
        type={type}
        tabIndex={tabIndex}
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
        className={classNames({
          'form-control': true,
          'form-control-success': dirty && !error,
          'form-control-danger': dirty && error
        })}
      />
      {children}
    </fieldset>
  )
}

export const FormHeader = ({submitSucceeded, icon, children}) => (
  <div className='card-header'>
    <h1 className='card-title'>
      {
        submitSucceeded
          ? <i className='material-icons success'>check_circle</i>
          : <i className='material-icons'>{icon}</i>
      }
      {children}
    </h1>
  </div>
)

export const GenericError = ({problem}) => (
  <div className='alert alert-danger' role='alert'>
    <i className='material-icons'>error</i>
    {problem.title}<br />
    <small>{problem.detail}</small>
  </div>
)

export const AppButton = ({submitting, valid, submitFailed, submitSucceeded, children}) => {
  const disableButton = submitting || !valid

  const buttonIconClass = {'material-icons': true, spin: submitting}
  let buttonIconSymbol
  if (!valid) {
    buttonIconSymbol = 'block'
  } else if (submitting) {
    buttonIconSymbol = 'block'
  } else if (submitFailed) {
    buttonIconSymbol = 'error'
  } else if (submitSucceeded) {
    buttonIconSymbol = 'check_ok'
  } else {
    buttonIconSymbol = 'send'
  }

  return (
    <button type='submit'
      className='btn btn-primary'
      disabled={disableButton ? 'disabled' : ''}>
      <i className={classNames(buttonIconClass)}>{buttonIconSymbol}</i>
      <span>{children}</span>
    </button>
  )
}

export const FormCard = ({children, type = 'single'}) => {
  const single = type === 'single'
  const half = type === 'half'
  const classes = {
    'col-12': single || half,
    'col-md-8': single,
    'offset-md-2': single,
    'col-lg-6': single,
    'offset-lg-3': single,
    'col-md-6': half
  }
  return (
    <div className='container'>
      <article className='row'>
        <section className={classNames(classes)}>
          <div className='card'>
            {children}
          </div>
        </section>
      </article>
    </div>
  )
}
