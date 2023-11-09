import React, {
    memo, useCallback
}                   from 'react';
import PropTypes    from 'prop-types';
import classnames   from 'classnames/bind';

import ErrorMessage from 'templater-ui/src/components/base/ErrorMessage';

import DropItem     from './DropItem';

import styles       from './DraggableList.less';

const cx = classnames.bind(styles);

function DraggableList(props) {
    const {
        className,
        errorMessage,
        emptyListLabel,
        renderItem,
        value = [],
        grabbingId,
        onChange,
        onDrop,
        name,
        disabled,
        withError,
        size,
        list,
        title,
        color,
        isRequired,
        isProcessing,
        useUniqueId,
        searchLabel,
        t
    } = props;

    const draggableListCN = cx(styles.DraggableList, {
        disabled   : !!disabled,
        processing : isProcessing
    });
    const dropItemCN = cx(styles.dropItem, {
        [className] : className
    });

    function handleChange(data) {
        if (onDrop) onDrop();

        onChange(data);
    }

    return (
        <div className={draggableListCN}>
            { title
                ? <div className={styles.title}>{ title }</div>
                : null
            }
            <DropItem
                className      = {dropItemCN}
                name           = {name}
                renderItem     = {renderItem}
                emptyListLabel = {emptyListLabel}
                list           = {list}
                selectedList   = {value}
                grabbingId     = {grabbingId}
                onChange       = {useCallback(handleChange, [])}
                size           = {size}
                color          = {color}
                requiredError  = {!!(isRequired && errorMessage)}
                useUniqueId    = {useUniqueId}
                searchLabel    = {searchLabel}
                t              = {t}
            />

            {withError && errorMessage ? <ErrorMessage error={errorMessage} /> : null}
        </div>
    );
}

DraggableList.propTypes = {
    size           : PropTypes.string,
    name           : PropTypes.string.isRequired,
    value          : PropTypes.array.isRequired,
    onChange       : PropTypes.func.isRequired,
    onDrop         : PropTypes.func,
    renderItem     : PropTypes.func.isRequired,
    emptyListLabel : PropTypes.string.isRequired,
    errorMessage   : PropTypes.string,
    list           : PropTypes.array,
    grabbingId     : PropTypes.oneOfType([ PropTypes.string, PropTypes.numbermber ]),
    disabled       : PropTypes.bool,
    className      : PropTypes.string,
    color          : PropTypes.oneOf([
        'lightGreen', 'lightViolet', 'lightRed', 'lightOrange', 'lightYellow', ''
    ]),
    title        : PropTypes.string,
    withError    : PropTypes.bool,
    isRequired   : PropTypes.bool,
    isProcessing : PropTypes.bool,
    useUniqueId  : PropTypes.bool,
    searchLabel  : PropTypes.string,
    t            : PropTypes.func
};

DraggableList.defaultProps = {
    size         : '',
    errorMessage : '',
    className    : '',
    title        : '',
    color        : 'lightGreen',
    list         : [],
    onDrop       : void 0,
    grabbingId   : void 0,
    disabled     : false,
    withError    : true,
    isRequired   : false,
    isProcessing : false,
    useUniqueId  : false,
    searchLabel  : '',
    t            : text => text
};

export default memo(DraggableList);
