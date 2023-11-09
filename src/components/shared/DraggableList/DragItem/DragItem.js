import React, {
    useRef
}                 from 'react';
import PropTypes  from 'prop-types';
import classnames from 'classnames/bind';

import useDrag    from '../useDrag.hook.js';

import styles     from './DragItem.less';

const cx = classnames.bind(styles);

function DragItem(props) {
    const { className, onDragStart, onDragEnd, children, id } = props;
    const dragRef = useRef();
    const { dragState } = useDrag({
        id,
        ref         : dragRef,
        onDragStart : (itemId) => {
            if (onDragStart) onDragStart(itemId);
        },
        onDragEnd : () => {
            if (onDragEnd) onDragEnd();
        }
    });

    const isGrabbing = dragState === 'DRAG_START';

    const dragItemCN = cx(styles.DragItem, {
        [className] : className,
        grabbing    : isGrabbing
    });

    return (
        <div className={dragItemCN} ref={dragRef}>
            {children}
        </div>
    );
}

DragItem.propTypes = {
    id          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
    className   : PropTypes.string,
    onDragStart : PropTypes.func,
    onDragEnd   : PropTypes.func,
    children    : PropTypes.any
};

DragItem.defaultProps = {
    className   : '',
    onDragStart : void 0,
    onDragEnd   : void 0,
    children    : void 0
};

export default DragItem;
