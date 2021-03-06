import test from 'ava';
import proxyquire from 'proxyquire';
import {stub} from 'sinon';

import {CONNECTED} from '../../../client/constants/connection-status';
import {MAX_RECONNECTS, RECONNECT_DELAY} from '../../../client/constants/settings';

const socket = {
  on: stub().callsFake((_, fn) => fn()),
  emit: stub()
};

const setConn = stub();
const _ioSetup = stub();
const io = (...args) => {
  _ioSetup(...args);
  return {
    connect: stub().returns(socket)
  };
};

const applyHandlers = stub();
const id = 'some-id';

// At best, this is a workaround to ensure that the caching does not happen
proxyquire.noCallThru();
proxyquire.noPreserveCache();
const common = {
  'socket.io-client': io,
  './handlers': {applyHandlers},
  '../actions/set-connection-status': setConn
};

const client = proxyquire('../../../client/socket/client', {
  ...common,
  '../utils/local-storage': {get: stub().returns(null)}
}).default;

const clientWithId = proxyquire('../../../client/socket/client', {
  ...common,
  '../utils/local-storage': {get: stub().returns(id)}
}).default;

test('it initializes the socket with reconnectionAttempts', t => {
  client();

  t.true(_ioSetup.calledWith({
    reconnectionAttempts: MAX_RECONNECTS,
    reconnectionDelay: RECONNECT_DELAY,
    reconnectionDelayMax: RECONNECT_DELAY * 2,
    randomizationFactor: 0
  }));
});

test('it registers an on connect handler', t => {
  client();

  t.true(socket.on.calledWith('connect'));
});

test('it registers handlers', t => {
  client();

  t.true(applyHandlers.calledWith(socket));
});

test('it emits an initPlayer event with an id if one exists', t => {
  clientWithId();

  t.true(socket.emit.calledWith('initPlayer', id));
});

test('it emits an initPlayer event without an id if none exists', t => {
  client();

  t.true(socket.emit.calledWith('initPlayer', undefined));
});

test('the connect handler sets the connection status to connected', t => {
  client();

  const {lastCall} = socket.on;
  const fn = lastCall.args[1];
  fn();

  t.true(setConn.calledWith(CONNECTED));
});
