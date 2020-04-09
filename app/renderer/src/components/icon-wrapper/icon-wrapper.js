import {ipcRenderer} from 'electron';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {compose, style} from 'glamor';
import {IPC_FETCH_ICON, IPC_RETRIEVE_ICON} from '../../../../ipc';

const {isDarkModeEnabled} = require('../../../../main/utils/helpers');

const iconImg = style({
  maxWidth: 40,
  maxHeight: 40,
  dislay: 'block',
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
});

const containerImg = style({
  width: 40,
  height: 40,
  minWidth: 40,
  minHeight: 40,
  position: 'relative',
  backgroundColor: isDarkModeEnabled ? '#FFF' : 'transparent',
  padding: 4,
});

const iconImgTextBase = compose(
  iconImg,
  style({
    display: 'block',
    backgroundColor: isDarkModeEnabled ? '#F2F2F2' : '#888',
    color: isDarkModeEnabled ? '#000' : '#fff',
    textDecoration: 'none',
    position: 'relative',
    left: 0,
    top: 0,
    transform: 'none',
    textAlign: 'center',
    width: 40,
    height: 40,
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
      return (
        <div {...containerImg}>
          <img {...iconImg} src={props.icon.path} role="presentation" alt=""/>
        </div>
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

export default class IconWrapper extends Component {
  state = {
    icon: {
      type: 'text',
      letter: '',
      path: '',
    },
  };

  componentDidMount() {
    if (this.props.icon.type === 'file') {
      ipcRenderer.send(IPC_FETCH_ICON, this.props.icon.path);
      ipcRenderer.on(IPC_RETRIEVE_ICON, this.fetchIcon);
    } else {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({icon: this.props.icon});
    }
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(IPC_RETRIEVE_ICON, this.fetchIcon);
  }

  fetchIcon = (evt, iconPath) => {
    this.setState({
      icon: {
        type: 'file',
        path: iconPath,
      },
    });
  };

  render() {
    return <Icon icon={this.state.icon}/>;
  }
}

IconWrapper.defaultProps = {
  icon: {
    type: 'text',
    path: '',
    letter: '',
    bgColor: '',
  },
};

IconWrapper.propTypes = {
  icon: PropTypes.shape({
    type: PropTypes.oneOf(['file', 'text', 'fileicon', '']),
    path: PropTypes.string,
    letter: PropTypes.string,
    bgColor: PropTypes.string,
  }),
};
