/* eslint-disable  babel/no-unused-expressions, max-lines-per-function */
import React, {
    useRef,
    useEffect,
    useState
}                  from 'react';
import classnames  from 'classnames/bind';
import PropTypes   from 'prop-types';

import InputSearch from 'templater-ui/src/components/base/Input/InputSearch';
import debounce    from 'templater-ui/src/utils/helpers/debounce';

import SvgIcon     from 'Base/SvgIcon';
import useDrop     from '../useDrop.hook.js';

import styles      from './DropItem.less';

const cx = classnames.bind(styles);

function DropItem(props) {
    const {
        className, renderItem, selectedList, name, color, useUniqueId,
        emptyListLabel, onChange, grabbingId, size, list, requiredError,
        searchLabel, t
    } = props;

    const [ filteredList, setFilteredList ] = useState(selectedList);
    const [ searchValue, setSearchValue ] = useState('');

    const componentRef  = useRef({ itemsLength: selectedList.length });
    const dropRef       = useRef();
    const { dropState } = useDrop({
        ref    : dropRef,
        onDrop : (itemId) => {
            const isExist = selectedList.find(item => !useUniqueId
                ? item?.id === itemId
                : item?.uniqueId === itemId);
            const itemToAdd = list.find(item =>  !useUniqueId
                ? item?.id === itemId
                : item?.uniqueId === itemId);

            if (!isExist && itemToAdd) {
                onChange({ name, value: [ ...selectedList, itemToAdd ] });
            }
        }
    });

    useEffect(() => {
        setFilteredList(getFilteredList());
    }, [ selectedList, searchValue ]);

    useEffect(() => () => {
        if (!componentRef.current.scrollTimeout) return;

        clearTimeout(componentRef.current.scrollTimeout);
    });
    const isGrabbing   = !!grabbingId && dropState !== 'DROPPED';
    const isDisabled   = grabbingId && !list.find(item => useUniqueId
        ? item.uniqueId === grabbingId
        : item.id === grabbingId);
    const showGragging = !!(dropState === 'DRAG_OVER' && grabbingId);

    const isListEmpty  = !filteredList.length && !showGragging;

    const dropItemCN   = cx(styles.DropItem, {
        emptyList       : isListEmpty,
        [className]     : className,
        grabbing        : isGrabbing,
        disabled        : grabbingId && isDisabled,
        active          : grabbingId && !isDisabled,
        requiredError,
        [color]         : color,
        [`size${size}`] : !!size
    });

    function scrollToElement(element) {
        if (!element) return;

        componentRef.current.scrollTimeout = setTimeout(() => {
            element?.scrollIntoView({ block: 'end', behavior: 'smooth' });
        }, 0);
    }    /* eslint-disable-line no-magic-numbers */

    useEffect(() => {
        const itemsIncrease = componentRef.current.itemsLength < filteredList.length;

        if (showGragging || itemsIncrease) {
            // const childToScroll = dropRef?.current?.children[0];
            const contentBlock  =  dropRef?.current?.children[0] || {};
            const { scrollHeight = 0, clientHeight = 0 } = contentBlock;

            if (scrollHeight > clientHeight) {
                scrollToElement(contentBlock?.lastElementChild);
            }
        }

        componentRef.current.itemsLength = filteredList.length;
    }, [ showGragging, filteredList ]);

    const handleChangeSearch = debounce((searchData = {}) => {
        setSearchValue(searchData?.value || '');
    });

    function getFilteredList() {
        return selectedList.filter((item) => item?.name.toLowerCase().includes(searchValue.toLowerCase()));
    }

    return (
        <div className={dropItemCN} ref={dropRef}>
            <InputSearch
                label      = {searchLabel}
                name       = {'search'}
                value      = {''}
                onChange   = {handleChangeSearch}
                withError  = {false}
                classes    = {{
                    inputWrapper : styles.inputWrapper
                }}
            />
            <div className={styles.content}>
                { filteredList && filteredList.length
                    ? filteredList.map((item) => renderItem(item))
                    : null
                }
                { isListEmpty
                    ? (
                        <>
                            <SvgIcon
                                type = {searchValue.length ? 'nothingFound' : 'createEntity'}
                                color='greyMedium'
                                className={styles.emptyListIcon}
                            />
                            <div className={styles.emptyListLabel}>
                                {searchValue.length ? t('Nothing found') : emptyListLabel}
                            </div>
                        </>
                    ) : null
                }
                { showGragging
                    ? renderItem(grabbingId, true)
                    : null
                }
            </div>
        </div>
    );
}

DropItem.propTypes = {
    size           : PropTypes.oneOf([ 'S', '' ]),
    className      : PropTypes.string,
    renderItem     : PropTypes.func.isRequired,
    selectedList   : PropTypes.array.isRequired,
    list           : PropTypes.array.isRequired,
    name           : PropTypes.string.isRequired,
    emptyListLabel : PropTypes.string.isRequired,
    onChange       : PropTypes.func.isRequired,
    requiredError  : PropTypes.bool,
    useUniqueId    : PropTypes.bool,
    color          : PropTypes.oneOf([
        'lightGreen', 'lightViolet', 'lightRed',
        'lightYellow', 'lightOrange', ''
    ]),
    grabbingId  : PropTypes.oneOfType([ PropTypes.string, PropTypes.numbermber ]),
    searchLabel : PropTypes.string,
    t           : PropTypes.func
};

DropItem.defaultProps = {
    size          : '',
    className     : '',
    color         : 'lightGreen',
    requiredError : false,
    useUniqueId   : false,
    grabbingId    : void 0,
    searchLabel   : '',
    t             : text => text
};

export default DropItem;
