// @flow

import React from 'react';
import uuid from 'uuid/v4';
import debounce from 'debounce';

import {DEBOUNCE_AMOUNT} from '../../constants/sockets';

import {store} from '../../store';
import globalStyles from '../../sass/global.scss';
import socket from '../../socket';

import styles from './section.scss';

type Props = {|
  frozen: boolean,
  items: Array<string>
|};

type State = {|
  ids: Array<string>
|};

export default class SkillList extends React.Component<Props, State> {
  constructor(...args: any) {
    super(...args);

    const {items} = this.props;
    const ids = [];

    for (let i = 0; i < items.length; i++) {
      ids[i] = uuid();
    }

    this.state = {ids};

    this.handleChange = debounce(this.handleChange, DEBOUNCE_AMOUNT);
  }

  handleInput = (e: SyntheticInputEvent<HTMLInputElement>, index: number) => {
    e.persist();

    const {
      target: {
        value
      }
    } = e;

    store.dispatch({
      type: 'SET_PLAYER_INFO',
      payload: {
        [`skill${index + 1}`]: value
      }
    });
    this.handleChange(value, index);
  }

  handleChange = (value: string, index: number) => {
    const content = value.trim();

    socket.emit('updateStats', {
      skill: {
        number: index + 1,
        content
      }
    });
  }

  renderSkill = (skill: string, index: number) => {
    const {frozen} = this.props;
    const {ids} = this.state;

    if (frozen) {
      return <span>{skill}</span>;
    }

    return (
      <div className={styles.skill}>
        <input
          key={`skill-input-${ids[index]}`}
          type="text"
          className={globalStyles.input}
          value={skill}
          placeholder="Enter a skill"
          onInput={e => this.handleInput(e, index)}
          onChange={e => this.handleInput(e, index)}
        />
      </div>
    );
  }

  render() {
    const {ids} = this.state;
    const {items} = this.props;

    return (
      <div className={styles.section}>
        <p className={styles.title}>You have a particular set of skills:</p>
        <ul data-type="skills">
          {items.map((skill, index) => (
            <li key={`skill-index-${ids[index]}`}>
              {this.renderSkill(skill, index)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
