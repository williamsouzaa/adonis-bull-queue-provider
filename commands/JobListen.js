'use strict'
const { Command } = require('@adonisjs/ace')

class JobListen extends Command {
  constructor (Queue) {
    super()
    this.Queue = Queue
  }

  static get inject () {
    return ['Bull/Queue']
  }

  static get signature () {
    return `job:listen`
  }

  static get description () {
    return 'Jobs Bull/Queue Listener'
  }

  async handle () {
    console.log('Jobs Queue Listener...')
    this.Queue.process()
  }
}

module.exports = JobListen
