import React from 'react'
import classNames from 'classnames'

export const formInput = ({input, id, label, tabIndex, autoFocus, required, disabled, type, meta: {dirty, error}, children}) => (
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

export const GenericError = ({problem}) => {
  const title = problem.title || problem.message
  return (
    <div className='alert alert-danger' role='alert'>
      <i className='material-icons'>error</i>
      {title}
      {problem.detail && <br />}
      {problem.detail && <small>{problem.detail}</small>}
    </div>
  )
}

export const AppButton = ({submitting, valid, submitFailed, submitSucceeded, children, onClick}) => {
  const buttonIconClass = classNames({'material-icons': true, spin: submitting})
  let buttonIconSymbol
  if (!valid) {
    buttonIconSymbol = 'block'
  } else if (submitting) {
    buttonIconSymbol = 'hourglass_empty'
  } else if (submitFailed) {
    buttonIconSymbol = 'error'
  } else if (submitSucceeded) {
    buttonIconSymbol = 'check_ok'
  } else {
    buttonIconSymbol = 'send'
  }
  const disabled = !valid || submitting
  const attrs = {}
  if (disabled) attrs.disabled = true
  if (onClick) attrs.onClick = onClick
  return (
    <button type='submit' className='btn btn-primary' {...attrs}>
      <i className={buttonIconClass}>{buttonIconSymbol}</i>
      <span>{children}</span>
    </button>
  )
}

export const ContainerRow = ({children}) => (
  <div className='container'>
    <article className='row'>
      {children}
    </article>
  </div>
)

export const FormCard = ({children, half}) => {
  const single = !half
  const classes = {
    'col-12': true,
    'col-md-8': single,
    'offset-md-2': single,
    'col-lg-6': single,
    'offset-lg-3': single,
    'col-md-6': half
  }
  return (
    <section className={classNames(classes)}>
      <div className='card'>
        {children}
      </div>
    </section>
  )
}
