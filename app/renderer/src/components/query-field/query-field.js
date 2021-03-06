import PropTypes from 'prop-types';
import React from 'react';
import {ipcRenderer} from 'electron';
import {compose, style} from 'glamor';
import {IPC_WINDOW_SHOW, IPC_WINDOW_HIDE} from '../../../../ipc';

const {isDarkModeEnabled} = require('../../../../main/utils/helpers');

const base = style({
  paddingTop: 10,
  paddingRight: 15,
  paddingBottom: 10,
  paddingLeft: 15,
  marginBottom: 32,
  boxSizing: 'border-box',
  borderRadius: 3,
  backgroundColor: isDarkModeEnabled() ? '#121212' : '#fff',
});

const search = style({
  backgroundColor: 'transparent',
  border: 0,
  boxSizing: 'border-box',
  fontSize: 30,
  marginBottom: 0,
  color: isDarkModeEnabled() ? '#FFF' : '#000',
  // paddingBottom: 15,
  outline: 0,
  overflow: 'visible',
  width: '100%',
  height: 35,
});

class QueryField extends React.Component {
  static displayName = 'QueryField';
  static propTypes = {
    query: PropTypes.string,
    theme: PropTypes.object,
    onReset: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  static defaultProps = {
    query: '',
    theme: {},
  };
  queryField = null;

  componentDidMount() {
    ipcRenderer.on(IPC_WINDOW_SHOW, () => {
      this.focus();
    });
    ipcRenderer.on(IPC_WINDOW_HIDE, () => {
      if (this.props.onReset) this.props.onReset();
      this.blur();
    });
  }

  focus = () => {
    if (this.queryField) {
      this.queryField.focus();
      this.props.onChange(this.props.query);
    }
  };

  blur = () => {
    if (this.queryField) {
      this.queryField.blur();
    }
  };

  handleChange = e => {
    if (this.props.onChange) this.props.onChange(e.target.value);
  };

  attachQueryField = queryField => {
    this.queryField = queryField;
  };

  render() {
    const baseStyle =
      this.props.theme && this.props.theme.searchBase
        ? compose(
        base,
        this.props.theme.searchBase
        )
        : base;

    const styles =
      this.props.theme && this.props.theme.search
        ? compose(
        search,
        this.props.theme.search
        )
        : search;

    return (
      <div {...baseStyle}>
        <input
          ref={this.attachQueryField}
          onChange={this.handleChange}
          value={this.props.query}
          placeholder={'Looking for something?'}
          {...styles}
        />
      </div>
    );
  }
}

export default QueryField;
