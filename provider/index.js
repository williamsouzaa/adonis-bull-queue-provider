'use strict'
const fs = require('fs')

const { ServiceProvider } = require('@adonisjs/fold')
const ace = require('@adonisjs/ace')

const BuildJobTemplate = require('../commands/BuildJobTemplate')
const JobListen = require('../commands/JobListen')
const BullQueue = require('../src/BullQueue')

const jobsPath = `${process.cwd()}/start/jobs.js`
const jobs = fs.existsSync(jobsPath) ? require(jobsPath) : []

class BullProvider extends ServiceProvider {
  register () {
    this.app.singleton('Bull/Queue', app => {
      const { local: redis } = use('Config').get('redis')
      const redisAccess = { redis: { port: redis.port, host: redis.host } }
      this.jobs = jobs.map(job => new BullQueue(job, redisAccess))
      return { add: this.add.bind(this), process: this.process.bind(this) }
    })
  }

  add (key, data) {
    const queue = this.jobs.find(item => item.job.key === key)
    return queue.bull.add(data, queue.job.options)
  }

  async process () {
    this.jobs.forEach(queue => {
      const events = queue.getEvents()
      events.forEach(({ name, event }) =>
        queue.bull.on(name, queue.job[event])
      )
      queue.bull.process(queue.job.handle)
    })
  }

  boot () {
    this.app.bind('Commands/Make:BuildJobTemplate', () => BuildJobTemplate)
    ace.addCommand('Commands/Make:BuildJobTemplate')

    this.app.bind('Commands/Make:JobListen', () => JobListen)
    ace.addCommand('Commands/Make:JobListen')
  }
}

module.exports = BullProvider
