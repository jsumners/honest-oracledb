'use strict';
/* eslint arrow-body-style: "off" */

const introduce = require('introduce');
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

  Object.defineProperties(this, {
    connectionsInUse: {
      writable: false,
      get() {
        return this.pool.connectionsInUse;
      }
    },

    connectionsOpen: {
      writable: false,
      get() {
        return this.pool.connectionsOpen;
      }
    },

    poolIncrement: {
      writable: false,
      get() {
        return this.pool.poolIncrement;
      }
    },

    poolMax: {
      writeable: false,
      get() {
        return this.pool.poolMax;
      }
    },

    poolMin: {
      writeable: false,
      get() {
        return this.pool.poolMin;
      }
    },

    poolTimeout: {
      writeable: false,
      get() {
        return this.pool.poolTimeout;
      }
    },

    queueRequests: {
      writeable: false,
      get() {
        return this.pool.queueRequests;
      }
    },

    queueTimeout: {
      writeable: false,
      get() {
        return this.pool.queueTimeout;
      }
    },

    stmtCacheSize: {
      writeable: false,
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
