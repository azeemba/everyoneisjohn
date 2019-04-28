// @flow

import React from 'react';
import uuid from 'uuid/v4';
import debounce from 'debounce';

import {DEBOUNCE_AMOUNT} from '../../constants/sockets';

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
  }

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>, index: number) => {
    const {target: {value}} = e;

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
          defaultValue={skill}
          placeholder="Enter a skill"
          onChange={debounce(e => this.handleChange(e, index), DEBOUNCE_AMOUNT)}
        />
      </div>
    );
  }

  render() {
    const {items} = this.props;
    const {ids} = this.state;

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
