'use strict';

const $oracledb = require('oracledb');
const introduce = require('introduce')(__dirname);
const wrapConnection = introduce('lib/connWrapper');
const wrapPool = introduce('lib/poolWrapper');

const properties = [
  'autoCommit', 'connectionClass', 'externalAuth', 'fetchAsString',
  'lobPrefetchSize', 'maxRows', 'oracleClientVersion', 'outFormat',
  'poolIncrement', 'poolMax', 'poolMin', 'poolTimeout', 'prefetchRows',
  'queueRequests', 'queueTimeout', 'stmtCacheSize', 'version'
];

/**
 * Used by the driver's `getConnection()` methods to connect to the database.
 *
 * @typedef {object} LoginDetails
 * @property {string} user The username to connect as.
 * @property {string} password The user's password.
 * @property {string} connectString The address, port, and sid to connect to.
 *                Alternatively, if you have a tnsnames.ora in your environment
 *                then you can use a TNS name here.
 */

/**
 * Wraps an instance of `oracledb` and provides a `Promise` based interface
 * to the driver.
 *
 * @param {LoginDetails} loginDetails
 * @param {object} oracledb An instance of the driver to use for the connection.
 * @constructor
 */
function Oracle(loginDetails, oracledb) {
  if (!loginDetails || !oracledb) {
    throw new Error('must supply login details and oracledb instance');
  }
  this.loginDetails = loginDetails;
  this.connection = null;
  this.pool = null;

  for (const prop of properties) {
    Object.defineProperty(this, prop, {
      get() {
        return oracledb[prop];
      },
      set(value) {
        oracledb[prop] = value;
      }
    });
  }
}

Oracle.ARRAY = $oracledb.ARRAY;
Oracle.BIND_IN = $oracledb.BIND_IN;
Oracle.BIND_INOUT = $oracledb.BIND_INOUT;
Oracle.BIND_OUT = $oracledb.BIND_OUT;
Oracle.BLOB = $oracledb.BLOB;
Oracle.BUFFER = $oracledb.BUFFER;
Oracle.CLOB = $oracledb.CLOB;
Oracle.CURSOR = $oracledb.CURSOR;
Oracle.DATE = $oracledb.DATE;
Oracle.DEFAULT = $oracledb.DEFAULT;
Oracle.NUMBER = $oracledb.NUMBER;
Oracle.OBJECT = $oracledb.OBJECT;
Oracle.STRING = $oracledb.STRING;

/**
 * Create a single connection to the database.
 *
 * @returns {Promise} Rejection contains an `Error`. Resolution passes in
 * an instance of {@link WrappedConnection}.
 */
Oracle.prototype.getConnection = function getConnection() {
  return new Promise((resolve, reject) => {
    $oracledb.getConnection(this.loginDetails, (err, connection) => {
      if (err) {
        return reject(err);
      }
      this.connection = wrapConnection(connection);
      return resolve(this.connection);
    });
  });
};

/**
 * Create a pool of connections to the database.
 *
 * @see https://github.com/oracle/node-oracledb/blob/master/doc/api.md#connpooling
 *
 * @param {object} poolOptions Options for configuring the pool, e.g. the
 * minimum and maximum number of connections. This object should **only**
 * contain the options specific to the pool. The original {@link loginDetails}
 * passed to {@link Oracle} will be added automatically.
 * @returns {Promise} Rejection contains an `Error`. Resolution passes in an
 * instance of {@link WrappedPool}.
 */
Oracle.prototype.createPool = function createPool(poolOptions) {
  const _options = Object.assign(this.loginDetails, poolOptions || {});
  return new Promise((resolve, reject) => {
    $oracledb.createPool(_options, (err, pool) => {
      if (err) {
        return reject(err);
      }
      this.pool = wrapPool(pool);
      return resolve(this.pool);
    });
  });
};

module.exports = Oracle;
