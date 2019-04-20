import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import {stub} from 'sinon';

import Willpower from '../../../../client/components/gm/willpower';

const defaultProps = {
  value: 3,
  onChange: stub()
};

const render = (props = defaultProps) => {
  return shallow(<Willpower {...props}/>);
};

test('it renders player willpower', t => {
  const wrapper = render();
  const value = wrapper.find('[data-type="value"]');

  t.is(value.length, 1);
  t.is(value.text(), defaultProps.value.toString());
});

test('it increments the willpower upon clicking the plus button', t => {
  const wrapper = render();

  const button = wrapper.find('[data-action="increment"]');

  t.is(button.length, 1);

  button.simulate('click');

  t.true(defaultProps.onChange.calledWith(1));
});

test('it decrements the willpower upon clicking the minus button', t => {
  const wrapper = render();

  const button = wrapper.find('[data-action="decrement"]');

  t.is(button.length, 1);

  button.simulate('click');

  t.true(defaultProps.onChange.calledWith(-1));
});
