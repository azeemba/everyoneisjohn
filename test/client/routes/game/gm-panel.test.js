import test from 'ava';
import {shallow} from 'enzyme';
import proxyquire from 'proxyquire';
import {stub} from 'sinon';
import uuid from 'uuid/v4';
import React from 'react';

const Player = () => <div/>;
const GameControls = () => <div/>;
const Header = () => <div/>;

const GMPanel = proxyquire('../../../../client/routes/game/gm-panel', {
  'react-router-dom': {withRouter: stub().returnsArg(0)},
  'react-redux': {connect: stub().returns(stub().returnsArg(0))},
  '../../components/gm/player': {default: Player},
  '../../components/gm/game-controls': {default: GameControls},
  '../../components/header': {default: Header}
}).default;

const render = (props = {}) => {
  const match = {
    params: {id: 'abcde'}
  };
  return shallow(<GMPanel {...props} match={match}/>);
};

test('it renders a list of Players', t => {
  const players = [{id: uuid()}, {id: uuid()}];
  const wrapper = render({players});

  const playerElems = wrapper.find('Player');

  t.is(playerElems.length, 2);

  t.deepEqual(playerElems.at(0).props().id, players[0].id);
  t.deepEqual(playerElems.at(1).props().id, players[1].id);
});

test('it renders a GameControls component', t => {
  const wrapper = render({players: []});
  const controls = wrapper.find('GameControls');

  t.is(controls.length, 1);
});

test('it renders a Header component', t => {
  const wrapper = render({players: []});
  const header = wrapper.find('Header');

  t.is(header.length, 1);
});
