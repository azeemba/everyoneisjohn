import test from 'ava';

import Game from '../../server/models/game';
import Player from '../../server/models/player';
import {socket} from '../mocks';

const genGame = owner => new Game(owner);
const genPlayer = () => new Player(socket);
const genPlayers = num => new Array(num).fill(1).map(_ => genPlayer());

test('it has an ID', t => {
  const game = genGame();

  t.is(typeof game.id, 'string');
  t.true(game.id.length === 5);
});

test('has a slug', t => {
  const game = genGame();

  t.is(typeof game.slug, 'string');
});

test('has an owner', t => {
  const owner = genPlayer();
  const game = genGame(owner);

  t.is(game.owner, owner);
});

test('can hold players', t => {
  const game = genGame();

  t.true(Array.isArray(game.players));
});

test('can add players', t => {
  const players = genPlayers(2);
  const game = genGame();

  game.addPlayer(players[0]);
  game.addPlayer(players[1]);

  t.is(game.players.length, 2);

  t.true(game.players.includes(players[0]));
  t.true(game.players.includes(players[1]));
});

test('cannot add duplicate players', t => {
  const player = genPlayer();
  const game = genGame();

  game.addPlayer(player);
  game.addPlayer(player);

  t.is(game.players.length, 1);
});

test('can remove players', t => {
  const player = genPlayer();
  const game = genGame();

  game.addPlayer(player);

  game.removePlayer(player);

  t.is(game.players.length, 0);
  t.false(game.players.includes(player));
});
