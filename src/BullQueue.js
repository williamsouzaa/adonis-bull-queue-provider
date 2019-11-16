'use strict'
const Bull = require('bull')
const BullExceptionEvents = require('../exceptions/BullExceptionEvents')

class BullQueue {
  constructor (job, redisConfig) {
    this.job = job
    this.bull = new Bull(this.job.key, redisConfig)
  }

  getEvents () {
    // Get Job Object
    const object = Reflect.getPrototypeOf(this.job)

    // Get All methods of Job Object and filter by nameEvent
    const objectKeys = Reflect.ownKeys(object).filter(
      key => key.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ')[1] === 'Event'
    )

    // Get name of bull events and the name function
    const events = objectKeys.map(key => ({
      name: key.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ')[0],
      event: key
    }))

    // Verify if user event declared exists in bull to work correctly
    try {
      const eventsBull = [
        'errorEvent',
        'waitingEvent',
        'activeEvent',
        'stalledEvent',
        'progressEvent',
        'completedEvent',
        'failedEvent',
        'pausedEvent',
        'resumedEvent',
        'cleanedEvent',
        'drainedEvent',
        'removedEvent'
      ]

      events.forEach(({ event }) => {
        if (!eventsBull.includes(event)) throw new BullExceptionEvents(event)
      })

      return events
    } catch (error) {
      console.log(error)
      return events
    }
  }
}

module.exports = BullQueue
