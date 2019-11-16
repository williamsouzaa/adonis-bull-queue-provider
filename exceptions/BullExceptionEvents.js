class BullExceptionEvents {
  constructor (param) {
    const msg = `The ${param} not is valid in Bull.`
    const instruction = 'Please read https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#events to see the possibilities.'
    this.message = [msg, instruction]
    this.name = 'BullException'
  }
}

module.exports = BullExceptionEvents
