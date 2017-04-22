const _ = require('lodash');
const ps = require('ps-node');
const Promise = require('bluebird');
const si = require('systeminformation');

var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const MONGO_URL = process.env.MONGO_URL;
// const COMMAND = process.env.COMMAND;
// const ARGUMENTS = process.env.ARGUMENTS;

const lookup = Promise.promisify(ps.lookup);

exports.producer = (COMMAND, ARGUMENTS) => {
  let db = null;
  let collection = null;
  let proc = null;
  let sysInfo = {};
  return lookup({
    command: COMMAND,
    arguments: ARGUMENTS,
  })
    .then((procList) => {
      proc = Object.assign(
        {},
        { name: `${COMMAND}-${ARGUMENTS}` },
        { proc: _(procList).first() },
        { status: _(procList).isEmpty() ? "error" : "running" }
      )
      return Promise.all([si.osInfo(), si.currentLoad(), si.mem()])
    })
    .then((sysInfoList) => {
      sysInfo = Object.assign(
        {},
        { os: sysInfoList[0] },
        { load: sysInfoList[1] },
        { mem: sysInfoList[2] }
      )
    })

    .then(() => {
      return MongoClient.connect(MONGO_URL);
    })
    .then(function (conn) {
      db = conn;
      collection = db.collection("status");

      collection.insert(Object.assign(
        {},
        proc,
        sysInfo
      ));
    })
    .then(() => {
      console.log('save to db');
      db.close();
    })
    .catch(function (err) {
      db.close();
      throw err;
    });
}