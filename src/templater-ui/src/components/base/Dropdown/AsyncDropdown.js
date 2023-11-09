/* eslint-disable babel/no-unused-expressions */
import React, { Component } from 'react';
import PropTypes            from 'prop-types';

import debounce             from './../../../utils/helpers/debounce';

import Dropdown             from './Dropdown';

class AsyncDropdown extends Component {
    static propTypes = {
        refreshList : PropTypes.func.isRequired,
        options     : PropTypes.arrayOf(PropTypes.shape({
            label : PropTypes.string,
            value : PropTypes.string
        })),
        countToLoad : PropTypes.number,
        value       : PropTypes.oneOfType([ PropTypes.array, PropTypes.string, PropTypes.number ]),
        multiple    : PropTypes.bool,
        initialMeta : PropTypes.shape({
            sortedBy : PropTypes.string
        }),
        getMappedOption : PropTypes.func,
        sortOptions     : PropTypes.func
    };

    static defaultProps = {
        countToLoad     : 20,
        options         : [],
        value           : void 0,
        initialMeta     : { },
        sortOptions     : void 0,
        getMappedOption : void 0,
        multiple        : false
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading : false,
            total     : 0,
            meta      : {
                ...props.initialMeta,
                search : '',
                limit  : props.countToLoad,
                offset : 0
            }
        };

        this.dropdownRef = React.createRef({});
    }

    componentDidMount() {
        this.fetchData();
    }

    handleChangeSearch = debounce((searchValue) => {
        if (this.state?.meta?.search === searchValue) return;
        if (!this.state?.meta?.search && !searchValue) return;

        const { countToLoad } = this.props;
        const requestParams = {
            limit  : countToLoad,
            offset : 0,
            search : searchValue
        };

        this.fetchData(requestParams);

        this.setState({
            meta  : requestParams,
            total : void 0
        });
    }, 500, false) // eslint-disable-line no-magic-numbers

    handleLoadMore = () => {
        const { meta } = this.state;
        const { countToLoad } = this.props;
        const newMeta  = {
            ...meta,
            limit  : countToLoad,
            offset : meta?.offset + countToLoad
        };

        this.fetchData(newMeta);
    }

    fetchData = async (params = this.state.meta) => {
        const { total, isLoading, options = [] } = this.state;
        const prevSearch = this.state?.meta?.search;

        if (isLoading) return;
        if (params?.offset > total && total) return;

        const { refreshList, value, getMappedOption, multiple } = this.props;
        const processValue = multiple ? value : [ value ]?.filter(el => !!el);

        if (!refreshList) return;
        this.setState({
            isLoading : true,
            meta      : { ...this.state.meta, ...params }
        });

        try {
            const { meta, data = [] }  = await refreshList({
                ...params,
                isMergeList : params?.offset !== 0
            });

            const itemsToLoad = [];

            if (processValue && processValue?.length && !params?.search) {
                const itemsIds = data?.map(item => item.id) || [];

                processValue.forEach(itemId => {
                    if (!itemsIds.includes(itemId)) {
                        itemsToLoad.push(itemId);
                    }
                });
            }

            if (itemsToLoad?.length) {
                const { data : itemsToLoadList = [] } = await refreshList({
                    id          : itemsToLoad,
                    limit       : 0,
                    isMergeList : true
                });

                itemsToLoadList.forEach(item => data.push(item));
            }

            const mergeOptions = prevSearch === params?.search ? [ ...options ] : [ ];

            data?.forEach(item => {
                const isExist = mergeOptions
                    ?.find(option => option?.value === item?.value || option?.value === item?.id);

                if (!isExist) {
                    const optionData = getMappedOption ? getMappedOption(item) : item;

                    mergeOptions.push(optionData);
                }
            });

            this.setState({
                total     : meta?.filteredCount,
                isLoading : false,
                options   : mergeOptions
            });
        } catch (error) {
            console.error('Async dropdown error: ', { error });
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { value, sortOptions, multiple } = this.props;
        const { isLoading, meta = {}, total, options = [] } = this.state;
        const { search = '' } = meta;
        const processValue = multiple ? value : [ value ]?.filter(el => !!el);
        const additionalOptions = [];

        if (!search && !isLoading) {
            const notAvailableValue = processValue?.filter(itemId => {
                return !options?.find(entity => entity.value === itemId);
            });

            notAvailableValue?.forEach(itemId => {
                additionalOptions.push({
                    value : itemId,
                    label : 'not available',
                    item  : {
                        id         : itemId,
                        color      : 'black',
                        background : 'black',
                        name       : 'not available',
                        label      : 'not available'
                    }
                });
            });
        }
        const sortedOptions = sortOptions ? sortOptions(options) : options;

        return (
            <Dropdown
                {...this.props}
                options = {additionalOptions?.length
                    ? [ ...additionalOptions, ...sortedOptions  ]
                    : sortedOptions
                }
                isLoading      = {isLoading}
                onLoadMore     = {this.handleLoadMore}
                onChangeSearch = {this.handleChangeSearch}
                meta           = {{
                    ...meta,
                    total
                }}
            />
        );
    }
}

export default AsyncDropdown;
