import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import proxyquire from 'proxyquire';
import {stub} from 'sinon';
import {MockSocket} from '../../../server/mocks/socket';

const socket = new MockSocket();

const Player = proxyquire('../../../../client/components/gm/player', {
  'react-redux': {connect: stub().returns(stub().returnsArg(0))},
  '../../socket': {default: socket}
}).default;

const player = {
  id: 'some-id',
  name: 'Mr. Some Name',
  willpower: 9,
  goal: 'Some goal',
  goalLevel: 2,
  skills: ['A', 'B', 'C'],
  points: 2
};

const render = (props = {}) => shallow(<Player data={player} {...props}/>);

test('it renders the players name', t => {
  const wrapper = render();

  const name = wrapper.find('[data-type="name"]');

  t.is(name.length, 1);
  t.is(name.text(), player.name);
});

test('it renders a willpower component', t => {
  const wrapper = render();

  const willpower = wrapper.find('Willpower');

  t.is(willpower.length, 1);

  const props = willpower.props();
  t.is(props.playerId, player.id);
  t.is(props.value, player.willpower);
});

test('it renders a goal component', t => {
  const wrapper = render();
  const goal = wrapper.find('Goal');

  t.is(goal.length, 1);
  const props = goal.props();

  t.is(props.name, player.goal);
  t.is(props.value, player.goalLevel);
});

test('it emits a setGoalLevel event on changing the goal level', t => {
  const wrapper = render();
  const goal = wrapper.find('Goal');
  const value = 2;

  goal.simulate('change', value);

  t.true(socket.emit.calledWith('setGoalLevel', {amount: value, player: player.id}));
});

test('it renders the players score', t => {
  const wrapper = render();

  const score = wrapper.find('[data-type="score"]');

  t.is(score.length, 1);
  t.is(score.text(), player.points.toString());
});

test('it renders the players skills', t => {
  const wrapper = render();

  const skillsList = wrapper.find('[data-type="skills"]');

  t.is(skillsList.length, 1);

  const skills = skillsList.find('li');

  t.is(skills.length, player.skills.length);

  for (let i = 0; i < player.skills.length; i++) {
    const skill = skills.at(i);

    t.is(skill.text(), player.skills[i]);
  }
});
