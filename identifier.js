// @flow

const { inspect } = require('util')
const Sid = require('./sanitised-identifier')

/*::

export type Identifier =
  | string
  | Sid
  | $ReadOnlyArray<Sid | string>

*/

const keywords = [
  'add',
  'all',
  'alter',
  'and',
  'any',
  'as',
  'asc',
  'authorization',
  'backup',
  'begin',
  'between',
  'break',
  'browse',
  'bulk',
  'by',
  'cascade',
  'case',
  'check',
  'checkpoint',
  'close',
  'clustered',
  'coalesce',
  'collate',
  'column',
  'commit',
  'compute',
  'constraint',
  'contains',
  'containstable',
  'continue',
  'convert',
  'create',
  'cross',
  'current',
  'current_date',
  'current_time',
  'current_timestamp',
  'current_user',
  'cursor',
  'database',
  'dbcc',
  'deallocate',
  'declare',
  'default',
  'delete',
  'deny',
  'desc',
  'disk',
  'distinct',
  'distributed',
  'double',
  'drop',
  'dump',
  'else',
  'end',
  'errlvl',
  'escape',
  'except',
  'exec',
  'execute',
  'exists',
  'exit',
  'external',
  'fetch',
  'file',
  'fillfactor',
  'for',
  'foreign',
  'freetext',
  'freetexttable',
  'from',
  'full',
  'function',
  'goto',
  'grant',
  'group',
  'group',
  'having',
  'holdlock',
  'identity',
  'identity_insert',
  'identitycol',
  'if',
  'in',
  'index',
  'inner',
  'insert',
  'intersect',
  'into',
  'is',
  'join',
  'key',
  'kill',
  'label',
  'left',
  'like',
  'lineno',
  'load',
  'merge',
  'national',
  'nocheck',
  'nonclustered',
  'not',
  'null',
  'nullif',
  'of',
  'off',
  'offsets',
  'on',
  'open',
  'opendatasource',
  'openquery',
  'openrowset',
  'openxml',
  'option',
  'or',
  'order',
  'outer',
  'over',
  'percent',
  'pivot',
  'plan',
  'precision',
  'primary',
  'print',
  'proc',
  'procedure',
  'public',
  'raiserror',
  'read',
  'readtext',
  'reconfigure',
  'references',
  'replication',
  'restore',
  'restrict',
  'return',
  'revert',
  'revoke',
  'right',
  'rollback',
  'rowcount',
  'rowguidcol',
  'rule',
  'save',
  'schema',
  'securityaudit',
  'select',
  'semantickeyphrasetable',
  'semanticsimilaritydetailstable',
  'semanticsimilaritytable',
  'session_user',
  'set',
  'setuser',
  'shutdown',
  'some',
  'statistics',
  'system_user',
  'table',
  'tablesample',
  'textsize',
  'then',
  'to',
  'top',
  'tran',
  'transaction',
  'trigger',
  'truncate',
  'try_convert',
  'tsequal',
  'union',
  'unique',
  'unpivot',
  'update',
  'updatetext',
  'use',
  'user',
  'values',
  'varying',
  'view',
  'waitfor',
  'when',
  'where',
  'while',
  'with',
  'within',
  'writetext'
]

const isKeyword /*: {| [string]: ?true |} */ =
  keywords.reduce((r /*: { ... } */, _ /*: string */) => ({ ...r, [_]: true }), {})

const isPlain /*: string => boolean */ =
  value => (
    !isKeyword[value.toLowerCase()] &&
    !!String(value).match(/^[a-z_][a-z0-9_]*$/i)
  )

const quote =
  value => {
    const value_ = String(value)
    if (value_.indexOf(']') !== -1) {
      throw new TypeError(`Expected identifier without ] character, got ${inspect(value)}.`)
    }
    return '[' + String(value) + ']'
  }

const identifier /*: Identifier => Sid */ =
  x => {
    if (x instanceof Sid) {
      return x
    }
    if (typeof x === 'string') {
      return new Sid(x.split('.').map(_ => isPlain(_) ? _ : quote(_)).join('.'))
    }
    if (Array.isArray(x) && x.every(_ => typeof _ === 'string' || _ instanceof Sid)) {
      return new Sid(x.map(identifier).map(_ => _.toString()).join('.'))
    }
    throw new TypeError(`Can't sanitise ${inspect(x)} identifier.`)
  }

module.exports = identifier
