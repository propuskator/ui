import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classNames               from 'classnames/bind';

import { checkIsTouchDevice }   from './../../../utils/helpers/detect';
import IconButton               from './../IconButton';

import styles                   from './ExpansionPanel.less';

const cx = classNames.bind(styles);

const IS_TOUCH_SCREEN = checkIsTouchDevice();

class ExpansionPanel extends PureComponent {
    static propTypes = {
        className        : PropTypes.string,
        summary          : PropTypes.any.isRequired,
        details          : PropTypes.any,
        isExpanded       : PropTypes.bool,
        selected         : PropTypes.bool,
        onDeleteEntity   : PropTypes.func,
        disableExpansion : PropTypes.bool
    };

    static defaultProps = {
        className        : '',
        onDeleteEntity   : void 0,
        isExpanded       : false,
        selected         : false,
        details          : void 0,
        disableExpansion : false
    };

    state = {
        showDetails : this.props.isExpanded
    }

    componentWillUnmount() {
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    }

    handleToggleDetails = (e) => {
        e.preventDefault();
        const { showDetails } = this.state;

        this.setState({
            showDetails : !showDetails
        }, () => {
            if (showDetails) return;

            if (!IS_TOUCH_SCREEN) {
                this.panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    handleDeleteEntity = (e) => {
        e.preventDefault();
        this.props.onDeleteEntity();
    }

    render() {
        const { className, summary, details, selected, disableExpansion } = this.props;
        const { showDetails } = this.state;
        const expansionPanelCN = cx({
            ExpansionPanel,
            [className] : className,
            showDetails
        });

        return (
            <div className={expansionPanelCN} ref={node => this.panel = node}>
                <div className={styles.summary}>
                    <div className={styles.summaryInfo}>
                        { summary }
                    </div>
                    { selected && (
                        <IconButton
                            className     = {styles.arrowWrapper}
                            onClick       = {this.handleDeleteEntity}
                            iconType      = 'cross'
                            iconClassName = {styles.expansionArrow}
                        />
                    ) }
                    { !selected && !disableExpansion && (
                        <IconButton
                            className     = {styles.arrowWrapper}
                            onClick       = {this.handleToggleDetails}
                            iconType      = 'expansionArrow'
                            iconClassName = {styles.expansionArrow}
                        />
                    ) }
                </div>
                <div className={styles.details}>
                    { details }
                </div>
            </div>
        );
    }
}

export default ExpansionPanel;
