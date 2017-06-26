/* global describe, it, beforeEach */

import {URIValue} from 'value-objects'
import {LiveCollection} from '../../js/util/live-collection'
import {expect} from 'chai'

describe('LiveCollection', function () {
  describe('.handleEvents()', function () {
    let dummyItem, collection, handler

    beforeEach(() => {
      // This is the dummy item in the collection
      dummyItem = {
        $context: new URIValue('https://github.com/RHeactorJS/nucleus/wiki/JsonLD#PasswordChange'),
        $id: new URIValue('https://example.com/dummy/17'),
        $version: 42,
        applyUpdatedDummyEvent: function () {
          this.$version++
        }
      }

      // Create a new live collection and store the handler that is called by the event source
      collection = new LiveCollection(
        [dummyItem],
        {
          subscribe: (h) => {
            handler = h
          }
        }
      )
    })

    it('should handle regular events', (done) => {
      // This is the dummy event that is emitted from the mocked event source
      let dummyUpdatingEvent = {
        'https://github.com/RHeactorJS/nucleus/wiki/JsonLD#PasswordChange': {
          $context: 'https://github.com/RHeactorJS/nucleus/wiki/JsonLD#PasswordChange',
          $id: 'https://example.com/dummy/17',
          $version: 43
        }
      }

      // Subscribe to the changes to verify that the subscribers are called if an item is changed
      collection.subscribe((item, event) => {
        expect(item).to.deep.equal(dummyItem)
        expect(event).to.deep.equal(dummyUpdatingEvent)
        done()
      })

      handler('UpdatedDummyEvent', Date.now(), dummyUpdatingEvent)
    })

    it('should ignore events for other items', (done) => {
      let dummyUpdatingEvent = {
        'https://github.com/RHeactorJS/nucleus/wiki/JsonLD#PasswordChange': {
          $context: 'https://github.com/RHeactorJS/nucleus/wiki/JsonLD#PasswordChange',
          $id: 'https://example.com/dummy/18',
          $version: 43
        }
      }

      collection.subscribe((item, event) => {
        done('it should not apply this event')
      })

      handler('UpdatedDummyEvent', Date.now(), dummyUpdatingEvent)
      done()
    })

    it('should ignore events that have a lower version number', (done) => {
      let dummyUpdatingEvent = {
        'https://github.com/RHeactorJS/nucleus/wiki/JsonLD#PasswordChange': {
          $context: 'https://github.com/RHeactorJS/nucleus/wiki/JsonLD#PasswordChange',
          $id: 'https://example.com/dummy/17',
          $version: 42
        }
      }

      collection.subscribe((item, event) => {
        done('it should not apply this event')
      })

      handler('UpdatedDummyEvent', Date.now(), dummyUpdatingEvent)
      done()
    })
  })
})
