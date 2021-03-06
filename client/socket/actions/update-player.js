// @flow

import {store} from '../../store';
import {set} from '../../utils/local-storage';
import {EIJ_PID} from '../../constants/storage-keys';

type Payload = {|
  id: string,
  name: string,
  willpower: number,
  points: number,
  skills: Array<string>,
  goal: string,
  goalLevel: number,
  frozen: boolean
|};

const shouldUpdateId = (payload: Payload): boolean => {
  const {id} = payload;
  const {
    player: {id: playerId},
    game: {isGm}
  } = store.getState();

  if (id && !isGm) {
    if (playerId === id) {
      return false;
    }

    return true;
  }

  return false;
};

const setPlayerInfo = (payload: Payload) => {
  const {game} = store.getState();

  const type = game.isGm ? 'SET_GAME_PLAYER_INFO' : 'SET_PLAYER_INFO';

  if (shouldUpdateId(payload)) {
    set(EIJ_PID, payload.id);
  }

  store.dispatch({
    type,
    payload
  });
};

export default setPlayerInfo;
