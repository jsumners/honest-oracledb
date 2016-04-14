'use strict';
/* eslint arrow-body-style: "off" */

const introduce = require('introduce')(__dirname);
const wrapResultSet = introduce('./resultSetWrapper');

/**
 * Wraps an `oracledb` connection with `Promise` based methods. All methods
 * except for {@link WrappedConnection#queryStream} return a `Promise`.
 *
 * @see https://github.com/oracle/node-oracledb/blob/master/doc/api.md#connectionclass
 *
 * @param {object} connection An `oracledb` connection instance.
 * @constructor
 */
function WrappedConnection(connection) {
  /* eslint no-empty-function: "off" */
  Object.defineProperty(this, 'connection', {
    enumerable: false,
    writable: false,
    value: connection
  });

  /* eslint accessor-pairs: "off" */
  Object.defineProperties(this, {
    action: {
      get() { return null; },
      set(value) {
        this.connection.action = value;
      }
    },

    clientId: {
      get() { return null; },
      set(value) {
        this.connection.clientId = value;
      }
    },

    module: {
      get() { return null; },
      set(value) {
        this.connection.module = value;
      }
    },

    oracleServerVersion: {
      get() {
        return this.connection.oracleServerVersion;
      },
      set() {}
    },

    stmtCacheSize: {
      get() {
        return this.connection.stmtCacheSize;
      },
      set() {}
    }
  });
}

/**
 * Stops any currently running operation.
 * @returns {Promise} The resolution is empty. Rejection contains an `Error`.
 */
WrappedConnection.prototype.break = function _break() {
  return new Promise((resolve, reject) =>
    this.connection.break((err) => {
      return (err) ? reject(err) : resolve();
    })
  );
};

/**
 * Commits the current transaction.
 * @returns {Promise} The resolution is empty. Rejection contains an `Error`.
 */
WrappedConnection.prototype.commit = function commit() {
  return new Promise((resolve, reject) =>
    this.connection.commit((err) => {
      return (err) ? reject(err) : resolve();
    })
  );
};

/**
 * Perform a query against the database. If the query does not contain any
 * parameters, but you do want to supply options, then you must pass an empty
 * array (`[]`) as the second parameter.
 *
 * @returns {Promise} Rejection contains an `Error`. Resolution passes a results
 * object. If you supplied `{resultSet: true}` in the options, then the
 * `results.resultSet` will be an instance of {@link WrappedResultSet}.
 * Otherwise, iterate `results.rows` for your data.
 */
WrappedConnection.prototype.execute = function execute() {
  return new Promise((resolve, reject) =>
    this.connection.execute.apply(
      this.connection,
      [].concat(Array.from(arguments), (err, results) => {
        if (results.resultSet && toString.call(results.resultSet) === '[object ResultSet]') {
          results.resultSet = wrapResultSet(results.resultSet);
        }
        return (err) ? reject(err) : resolve(results);
      })
    )
  );
};

/**
 * This method merely invokes the regular `queryStream` method. It does not
 * return a `Promise`.
 *
 * @see https://github.com/oracle/node-oracledb/blob/master/doc/api.md#querystream
 * @returns {Stream}
 */
WrappedConnection.prototype.queryStream = function stream() {
  return this.connection.stream.apply(this.connection, Array.from(arguments));
};

/**
 * Close the connection. Should be invoked whenever you are done with the
 * connection.
 *
 * @returns {Promise} Resolution is empty. Rejection contains an `Error`.
 */
WrappedConnection.prototype.release = function release() {
  return new Promise((resolve, reject) =>
    this.connection.release((err) => {
      return (err) ? reject(err) : resolve();
    })
  );
};

/**
 * Abort the current transaction and undo any actions performed during said
 * transaction.
 *
 * @returns {Promise} Resolution is empty. Rejection contains an `Error`.
 */
WrappedConnection.prototype.rollback = function rollback() {
  return new Promise((resolve, reject) =>
    this.connection.rollback((err) => {
      return (err) ? reject(err) : resolve();
    })
  );
};

module.exports = function wrapConnection(connection) {
  return new WrappedConnection(connection);
};
