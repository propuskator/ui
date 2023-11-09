import React, {
    useState
}                       from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import Dropdown         from 'templater-ui/src/components/base/Dropdown';

import SvgIcon          from 'Base/SvgIcon';

import styles           from './DefaultActions.less';

const cx = classnames.bind(styles);

export function renderIcon(iconType) {
    return (
        <div className={styles.iconWrapper} key={iconType}>
            <SvgIcon
                className = {cx(styles.icon, { [iconType]: iconType })}
                type      = {iconType}
            />
        </div>
    );
}
function DefaultActions(props) {
    const {
        item,
        handleRunAction,
        withSettings,
        withDelete,
        customActions,
        t
    } = props;
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

    function runAction({ value } = {}) {
        switch (value) {
            case 'edit':
                return handleRunAction(item, 'edit')();
            case 'unzip':
                return withProcessing('archive', handleRunAction(item, 'unzip'))();
            case 'archive':
                return withProcessing('archive', handleRunAction(item, 'archive'))();
            case 'settings':
                return handleRunAction(item, 'settings')();
            case 'delete':
                return handleRunAction(item, 'delete')();
            default:
                const cb = handleRunAction(item, value);    // eslint-disable-line no-case-declarations

                if (cb) return cb();
        }
    }

    return (
        <div className={styles.DefaultActions}>
            <Dropdown
                options     = {[
                    {
                        label : t('tables:Edit'),
                        value : 'edit',
                        icon  : renderIcon('edit')
                    },
                    {
                        label : item.isArchived ? t('tables:Show') : t('tables:Hide'),
                        value : item.isArchived ? 'unzip' : 'archive',
                        icon  : renderIcon(item?.isArchived ? 'unzip' : 'zip')
                    },
                    ...(withSettings
                        ? [ {
                            label : t('Settings'),
                            value : 'settings',
                            icon  : renderIcon('settings')
                        } ] : []),
                    ...(withDelete
                        ? [ {
                            label : t('tables:Delete'),
                            value : 'delete',
                            icon  : renderIcon('bin')
                        } ] : []),
                    ...(customActions || [])
                ]}
                withKeyboard = {false}
                label        = {t('tables:Actions')}
                isProcessing = {!!processingAction}
                name         = {`SelectAction-${item?.id}`}
                onChange     = {runAction}
                withError    = {false}
                required
                forceMobilePortal
                inputProps   = {{
                    readOnly : true
                }}
            />
        </div>
    );
}

DefaultActions.propTypes = {
    item : PropTypes.shape({
        isArchived : PropTypes.bool.isRequired
    }),
    handleRunAction : PropTypes.func.isRequired,
    withSettings    : PropTypes.bool,
    withDelete      : PropTypes.bool,
    customActions   : PropTypes.arrayOf(PropTypes.shape({
        label    : PropTypes.string,
        value    : PropTypes.string,
        icon     : PropTypes.any,
        iconType : PropTypes.string
    })),
    t : PropTypes.func
};

DefaultActions.defaultProps = {
    item          : void 0,
    withSettings  : false,
    withDelete    : true,
    customActions : [],
    t             : (text) => text
};

export default DefaultActions;
