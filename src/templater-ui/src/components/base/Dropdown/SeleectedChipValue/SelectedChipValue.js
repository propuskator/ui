import React, {
    memo
}                       from 'react';
import PropTypes        from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import classnames       from 'classnames/bind';

import Chip             from '../../Chip';
import Tooltip          from '../../Tooltip';

import styles             from './SelectedChipValue.less';

const cx = classnames.bind(styles);

function SelectedChipValue(props) {
    const { list } = props;
    const amountToView = 1;
    const withMoreButton = list.length > 1;

    function renderMoreButton() {
        if (!withMoreButton) return null;

        return (
            <Tooltip
                title     = {(
                    <div className={styles.tooltipList}>
                        {list.slice(amountToView).map(item => (
                            <p className={styles.item} key={item.id || item.name}>
                                {item.label || item.name}
                            </p>
                        ))}
                    </div>
                )}
            >
                <div className  = {styles.elseChip}>
                    <Chip
                        key        = {uuidv4()}
                        color      = 'mediumGrey'
                        tagName    = 'button'
                        size       = 'S'
                    >
                        More
                    </Chip>
                </div>
            </Tooltip>
        );
    }
    const selectedChipValueCN = cx(styles.SelectedChipValue, {
        withMoreButton
    });

    return (
        <div className={selectedChipValueCN}>
            <div className={styles.content}>
                { list.slice(0, amountToView).map(item => (
                    <Chip
                        key         = {item?.id || item?.value}
                        background  = {item?.variant ? '' : item?.color}
                        color       = {item?.color}
                        variant     = {item?.variant}
                        className   = {styles.chip}
                        tooltipMode = 'onOverflow'
                        size        = 'S'
                    >
                        {item.label || item.name}
                    </Chip>
                )) }

                { renderMoreButton() }
            </div>
        </div>
    );
}

SelectedChipValue.propTypes = {
    list : PropTypes.arrayOf(PropTypes.shape({
        id    : PropTypes.any,
        color : PropTypes.string,
        name  : PropTypes.string,
        value : PropTypes.any
    }))
};

SelectedChipValue.defaultProps = {
    list : []
};

export default memo(SelectedChipValue);
