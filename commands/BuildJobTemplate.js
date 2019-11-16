'use strict'

const path = require('path')

const { Command } = require('@adonisjs/ace')

class BuildJobTemplate extends Command {
  constructor (Helpers) {
    super()
    this.Helpers = Helpers
  }

  static get inject () {
    return ['Adonis/Src/Helpers']
  }

  static get signature () {
    return `make:job
      { local? : Job name }
      { --hooks : To create hooks functions }
    `
  }

  static get description () {
    return 'Make a Job class to use Bull'
  }

  async handle ({ local = null }, { hooks = false }) {
    if (!local) local = await this.ask('Enter with Job name')
    const name = local.split('/').pop()

    if (!hooks) hooks = await this.confirm('Include hooks?')

    const template = await this.readFile(
      path.join(__dirname, './Templates/bullTemplate.mustache'),
      'utf8'
    )

    const filePath = path.join(this.Helpers.appRoot(), `app/Jobs/${local}.js`)

    const templateOptions = { name, add_hooks: hooks }

    if (!this.viaAce) {
      return this.generateFile(filePath, template, templateOptions)
    }

    try {
      await this.generateFile(filePath, template, templateOptions)
      this.completed('Created a new Job', `${name}.js`)
    } catch (error) {
      this.error(`${name}.js already exists`)
    }
  }
}

module.exports = BuildJobTemplate
