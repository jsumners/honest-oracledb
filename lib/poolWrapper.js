'use strict';
/* eslint arrow-body-style: "off" */

const introduce = require('introduce')(__dirname);
const wrapConnection = introduce('./connWrapper');

/**
 * Wraps an `oracledb` pooled connection with a `Promise` based interface.
 *
 * @see https://github.com/oracle/node-oracledb/blob/master/doc/api.md#poolclass
 *
 * @param {object} pool An instance of an oracledb pool.
 * @constructor
 */
function WrappedPool(pool) {
  Object.defineProperty(this, 'pool', {
    enumerable: false,
    writeable: false,
    value: pool
  });

  /* eslint no-empty-function: "off" */
  Object.defineProperties(this, {
    connectionsInUse: {
      set() {},
      get() {
        return this.pool.connectionsInUse;
      }
    },

    connectionsOpen: {
      set() {},
      get() {
        return this.pool.connectionsOpen;
      }
    },

    poolIncrement: {
      set() {},
      get() {
        return this.pool.poolIncrement;
      }
    },

    poolMax: {
      set() {},
      get() {
        return this.pool.poolMax;
      }
    },

    poolMin: {
      set() {},
      get() {
        return this.pool.poolMin;
      }
    },

    poolTimeout: {
      set() {},
      get() {
        return this.pool.poolTimeout;
      }
    },

    queueRequests: {
      set() {},
      get() {
        return this.pool.queueRequests;
      }
    },

    queueTimeout: {
      set() {},
      get() {
        return this.pool.queueTimeout;
      }
    },

    stmtCacheSize: {
      set() {},
      get() {
        return this.pool.stmtCacheSize;
      }
    }
  });
}

/**
 * Retrieve a single connection from the pool.
 *
 * @returns {Promise} Rejection contains an `Error`. Resolution passes in
 * an instance of {@link WrappedConnection}.
 */
WrappedPool.prototype.getConnection = function getConnection() {
  return new Promise((resolve, reject) =>
    this.pool.getConnection((err, connection) => {
      return (err) ? reject(err) : resolve(wrapConnection(connection));
    })
  );
};

/**
 * Empty and close the pool. Should be invoked whenever you are done with the
 * pool.
 *
 * @returns {Promise} Resolution is empty. Rejection contains an `Error`.
 */
WrappedPool.prototype.terminate = function terminate() {
  return new Promise((resolve, reject) =>
    this.pool.terminate((err) => {
      return (err) ? reject(err) : resolve();
    })
  );
};

module.exports = function wrapPool(pool) {
  return new WrappedPool(pool);
};
