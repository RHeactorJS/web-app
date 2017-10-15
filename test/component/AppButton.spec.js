/* global describe it expect */

import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'
import { AppButton } from '../../js/app/form-components'

const render = el => {
  const renderer = new ShallowRenderer()
  renderer.render(el)
  return renderer.getRenderOutput()
}

describe('AppButton', () => {
  it('should be enabled if a form is provided and it is valid', () => {
    const b = render(<AppButton valid pristine>label</AppButton>)
    expect(b.type).toEqual('button')
    expect(b.props.disabled).toEqual(undefined)
    expect(b.props.children).toEqual([
      <i className='material-icons'>send</i>,
      <span>label</span>
    ])
    expect(isDisabled(b)).toEqual(false)
    expect(isBlocked(b)).toEqual(false)
    expect(isProgress(b)).toEqual(false)
    expect(isSuccess(b)).toEqual(false)
    expect(isError(b)).toEqual(false)
  })
  it('should be disabled if a form is provided and it is invalid', () => {
    const b = render(<AppButton>label</AppButton>)
    expect(isDisabled(b)).toEqual(true)
    expect(isBlocked(b)).toEqual(true)
    expect(isProgress(b)).toEqual(false)
    expect(isSuccess(b)).toEqual(false)
    expect(isError(b)).toEqual(false)
  })
  describe('should be disabled during http activity', () => {
    const b = render(<AppButton submitting valid>label</AppButton>)
    it('should be disabled', () => {
      expect(isDisabled(b)).toEqual(true)
    })
    it('should not be blocked', () => {
      expect(isBlocked(b)).toEqual(false)
    })
    it('should be progress', () => {
      expect(isProgress(b)).toEqual(true)
    })
    it('should not be success', () => {
      expect(isSuccess(b)).toEqual(false)
    })
    it('should not be error', () => {
      expect(isError(b)).toEqual(false)
    })
  })
  describe('should  show error on http error', () => {
    const b = render(<AppButton submitFailed valid>label</AppButton>)
    it('should not be disabled', () => {
      expect(isDisabled(b)).toEqual(false)
    })
    it('should not be blocked', () => {
      expect(isBlocked(b)).toEqual(false)
    })
    it('should not be progress', () => {
      expect(isProgress(b)).toEqual(false)
    })
    it('should not be success', () => {
      expect(isSuccess(b)).toEqual(false)
    })
    it('should be error', () => {
      expect(isError(b)).toEqual(true)
    })
  })
  describe('should show success on http success', () => {
    const b = render(<AppButton submitSucceeded valid>label</AppButton>)
    it('should not be disabled', () => {
      expect(isDisabled(b)).toEqual(false)
    })
    it('should not be blocked', () => {
      expect(isBlocked(b)).toEqual(false)
    })
    it('should not be progress', () => {
      expect(isProgress(b)).toEqual(false)
    })
    it('should be success', () => {
      expect(isSuccess(b)).toEqual(true)
    })
    it('should not be error', () => {
      expect(isError(b)).toEqual(false)
    })
  })
})

const isDisabled = b => b.props.disabled === true
const isBlocked = b => b.props.children[0].props.children === 'block'
const isProgress = b => b.props.children[0].props.children === 'hourglass_empty'
const isSuccess = b => b.props.children[0].props.children === 'check_ok'
const isError = b => b.props.children[0].props.children === 'error'
