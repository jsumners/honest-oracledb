# honest-oracledb

This library provides a native `Promise` interface to the [oracledb][oracledb]
database driver.

In general, you can rely on the [oracledb documentation][odoc] and simply
assume a `Promise` interface instead of a callback interface. But you can
read [api.md](api.md) for local documentation.

**Notice:** before you can install this library, you *must* setup your
environment as described in the oracledb [install instructions][instructions].
Why they can't ever provide native solutions is a mystery.

[oracledb]: https://www.npmjs.com/package/oracledb
[odoc]: https://github.com/oracle/node-oracledb/blob/master/doc/api.md
[instructions]: https://github.com/oracle/node-oracledb/blob/master/INSTALL.md

## Example

```javascript
// The driver always returns a unique instance of itself upon require.
// `honest-oracledb` needs a unique instance to do things.
const oracledb = require('oracledb');
const Oracle = require('honest-oracledb');

// This is a connection details object as described in the oracledb
// documentation.
const connDetails = {
  user: 'database_user',
  password: 'database_password',
  connectionString: 'somehost:port/sid' // or whatever
};

// And the moment you've been waiting for...
const oracle = new Oracle(connDetails, oracledb);

oracle
  .getConnection()
  .then((conn) => {
    conn.execute('select 1 from dual')
      .then((results) => {
        console.log('result = %s', results.rows[0][0]); // result = 1
        conn.release();
      });
  });
```

# License

[MIT License](http://jsumners.mit-license.org/)
