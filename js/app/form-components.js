import React from 'react'
import classNames from 'classnames'
import { isEmail } from '../lib/is-email'
import { Control } from 'react-redux-form'

/**
 * @deprecated Use {formInput2}
 */
export const formInput = ({input, id, label, hint, tabIndex, autoFocus, required, disabled, type, meta: {dirty, error}, children}) => (
  <fieldset className={classNames({'form-group': true, 'has-success': dirty && !error, 'has-danger': dirty && error})}>
    <label htmlFor={id}>
      {label}
      { hint && (<small><br />{hint}</small>)}
    </label>
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

export const formInput2 = (props) => {
  const {disabled, label, name, onBlur, onChange, onFocus, onKeyPress, required, type, value, hint, tabIndex, autoFocus, pristine, valid} = props
  const dirty = !pristine
  const error = !valid
  const attrs = {
    id: name,
    name,
    type,
    value,
    onBlur,
    onChange,
    onFocus,
    onKeyPress
  }
  if (tabIndex) attrs.tabIndex = tabIndex
  if (required) attrs.required = true
  if (autoFocus) attrs.autoFocus = true
  if (disabled) attrs.disabled = true
  return (<fieldset className={classNames({'form-group': true, 'has-success': dirty && !error, 'has-danger': dirty && error})}>
    <label htmlFor={name}>
      {label}
      { hint && (<small><br />{hint}</small>)}
    </label>
    <input {...attrs}
      className={classNames({
        'form-control': true,
        'form-control-success': dirty && !error,
        'form-control-danger': dirty && error
      })}
    />
  </fieldset>)
}

export const FormHeader = ({submitSucceeded, icon, children, spin}) => (
  <div className='card-header'>
    <h1 className='card-title'>
      {
        submitSucceeded
          ? <i className='material-icons success'>check_circle</i>
          : <i className={classNames({'material-icons': true, spin})}>{icon}</i>
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

export const AppButton = ({submitting, valid, submitFailed, submitSucceeded, children, onClick, right = false, icon = 'send'}) => {
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
    buttonIconSymbol = icon
  }
  const disabled = !valid || submitting
  const attrs = {}
  if (disabled) attrs.disabled = true
  if (onClick) attrs.onClick = onClick
  return (
    <button type={onClick ? 'button' : 'submit'} className={classNames({'btn': true, 'btn-primary': true, 'float-right': right})} {...attrs}>
      <i className={buttonIconClass}>{buttonIconSymbol}</i>
      <span>{children}</span>
    </button>
  )
}

export const ContainerRow = ({children}) => (
  <div className='container'>
    <div className='row'>
      {children}
    </div>
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

const stringNotEmpty = (val) => val && val.length > 1

export const RRFField = ({name, label, tabIndex, required, disabled, onBlur, email}) => {
  const attrs = {}
  if (tabIndex) attrs.tabIndex = tabIndex
  attrs.validators = {}
  if (required) {
    attrs.required = true
    attrs.validators.stringNotEmpty = stringNotEmpty
  }
  if (email) {
    attrs.validators.email = isEmail
    attrs.type = 'email'
  }
  if (disabled) attrs.disabled = disabled
  if (onBlur) attrs.onBlur = onBlur
  return <Control.text
    {...attrs}
    model={`.${name}`}
    component={formInput2}
    mapProps={{
      pristine: ({fieldValue}) => fieldValue.pristine,
      valid: ({fieldValue}) => fieldValue.valid
    }}
    label={label} />
}
