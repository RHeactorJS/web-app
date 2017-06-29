import {ApplicationError} from '@rheactorjs/errors'
import {URIValueType} from '@rheactorjs/value-objects'
import {String as StringType, Function as FunctionType} from 'tcomb'
import {ModelType} from '@rheactorjs/models'

/**
 * @param {Function} filterFunc
 * @param {Model} model to fetch the relation from
 * @returns {Promise.<String>}
 */
const getLink = (filterFunc, model) => {
  FunctionType(filterFunc, ['JSONLD.getLink', 'filterFunc:Function'])
  ModelType(model, ['JSONLD.getLink', 'model:Model'])
  let matched = model.$links.filter(filterFunc)
  if (!matched.length) {
    console.error('JSONLD', 'Link not found …', model.$links)
    throw new ApplicationError('Relation link not found …')
  }
  if (matched.length > 1) {
    console.error('JSONLD', 'Too many links matched …', matched)
    throw new ApplicationError('Too many relation links matched')
  }
  return matched[0].href
}

/**
 * Find the link for the given relation
 * @param {String} relation
 * @param {Model} model Optional model, to fetch the relation from
 * @returns {Promise.<String>}
 */
const getRelLink = (relation, model) => {
  StringType(relation, ['JSONLD.getRelLink', 'relation:String'])
  ModelType(model, ['JSONLD.getRelLink', 'model:Model'])
  try {
    return getLink((link) => {
      return link.rel === relation
    }, model)
  } catch (err) {
    console.error('JSONLD', 'Tried to find relation', relation, 'on', model)
    throw err
  }
}

/**
 * @param {URIValue} context
 * @param {Model} model Optional model, to fetch the relation from
 * @returns {Promise.<String>}
 */
const getListLink = (context, model) => {
  URIValueType(context, ['JSONLD.getListLink', 'context:URIValue'])
  ModelType(model, ['JSONLD.getListLink', 'model:Model'])
  try {
    return getLink((link) => {
      return link.list && link.subject.toString() === context.toString()
    }, model)
  } catch (err) {
    console.error('JSONLD', 'Tried to find link', context, 'on', model)
    throw err
  }
}

export const JSONLD = {
  getLink,
  getRelLink,
  getListLink
}
