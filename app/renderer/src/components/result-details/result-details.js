import PropTypes from 'prop-types';
import React from 'react';
import {ipcRenderer} from 'electron';
import {compose, pseudo, style} from 'glamor';
import {IPC_ITEM_DETAILS_RESPONSE} from '../../../../ipc';
const {isDarkModeEnabled} = require('../../../../main/utils/helpers');

class ResultDetails extends React.PureComponent {
  static displayName = 'ResultDetails';
  static defaultProps = {
    details: '',
    theme: {},
  };

  static propTypes = {
    details: PropTypes.string,
    theme: PropTypes.object,
    onLoad: PropTypes.func.isRequired,
  };

  componentDidMount() {
    ipcRenderer.on(IPC_ITEM_DETAILS_RESPONSE, (evt, dtails) => {

      if (dtails) {
        this.props.onLoad(dtails);
      }
    });
  }

  render() {

    const base = compose(
      // apply base style
      style({
        boxSizing: 'border-box',
        position: 'absolute',
        backgroundColor: isDarkModeEnabled ? '#121212' : '#f2f2f2',
        width: '50%',
        right: '-50%',
        top: 0,
        bottom: 0,
        padding: 15,
        borderLeftWidth: 1,
        borderLeftStyle: 'solid',
        borderLeftColor: '#bbb',
        transitionDuration: '250ms',
        overflowX: 'hidden',
        overflowY: 'overlay',
      }),
      pseudo('::-webkit-scrollbar', {
        width: 3,
        marginRight: 3,
      }),
      pseudo('::-webkit-scrollbar-thumb', {
        backgroundColor: '#bbb',
      }),
      this.props.details.length > 0
        ? style({
          right: '0%',
        })
        : {}
    );
    // apply theme styles
    const styles =
      this.props.theme && this.props.theme.resultDetails
        ? compose(
        base,
        this.props.theme.resultDetails
        )
        : base;

    return (
      // eslint-disable-next-line react/no-danger
      <div
        {...styles}
        dangerouslySetInnerHTML={{__html: this.props.details}}
      />
    );
  }
}

export default ResultDetails;
