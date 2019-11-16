# Install

Install with npm:

```bash
npm install adonis-bull-queue-provider
```

Install with yarn:

```bash
yarn add adonis-bull-queue-provider
```

# To Using
To start use the package, you will need create a new file. `start/jobs.js`
You should import yours jobs to this file, example:

```js
const TestJob = use('App/Jobs/TestJob')
module.exports = [TestJob]
```

## Config
Make sure to register the provider inside `start/app.js` file.

```js
const providers = ["adonis-bull-queue-provider/provider"];
```

Config redis with adonis and then your `.env` file

```bash
  REDIS_HOST=127.0.0.1
  REDIS_PORT=6379
```
## Commands
### Make a Job
You can initiate a Job using adonis CLI
```bash
adonis make:job Folder/JobName
```

### Listener
You can initiate listen jobs with
```bash
adonis job:listen
```

## Add item in queue.

```js
const Queue = use("Bull/Queue");
  class{
    method(ctx){
      Queue.add("TestJob", { msg: "Params to queue..." })
    }
}
```

## Example
- Make a job file with adonis cli. You can use Bull events if necessary.

```js
class TestJob {
  constructor () {
    this.key = 'TestJob'
    this.options = {
      delay: 5000
    }
  }

  async handle (job, done) {
    job.progress(1)
    console.log('Logic Here!!!')
    job.progress(100)
    done(null, { msg: 'okay' })
  }
  
 async errorEvent (error) {
    console.log('Queue error')
  }

  async waitingEvent (jobId) {
    console.log('Queue waiting')
  }
  other....
}
module.exports = new TestJob()
```

