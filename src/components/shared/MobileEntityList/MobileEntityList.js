/* eslint-disable no-magic-numbers,  function-paren-newline */

import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import ErrorMessage             from 'templater-ui/src/components/base/ErrorMessage';
import Chip                     from 'templater-ui/src/components/base/Chip';
import IconButton               from 'templater-ui/src/components/base/IconButton';
// import { sortComparator }       from 'Utils/sort';
import {
    sortByIsArchived
}                               from 'Utils/sort';
import ExpansionPanel           from 'Base/ExpansionPanel';
import EntityList               from 'Shared/EntityList';

import styles                   from './MobileEntityList.less';

const cx = classnames.bind(styles);

class MobileEntityList extends PureComponent {
    getSortedItemsByValue(items) {
        const { useUniqueId } = this.props;
        const { value } = this.props;

        const selectedOptions    = value?.map(valueItem => {
            return items.find(item => useUniqueId
                ? item?.uniqueId === valueItem?.uniqueId
                : item?.id === valueItem?.id);
        });
        const sortedSelected = sortByIsArchived(selectedOptions);
        const notSelectedOptions = items.filter(valueItem => !value.find(item => {
            return useUniqueId
                ? item?.uniqueId === valueItem?.uniqueId
                : item?.id === valueItem?.id;
        }));

        // const notSelectedSorted = notSelectedOptions.sort((a, b) => {
        //     const firstLabel  = a?.name?.toLowerCase() || '';
        //     const secondLabel = b?.name?.toLowerCase() || '';

        //     return sortComparator(firstLabel, secondLabel, 'ASC');
        // });

        // return [ ...selectedOptions, ...notSelectedSorted ];

        return [ ...sortedSelected, ...notSelectedOptions ];
    }

    handleChangeSearch = ({ value }) => {
        this.setState({ searchField: value });
    }

    renderItem = (item) => {    /* eslint-disable-line max-lines-per-function */
        const {
            summaryClassName, value, onAddEntity, onDeleteEntity, expandedKey,
            renderItem, renderItemDetails, fillSelectedBg, useUniqueId, t
        } = this.props;
        const isSelected = !!value.find(valueItem => useUniqueId
            ? valueItem?.uniqueId === item?.uniqueId
            : valueItem?.id === item?.id);
        const expansionPanelCN = cx(styles.expansionPanel, {
            selected : isSelected,
            fillSelectedBg
        });

        return (
            <ExpansionPanel
                key              = {item?.id}
                className        = {expansionPanelCN}
                selected         = {isSelected}
                onDeleteEntity   = {() => { // eslint-disable-line react/jsx-no-bind, max-len
                    if (useUniqueId) onDeleteEntity(item?.uniqueId, true);
                    else onDeleteEntity(item?.id);
                }}
                disableExpansion = {!item[expandedKey]?.length && !item.isExpandable}
                summary          = {
                    <div
                        className={cx(styles.summary, {
                            [summaryClassName] : summaryClassName
                        })}>
                        { isSelected
                            ? (
                                <IconButton
                                    className     = {styles.checkIcon}
                                    iconType      = 'check'
                                    iconClassName = {styles.plusButton}
                                />
                            )
                            : (
                                <IconButton
                                    className     = {styles.addEntityButton}
                                    onClick       = {() => useUniqueId    // eslint-disable-line react/jsx-no-bind, max-len
                                        ? onAddEntity(item.uniqueId, true)
                                        : onAddEntity(item.id)
                                    }
                                    iconType      = 'plusButton'
                                    iconClassName = {styles.plusButton}
                                />
                            )
                        }

                        { renderItem
                            ? <div className={styles.customItemWrapper}>{renderItem(item)}</div>
                            : (
                                <Chip
                                    className  = {styles.chip}
                                    background = {item.color}
                                    isArchived = {item?.isArchived}
                                    t          = {t}
                                >
                                    {item.name}
                                </Chip>
                            )
                        }
                    </div>
                }
                details  = {
                    renderItemDetails
                        ? renderItemDetails(item)
                        : (
                            <div className={styles.details}>
                                { sortByIsArchived(item[expandedKey])
                                    ?.map(item => (    // eslint-disable-line no-shadow
                                        <Chip
                                            key        = {`${item.code}${item.id}${item.name}`}
                                            className  = {styles.detailsSimpleItem}
                                            isArchived = {item?.isArchived}
                                            t          = {t}
                                        >
                                            {item.name}
                                        </Chip>
                                    )
                                )}
                            </div>
                        )
                }
            />
        );
    }

    render() {
        const {
            list,
            name,
            emptyMessage,
            isFetching,
            onCreateEntity,
            className,
            searchLabel,
            search,
            updateSearch,
            errorMessage,
            withError,
            isProcessing,
            isRequired,
            color,
            refreshList,
            value,
            forwardRef,
            t
        } = this.props;
        const mobileEntityListCN   = cx(styles.MobileEntityList, {
            [className] : className,
            blurred     : isFetching && list.length,
            processing  : isProcessing
        });
        const sortedItems    = this.getSortedItemsByValue(list);

        return (
            <div className={mobileEntityListCN}>
                <EntityList
                    name           = {name}
                    emptyMessage   = {emptyMessage}
                    onCreateEntity = {onCreateEntity}
                    isFetching     = {isFetching}
                    isProcessing   = {isProcessing}
                    expanded       = {false}
                    value          = {value ? value.map(item => item?.id) : void 0}
                    list           = {sortedItems}
                    grabbing       = {false}
                    searchLabel    = {searchLabel}
                    renderItem     = {this.renderItem}
                    search         = {search}
                    updateSearch   = {updateSearch}
                    requiredError  = {!!(isRequired && errorMessage)}
                    color          = {color}
                    refreshList    = {refreshList}
                    forwardRef     = {forwardRef}
                    t              = {t}
                />
                { withError && errorMessage
                    ? <ErrorMessage className={styles.errorMessage} error={errorMessage} />
                    : null
                }
            </div>
        );
    }
}

MobileEntityList.propTypes = {
    list : PropTypes.arrayOf(PropTypes.shape({
        id    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
        color : PropTypes.string,
        name  : PropTypes.string
    })),
    forwardRef : PropTypes.shape({
        current : PropTypes.strobjecting
    }),
    emptyMessage      : PropTypes.string.isRequired,
    isFetching        : PropTypes.bool,
    onCreateEntity    : PropTypes.func,
    value             : PropTypes.array,
    onAddEntity       : PropTypes.func.isRequired,
    onDeleteEntity    : PropTypes.func.isRequired,
    className         : PropTypes.string,
    name              : PropTypes.string,
    expandedKey       : PropTypes.string,
    summaryClassName  : PropTypes.string,
    color             : PropTypes.string,
    searchLabel       : PropTypes.string.isRequired,
    search            : PropTypes.string,
    errorMessage      : PropTypes.string,
    withError         : PropTypes.bool,
    isProcessing      : PropTypes.bool,
    isRequired        : PropTypes.bool,
    updateSearch      : PropTypes.func.isRequired,
    renderItem        : PropTypes.func,
    renderItemDetails : PropTypes.func,
    fillSelectedBg    : PropTypes.bool,
    useUniqueId       : PropTypes.bool,
    refreshList       : PropTypes.func,
    t                 : PropTypes.func
};

MobileEntityList.defaultProps = {
    value             : [],
    list              : [],
    className         : '',
    name              : '',
    expandedKey       : '',
    summaryClassName  : '',
    search            : '',
    errorMessage      : '',
    color             : void 0,
    forwardRef        : void 0,
    onCreateEntity    : void 0,
    renderItem        : void 0,
    renderItemDetails : void 0,
    refreshList       : void 0,
    withError         : true,
    isProcessing      : false,
    isRequired        : false,
    isFetching        : false,
    useUniqueId       : false,
    fillSelectedBg    : false,
    t                 : (text) => text
};

export default React.memo(MobileEntityList);
