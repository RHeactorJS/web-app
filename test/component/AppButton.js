/* global describe, it */

import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'
import { AppButton } from '../../js/app/form-components'
import { expect } from 'chai'

describe('AppButton', () => {
  it('should be enabled if a form is provided and it is valid', () => {
    const b = render(<AppButton valid pristine>label</AppButton>)
    expect(b.type).to.equal('button')
    expect(b.props.disabled).to.equal(undefined)
    expect(b.props.children).to.deep.equal([
      <i className='material-icons'>send</i>,
      <span>label</span>
    ])
    expect(isDisabled(b)).to.equal(false)
    expect(isBlocked(b)).to.equal(false)
    expect(isProgress(b)).to.equal(false)
    expect(isSuccess(b)).to.equal(false)
    expect(isError(b)).to.equal(false)
  })
  it('should be disabled if a form is provided and it is invalid', () => {
    const b = render(<AppButton>label</AppButton>)
    expect(isDisabled(b)).to.equal(true)
    expect(isBlocked(b)).to.equal(true)
    expect(isProgress(b)).to.equal(false)
    expect(isSuccess(b)).to.equal(false)
    expect(isError(b)).to.equal(false)
  })
  it('should be disabled during http activity', () => {
    const b = render(<AppButton submitting valid>label</AppButton>)
    expect(isDisabled(b), 'It should be disabled').to.equal(true)
    expect(isBlocked(b), 'It should not be blocked').to.equal(false)
    expect(isProgress(b), 'It should be progress').to.equal(true)
    expect(isSuccess(b), 'It should not be success').to.equal(false)
    expect(isError(b), 'It should not be error').to.equal(false)
  })
  it('should  show error on http error', () => {
    const b = render(<AppButton submitFailed valid>label</AppButton>)
    expect(isDisabled(b), 'It should not be disabled').to.equal(false)
    expect(isBlocked(b), 'It should not be blocked').to.equal(false)
    expect(isProgress(b), 'It should not be progress').to.equal(false)
    expect(isSuccess(b), 'It should not be success').to.equal(false)
    expect(isError(b), 'It should be error').to.equal(true)
  })
  it('should show success on http success', () => {
    const b = render(<AppButton submitSucceeded valid>label</AppButton>)
    expect(isDisabled(b), 'It should not be disabled').to.equal(false)
    expect(isBlocked(b), 'It should not be blocked').to.equal(false)
    expect(isProgress(b), 'It should not be progress').to.equal(false)
    expect(isSuccess(b), 'It should be success').to.equal(true)
    expect(isError(b), 'It should not be error').to.equal(false)
  })
})

const render = el => {
  const renderer = new ShallowRenderer()
  renderer.render(el)
  return renderer.getRenderOutput()
}

const isDisabled = b => {
  return b.props.disabled === true
}

const isBlocked = b => {
  return b.props.children[0].props.children === 'block'
}

const isProgress = b => {
  return b.props.children[0].props.children === 'hourglass_empty'
}

const isSuccess = b => {
  return b.props.children[0].props.children === 'check_ok'
}

const isError = b => {
  return b.props.children[0].props.children === 'error'
}
