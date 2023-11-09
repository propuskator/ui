import React, {
    useState
}                       from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import Tooltip          from './../../../base/Tooltip';
import IconButton       from './../../../base/IconButton';
import CircularProgress from './../../../base/CircularProgress';

import styles           from './DefaultActions.less';

const cx = classnames.bind(styles);

const TOOLTIP_CLASSES = {
    tooltip : styles.tooltip
};

function DefaultActions(props) {
    const { item, handleRunAction, renderActions, t } = props;
    const [ processingAction, setProcessingAction ] = useState();

    function withProcessing(actionType, cb) {
        return async (e) => {
            if (e) e.stopPropagation();
            if (e) e.preventDefault();

            setProcessingAction(actionType);

            try {
                await cb();     // eslint-disable-line callback-return
            } catch (error) {    // eslint-disable-line no-unused-vars
                // pass
            } finally {
                setProcessingAction(void 0);
            }
        };
    }

    const isArchiveProcessing = processingAction === 'archive';

    return (
        <div className={styles.DefaultActions}>
            {/*
            <Tooltip
                title     = {'Edit'}
                placement = 'bottom'
                classes   = {TOOLTIP_CLASSES}
            >
                <div>
                    <IconButton
                        iconType  = 'edit'
                        color     = 'greyDark'
                        className = {styles.iconButton}
                        onClick   = {handleRunAction(item, 'edit')}
                    />
                </div>
            </Tooltip>
            */}

            <Tooltip
                title     = {item?.is_archived ? t('Show') : t('Hide')}
                placement = 'bottom'
                classes   = {TOOLTIP_CLASSES}
            >
                <div
                    className={cx(styles.iconButtonWrapper, {
                        processing : isArchiveProcessing
                    })}>
                    <IconButton
                        iconType  = {item?.is_archived ? 'unzip' : 'zip'}
                        color     = 'greyDark'
                        className = {styles.iconButton}
                        onClick   = {item?.is_archived
                            ? withProcessing('archive', handleRunAction(item, 'unzip'))
                            : withProcessing('archive', handleRunAction(item, 'archive'))
                        }
                    />
                    { isArchiveProcessing
                        ? (
                            <div className={cx(styles.loaderWrapper, { hidden: !isArchiveProcessing })}>
                                <CircularProgress
                                    thickness = {3}
                                    color     = 'greyDark'
                                />
                            </div>
                        ) : null
                    }
                </div>
            </Tooltip>
            { renderActions
                ? renderActions({ classes: styles })
                : null
            }
        </div>
    );
}

DefaultActions.propTypes = {
    item : PropTypes.shape({
        is_archived : PropTypes.bool.isRequired
    }),
    handleRunAction : PropTypes.func.isRequired,
    renderActions   : PropTypes.func,
    t               : PropTypes.func
};

DefaultActions.defaultProps = {
    item          : void 0,
    renderActions : void 0,
    t             : (text) => text
};

export default DefaultActions;
