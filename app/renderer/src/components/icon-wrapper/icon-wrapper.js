
import PropTypes from 'prop-types';
import React from 'react';
import { compose, style } from 'glamor';

const {isDarkModeEnabled} = require('../../../../main/utils/helpers');

const iconImg = style({
  maxWidth: 32,
  maxHeight: 32,
  minWidth: 32,
  minHeight: 32,
  objectFit: 'contain',
  backgroundColor: isDarkModeEnabled() ? '#F2F2F2' : 'transparent',
  padding: 4,
});

const iconImgTextBase = compose(
  iconImg,
  style({
    display: 'block',
    backgroundColor: isDarkModeEnabled() ? '#F2F2F2' : '#888',
    color: isDarkModeEnabled() ? '#000' : '#fff',
    textDecoration: 'none',
    textAlign: 'center',
    width: 32,
    height: 32,
    lineHeight: '40px',
    fontSize: 20,
    fontWeight: 'bold',
    borderRadius: 20,
  })
);

const Icon = props => {
  const iconTextStyle = props.icon.bgColor
    ? compose(
        iconImgTextBase,
        props.icon.bgColor &&
          style({
            backgroundColor: props.icon.bgColor,
          })
      )
    : iconImgTextBase;

  switch (props.icon.type) {
    case 'text':
      return (
        <span {...iconTextStyle} role="presentation">
          {props.icon.letter}
        </span>
      );
    default:
      // eslint-disable-line no-fallthrough
      return (
        <img {...iconImg} src={props.icon.path} role="presentation" alt="" />
      );
  }
};

Icon.defaultProps = {
  icon: {
    type: '',
    path: '',
    letter: '',
    bgColor: '',
  },
};

Icon.propTypes = {
  icon: PropTypes.shape({
    type: PropTypes.oneOf(['file', 'text', '']),
    path: PropTypes.string,
    letter: PropTypes.string,
    bgColor: PropTypes.string,
  }),
};

export default Icon;
