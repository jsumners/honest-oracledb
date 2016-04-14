## Classes

<dl>
<dt><a href="#Oracle">Oracle</a></dt>
<dd></dd>
<dt><a href="#WrappedConnection">WrappedConnection</a></dt>
<dd></dd>
<dt><a href="#WrappedPool">WrappedPool</a></dt>
<dd></dd>
<dt><a href="#WrappedResultSet">WrappedResultSet</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#LoginDetails">LoginDetails</a> : <code>object</code></dt>
<dd><p>Used by the driver&#39;s <code>getConnection()</code> methods to connect to the database.</p>
</dd>
</dl>

<a name="Oracle"></a>

## Oracle
**Kind**: global class  

* [Oracle](#Oracle)
    * [new Oracle(loginDetails, oracledb)](#new_Oracle_new)
    * [.getConnection()](#Oracle+getConnection) ⇒ <code>Promise</code>
    * [.createPool(poolOptions)](#Oracle+createPool) ⇒ <code>Promise</code>

<a name="new_Oracle_new"></a>

### new Oracle(loginDetails, oracledb)
Wraps an instance of `oracledb` and provides a `Promise` based interface
to the driver.


| Param | Type | Description |
| --- | --- | --- |
| loginDetails | <code>[LoginDetails](#LoginDetails)</code> |  |
| oracledb | <code>object</code> | An instance of the driver to use for the connection. |

<a name="Oracle+getConnection"></a>

### oracle.getConnection() ⇒ <code>Promise</code>
Create a single connection to the database.

**Kind**: instance method of <code>[Oracle](#Oracle)</code>  
**Returns**: <code>Promise</code> - Rejection contains an `Error`. Resolution passes in
an instance of [WrappedConnection](#WrappedConnection).  
<a name="Oracle+createPool"></a>

### oracle.createPool(poolOptions) ⇒ <code>Promise</code>
Create a pool of connections to the database.

**Kind**: instance method of <code>[Oracle](#Oracle)</code>  
**Returns**: <code>Promise</code> - Rejection contains an `Error`. Resolution passes in an
instance of [WrappedPool](#WrappedPool).  
**See**: https://github.com/oracle/node-oracledb/blob/master/doc/api.md#connpooling  

| Param | Type | Description |
| --- | --- | --- |
| poolOptions | <code>object</code> | Options for configuring the pool, e.g. the minimum and maximum number of connections. This object should **only** contain the options specific to the pool. The original [loginDetails](loginDetails) passed to [Oracle](#Oracle) will be added automatically. |

<a name="WrappedConnection"></a>

## WrappedConnection
**Kind**: global class  
**See**: https://github.com/oracle/node-oracledb/blob/master/doc/api.md#connectionclass  

* [WrappedConnection](#WrappedConnection)
    * [new WrappedConnection(connection)](#new_WrappedConnection_new)
    * [.break()](#WrappedConnection+break) ⇒ <code>Promise</code>
    * [.commit()](#WrappedConnection+commit) ⇒ <code>Promise</code>
    * [.execute()](#WrappedConnection+execute) ⇒ <code>Promise</code>
    * [.queryStream()](#WrappedConnection+queryStream) ⇒ <code>Stream</code>
    * [.release()](#WrappedConnection+release) ⇒ <code>Promise</code>
    * [.rollback()](#WrappedConnection+rollback) ⇒ <code>Promise</code>

<a name="new_WrappedConnection_new"></a>

### new WrappedConnection(connection)
Wraps an `oracledb` connection with `Promise` based methods. All methods
except for [queryStream](#WrappedConnection+queryStream) return a `Promise`.


| Param | Type | Description |
| --- | --- | --- |
| connection | <code>object</code> | An `oracledb` connection instance. |

<a name="WrappedConnection+break"></a>

### wrappedConnection.break() ⇒ <code>Promise</code>
Stops any currently running operation.

**Kind**: instance method of <code>[WrappedConnection](#WrappedConnection)</code>  
**Returns**: <code>Promise</code> - The resolution is empty. Rejection contains an `Error`.  
<a name="WrappedConnection+commit"></a>

### wrappedConnection.commit() ⇒ <code>Promise</code>
Commits the current transaction.

**Kind**: instance method of <code>[WrappedConnection](#WrappedConnection)</code>  
**Returns**: <code>Promise</code> - The resolution is empty. Rejection contains an `Error`.  
<a name="WrappedConnection+execute"></a>

### wrappedConnection.execute() ⇒ <code>Promise</code>
Perform a query against the database. If the query does not contain any
parameters, but you do want to supply options, then you must pass an empty
array (`[]`) as the second parameter.

**Kind**: instance method of <code>[WrappedConnection](#WrappedConnection)</code>  
**Returns**: <code>Promise</code> - Rejection contains an `Error`. Resolution passes a results
object. If you supplied `{resultSet: true}` in the options, then the
`results.resultSet` will be an instance of [WrappedResultSet](#WrappedResultSet).
Otherwise, iterate `results.rows` for your data.  
<a name="WrappedConnection+queryStream"></a>

### wrappedConnection.queryStream() ⇒ <code>Stream</code>
This method merely invokes the regular `queryStream` method. It does not
return a `Promise`.

**Kind**: instance method of <code>[WrappedConnection](#WrappedConnection)</code>  
**See**: https://github.com/oracle/node-oracledb/blob/master/doc/api.md#querystream  
<a name="WrappedConnection+release"></a>

### wrappedConnection.release() ⇒ <code>Promise</code>
Close the connection. Should be invoked whenever you are done with the
connection.

**Kind**: instance method of <code>[WrappedConnection](#WrappedConnection)</code>  
**Returns**: <code>Promise</code> - Resolution is empty. Rejection contains an `Error`.  
<a name="WrappedConnection+rollback"></a>

### wrappedConnection.rollback() ⇒ <code>Promise</code>
Abort the current transaction and undo any actions performed during said
transaction.

**Kind**: instance method of <code>[WrappedConnection](#WrappedConnection)</code>  
**Returns**: <code>Promise</code> - Resolution is empty. Rejection contains an `Error`.  
<a name="WrappedPool"></a>

## WrappedPool
**Kind**: global class  
**See**: https://github.com/oracle/node-oracledb/blob/master/doc/api.md#poolclass  

* [WrappedPool](#WrappedPool)
    * [new WrappedPool(pool)](#new_WrappedPool_new)
    * [.getConnection()](#WrappedPool+getConnection) ⇒ <code>Promise</code>
    * [.terminate()](#WrappedPool+terminate) ⇒ <code>Promise</code>

<a name="new_WrappedPool_new"></a>

### new WrappedPool(pool)
Wraps an `oracledb` pooled connection with a `Promise` based interface.


| Param | Type | Description |
| --- | --- | --- |
| pool | <code>object</code> | An instance of an oracledb pool. |

<a name="WrappedPool+getConnection"></a>

### wrappedPool.getConnection() ⇒ <code>Promise</code>
Retrieve a single connection from the pool.

**Kind**: instance method of <code>[WrappedPool](#WrappedPool)</code>  
**Returns**: <code>Promise</code> - Rejection contains an `Error`. Resolution passes in
an instance of [WrappedConnection](#WrappedConnection).  
<a name="WrappedPool+terminate"></a>

### wrappedPool.terminate() ⇒ <code>Promise</code>
Empty and close the pool. Should be invoked whenever you are done with the
pool.

**Kind**: instance method of <code>[WrappedPool](#WrappedPool)</code>  
**Returns**: <code>Promise</code> - Resolution is empty. Rejection contains an `Error`.  
<a name="WrappedResultSet"></a>

## WrappedResultSet
**Kind**: global class  
**See**: https://github.com/oracle/node-oracledb/blob/master/doc/api.md#resultsetclass  

* [WrappedResultSet](#WrappedResultSet)
    * [new WrappedResultSet(resultSet)](#new_WrappedResultSet_new)
    * [.close()](#WrappedResultSet+close) ⇒ <code>Promise</code>
    * [.getRow()](#WrappedResultSet+getRow) ⇒ <code>Promise</code>
    * [.getRows(count)](#WrappedResultSet+getRows) ⇒ <code>Promise</code>

<a name="new_WrappedResultSet_new"></a>

### new WrappedResultSet(resultSet)
Wraps an `oracledb` `ResultSet` with a `Promise` interface.


| Param | Type | Description |
| --- | --- | --- |
| resultSet | <code>object</code> | An intance of `ResultSet`. |

<a name="WrappedResultSet+close"></a>

### wrappedResultSet.close() ⇒ <code>Promise</code>
Closes the set. This should be invoked whenever you are finished with the
set.

**Kind**: instance method of <code>[WrappedResultSet](#WrappedResultSet)</code>  
**Returns**: <code>Promise</code> - Resolution is empty. Rejection contains an `Error`.  
<a name="WrappedResultSet+getRow"></a>

### wrappedResultSet.getRow() ⇒ <code>Promise</code>
Retrieve the next row from the results.

**Kind**: instance method of <code>[WrappedResultSet](#WrappedResultSet)</code>  
**Returns**: <code>Promise</code> - Rejection contains an `Error`. Resolution passes in an
`object` representing the row.  
<a name="WrappedResultSet+getRows"></a>

### wrappedResultSet.getRows(count) ⇒ <code>Promise</code>
Retrieve the next `count` number of rows from the set.

**Kind**: instance method of <code>[WrappedResultSet](#WrappedResultSet)</code>  
**Returns**: <code>Promise</code> - Rejection contains an `Error`. Resolution passes in the
results in whatever format is specified via the `outFormat` option.  
**See**: https://github.com/oracle/node-oracledb/blob/master/doc/api.md#getrows  

| Param | Type | Description |
| --- | --- | --- |
| count | <code>number</code> | The number of rows to retrieve. |

<a name="LoginDetails"></a>

## LoginDetails : <code>object</code>
Used by the driver's `getConnection()` methods to connect to the database.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | The username to connect as. |
| password | <code>string</code> | The user's password. |
| connectString | <code>string</code> | The address, port, and sid to connect to.                Alternatively, if you have a tnsnames.ora in your environment                then you can use a TNS name here. |

