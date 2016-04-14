'use strict';
/* eslint arrow-body-style: "off" */

/**
 * Wraps an `oracledb` `ResultSet` with a `Promise` interface.
 *
 * @see https://github.com/oracle/node-oracledb/blob/master/doc/api.md#resultsetclass
 *
 * @param {object} resultSet An intance of `ResultSet`.
 * @constructor
 */
function WrappedResultSet(resultSet) {
  Object.defineProperty(this, 'resultSet', {
    enumerable: false,
    writable: false,
    value: resultSet
  });

  /* eslint no-empty-function: "off" */
  Object.defineProperty(this, 'metaData', {
    get() {
      return this.resultSet.metaData;
    },
    set() {}
  });
}

/**
 * Closes the set. This should be invoked whenever you are finished with the
 * set.
 *
 * @returns {Promise} Resolution is empty. Rejection contains an `Error`.
 */
WrappedResultSet.prototype.close = function close() {
  return new Promise((resolve, reject) =>
    this.resultSet.close((err) => {
      return (err) ? reject(err) : resolve();
    })
  );
};

/**
 * Retrieve the next row from the results.
 *
 * @returns {Promise} Rejection contains an `Error`. Resolution passes in an
 * `object` representing the row.
 */
WrappedResultSet.prototype.getRow = function getRow() {
  return new Promise((resolve, reject) =>
    this.resultSet.getRow((err, row) => {
      return (err) ? reject(err) : resolve(row);
    })
  );
};

/**
 * Retrieve the next `count` number of rows from the set.
 *
 * @see https://github.com/oracle/node-oracledb/blob/master/doc/api.md#getrows
 * @param {number} count The number of rows to retrieve.
 * @returns {Promise} Rejection contains an `Error`. Resolution passes in the
 * results in whatever format is specified via the `outFormat` option.
 */
WrappedResultSet.prototype.getRows = function getRows(count) {
  return new Promise((resolve, reject) =>
    this.resultSet.getRows(count, (err, rows) => {
      return (err) ? reject(err) : resolve(rows);
    })
  );
};

module.exports = function wrapResultSet(resultSet) {
  return new WrappedResultSet(resultSet);
};
