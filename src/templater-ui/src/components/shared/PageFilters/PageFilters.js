import React, {
    useState
}                                     from 'react';
import PropTypes                      from 'prop-types';
import classnames                     from 'classnames/bind';

import Link                           from './../../base/Link';
import Dropdown                       from './../../base/Dropdown';
import SvgIcon                        from './../../base/SvgIcon';
import AsyncDropdown                  from './../../base/Dropdown/AsyncDropdown';
import Input                          from './../../base/Input';
import InputSearch                    from './../../base/Input/InputSearch';
import DateRangePickerFilter          from './DateRangePickerFilter';

import styles                         from './PageFilters.less';

const cx = classnames.bind(styles);

const PAGE_FILTERS_BLOCK_ID = 'filters-id';

// eslint-disable-next-line max-lines-per-function
function FilterFields(props) {
    const {
        filters,
        visibleColumns,
        changeFilters,
        configuration,
        className,
        searchLabel,
        defaultExpanded,
        t,
        languageId,
        fieldsMap,
        renderCustomSearch
    } = props;

    const [ expanded, setExpanded ] = useState(!!defaultExpanded);

    function handleToggleExpandedState() {
        setExpanded(!expanded);
    }

    function handleChangeField({ name, value }) {
        changeFilters({ [name]: value });
    }

    function handleChangeSearch({ name, value }) {
        changeFilters({ [name]: value });
    }

    function renderBaseField(field, Component) {
        const fieldWrapperCN = cx(styles.fieldWrapper, {
            [field.type]      : field.type,
            [field.className] : !!field?.className
        });

        return (
            <div key={field.name} className={fieldWrapperCN}>
                <Component
                    value        = {filters[field.name]}
                    name         = {field.name}
                    label        = {field.label}
                    placeholder  = {field.placeholder}
                    onChange     = {handleChangeField}
                    defaultValue = {field.default}
                    portalId     = {PAGE_FILTERS_BLOCK_ID}
                    withError    = {false}
                    t            = {t}
                    languageId   = {languageId}
                    {...(field?.props || {})}
                />
            </div>
        );
    }

    function renderField(field) {
        const { dependentCols } = field;

        if (dependentCols && !dependentCols?.some(col => visibleColumns.includes(col))) return  null;

        const CustomField = fieldsMap[field?.type];

        if (CustomField) return renderBaseField(field, CustomField);

        switch (field.type) {
            case 'string':
                return renderBaseField(field, Input);
            case 'dropdown':
                return renderBaseField(field, Dropdown);
            case 'asyncDropdown':
                return renderBaseField(field, AsyncDropdown);
            case 'dateRange':
                return renderBaseField(field, DateRangePickerFilter);
            default:
                return null;
        }
    }

    return (
        <div
            id        = {PAGE_FILTERS_BLOCK_ID}
            className = {cx(styles.PageFilters, {
                [className] : className,
                expanded    : !!expanded
            })}
        >
            <div className = {styles.heading}>
                <div className={styles.searchWrapper}>
                    { renderCustomSearch
                        ? renderCustomSearch()
                        : (
                            <InputSearch
                                label     = {searchLabel}
                                name      = 'search'
                                value     = {filters.search}
                                onChange  = {handleChangeSearch}
                                withError = {false}
                            />
                        )
                    }
                </div>
                <div className={styles.expansionBtnWrapper}>
                    <Link
                        className = {cx(styles.expansionBtn)}
                        onClick   = {handleToggleExpandedState}
                        color     = 'primary'
                    >
                        <>
                            <span>
                                { expanded ? t('Hide') : t('Advanced search') }
                            </span>
                            <SvgIcon
                                type      = 'arrowDown'
                                className = {cx(styles.arrowClose, { [styles.arrowOpen]: expanded })}
                            />
                        </>
                    </Link>
                </div>
            </div>
            <div
                className={cx(styles.expandedFiltersWrapper, {
                    notExpanded : !expanded
                })}>
                <div className={styles.expandedFilters}>
                    { configuration?.fields.map(renderField) }
                </div>
            </div>
        </div>
    );
}

FilterFields.propTypes = {
    filters        : PropTypes.object,
    visibleColumns : PropTypes.arrayOf(PropTypes.string),
    configuration  : PropTypes.shape({
        fields : PropTypes.arrayOf(PropTypes.object)
    }).isRequired,
    changeFilters      : PropTypes.func.isRequired,
    renderCustomSearch : PropTypes.func,
    className          : PropTypes.string,
    searchLabel        : PropTypes.string,
    defaultExpanded    : PropTypes.bool,
    t                  : PropTypes.func,
    languageId         : PropTypes.string,
    fieldsMap          : PropTypes.shape({})
};

FilterFields.defaultProps = {
    filters            : {},
    visibleColumns     : [],
    className          : '',
    searchLabel        : '',
    defaultExpanded    : false,
    t                  : (text) => text,
    languageId         : void 0,
    fieldsMap          : {},
    renderCustomSearch : void 0
};

export default FilterFields;
