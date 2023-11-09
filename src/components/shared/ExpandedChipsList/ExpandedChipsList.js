import React, {
    memo,
    useState
}                         from 'react';
import PropTypes          from 'prop-types';
import classnames         from 'classnames/bind';
import { v4 as uuidv4 }   from 'uuid';

import Chip               from 'templater-ui/src/components/base/Chip';

import styles             from './ExpandedChipsList.less';

const cx = classnames.bind(styles);

function ExpandedChipsList(props) { /* eslint-disable-line max-lines-per-function */
    const {
        className, chipProps, list, renderTooltip, renderCustomItem,
        lessControlProps, moreControlProps, maxAmount, renderCustomList, t
    } = props;
    const [ isExpanded, setExpanded ] = useState(false);

    const sorted = getSortedEntites(list);

    const expandedChipsListCN = cx(styles.ExpandedChipsList, {
        [className] : className
    });

    function getSortedEntites(entities) {
        const archived    = entities?.filter(entity => entity?.item?.isArchived) || [];
        const notArchived = entities?.filter(entity => !entity?.item?.isArchived) || [];

        return [ ...notArchived, ...archived ];
    }

    function handleExpandList() {
        setExpanded(true);
    }

    function handleHideExpandedList() {
        setExpanded(false);
    }

    function renderMoreButton() {
        return (
            <div className  = {styles.elseChip}>
                <Chip
                    key        = {uuidv4()}
                    color      = 'mediumGrey'
                    tagName    = 'button'
                    size       = 'M'
                    t          = {t}
                    onClick    = {handleExpandList}
                    {...moreControlProps}
                >
                    {t('More')}
                </Chip>
            </div>
        );
    }

    function renderLessButton() {
        return (
            <div className  = {styles.elseChip}>
                <Chip
                    key        = {uuidv4()}
                    color      = 'mediumGrey'
                    tagName    = 'button'
                    size       = 'M'
                    t          = {t}
                    onClick    = {handleHideExpandedList}
                    {...lessControlProps}
                >
                    {t('Hide')}
                </Chip>
            </div>
        );
    }

    function renderItem({ item, ...rest }, index) {    // eslint-disable-line react/prop-types
        const chipFullProps = { ...(chipProps || {}), ...(rest || {}) };

        return (
            renderCustomItem
                ? renderCustomItem(
                    item,
                    {
                        isLast : isExpanded
                            ? index > list.length - 2   // eslint-disable-line no-magic-numbers
                            : index === list.length - (list.length - maxAmount) - 1,
                        isFirst : index === 0,
                        index
                    }
                ) : (
                    <Chip
                        {...chipFullProps}
                        key            = {rest.key}
                        className      = {styles.chip}
                        size           = 'M'
                        t              = {t}
                        isArchived     = {!!item?.isArchived}
                        tooltipMode    = {item?.isArchived ? 'always' :  rest?.tooltipMode}
                        tooltipContent = {renderTooltip ? renderTooltip(item) : rest?.tooltipContent}
                    >
                        {rest.label}
                    </Chip>
                )
        );
    }

    function renderExpandedControls() {
        return (
            <>
                { !isExpanded && sorted.length > maxAmount
                    ? renderMoreButton()
                    : null
                }
                { isExpanded && sorted.length > maxAmount
                    ? renderLessButton()
                    : null
                }
            </>
        );
    }

    const listToRender = isExpanded ? sorted : sorted.slice(0, maxAmount);

    return (
        <div className={expandedChipsListCN}>
            { renderCustomList
                ? renderCustomList(listToRender.map(schedule => schedule.item), renderExpandedControls)
                : (
                    <div className={styles.listWrapper}>
                        <div className={styles.content}>
                            { listToRender.map(renderItem) }
                            { renderCustomList
                                ? null
                                : renderExpandedControls()
                            }
                        </div>
                    </div>
                )
            }
        </div>
    );
}

ExpandedChipsList.propTypes = {
    list : PropTypes.arrayOf(PropTypes.shape({
        label      : PropTypes.string,
        key        : PropTypes.string,
        id         : PropTypes.any,
        color      : PropTypes.string,
        background : PropTypes.string
    })),
    renderCustomItem : PropTypes.func,
    renderCustomList : PropTypes.func,
    chipProps        : PropTypes.shape({
        size : PropTypes.string
    }),
    renderTooltip    : PropTypes.func,
    lessControlProps : PropTypes.object,
    moreControlProps : PropTypes.object,
    className        : PropTypes.string,
    maxAmount        : PropTypes.number,
    t                : PropTypes.func.isRequired
};

ExpandedChipsList.defaultProps = {
    list      : [],
    chipProps : {
        size : 'S'
    },
    renderTooltip    : void 0,
    renderCustomItem : void 0,
    renderCustomList : void 0,
    className        : '',
    lessControlProps : {},
    moreControlProps : {},
    maxAmount        : 3
};

export default memo(ExpandedChipsList);
