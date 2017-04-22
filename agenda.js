
const MONGO_URL = process.env.MONGO_URL;
const agenda = new require('Agenda')({ db: { address: MONGO_URL } });
const {producer} = require('./producer.js');

const COMMAND = process.env.COMMAND;
const ARGUMENTS = process.env.ARGUMENTS;
const SCHEDULE = process.env.SCHEDULE || 'every 5 minutes';

agenda.define('sickrage', function (job, done) {
  console.log('job started');
  producer(COMMAND, ARGUMENTS)
    .then((objSaved) => {
      console.log('job ended');
      done();
    })
    .catch((error) => {
      done(error);
    })

});

function graceful() {
  agenda.stop(function () {
    process.exit(0);
  });
}


agenda.on('ready', function () {
  agenda.schedule(SCHEDULE, 'sickrage');
  agenda.start();
});


process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);