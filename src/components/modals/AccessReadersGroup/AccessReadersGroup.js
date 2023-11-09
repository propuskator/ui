/* eslint-disable  function-paren-newline, babel/no-unused-expressions */
import React, {
    useState,
    useCallback,
    useMemo,
    useEffect,
    useRef
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Chip                     from 'templater-ui/src/components/base/Chip';
import IconButton               from 'templater-ui/src/components/base/IconButton';

import {
    sortByIsArchived
}                               from 'Utils/sort';

import EntityWithSidebar        from '../EntityWithSidebar';

import styles                   from './AccessReadersGroup.less';

const cx = classnames.bind(styles);

const COUNT_TO_LOAD = 20;
const SYNC_WITH_REDUX = false;

function AccessReadersGroup(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        name, isTopModal, closeModal, onClose, entityId, level, forwardRef,
        fetchAccessTokenReaders, readersListFromState,
        createAccessReadersGroup, updateAccessReadersGroup, entityData, isCreateEntity, t
    } = props;
    const componentRef  = useRef({});
    const formRef       = useRef();
    const firstInputRef = useRef({});
    const entityListRef = useRef({});
    const requestParams = useRef({
        tokenReaders : {}
    });

    const [ selectedTokenReaders, setSelectedTokenReaders ] = useState(() => {
        return sortByIsArchived(entityData?.accessTokenReaders);
    });
    const [ isProcessing, setIsProcessing ]   = useState(false);
    const [ errors, setErrors ]               = useState({});
    const [ searchData, setSearchData ]       = useState({
        tokenReaders : ''
    });
    const [ accessTokenReadersList, setAccessTokenReadersList ] = useState([ ...readersListFromState ]);

    useEffect(() => {
        return () => onClose && onClose(componentRef.current.onCloseParams);
    }, []);

    function handleCloseModal() {
        closeModal(name);
    }

    async function refreshTokenReaders(params = requestParams?.current?.readersGroups) {
        const { limit = COUNT_TO_LOAD, offset = 0 } = params || {};

        requestParams.current = {
            ...requestParams.current,
            tokenReaders : {
                ...params,
                offset      : 0,
                limit       : limit + offset,
                isMergeList : false
            }
        };

        const readersList = await fetchAccessTokenReaders({
            ...(params || {}),
            sortedBy   : 'createdAt',
            isArchived : false
        }, accessTokenReadersList, SYNC_WITH_REDUX);

        setAccessTokenReadersList([ ...readersList.data ]);

        return readersList;
    }

    async function handleSubmit({ tokenReaders = [], ...restEntity }) {    // eslint-disable-line no-shadow
        const thisRef = componentRef.current;

        if (thisRef.isProcessing) return;
        thisRef.isProcessing = true;
        setIsProcessing(true);

        try {
            const handler = isCreateEntity ? createAccessReadersGroup : updateAccessReadersGroup;
            const data = isCreateEntity ? restEntity : { id: entityId, ...restEntity };

            data.accessTokenReaderIds = tokenReaders?.map(entity => entity.id);

            const result = await handler(data);

            componentRef.current.onCloseParams = {  // eslint-disable-line require-atomic-updates
                entity : result
            };

            // const toastMessage = isCreateEntity
            //     ? t('readers-groups-page:Space has been created')
            //     : t('readers-groups-page:Space has been updated');

            // addToast({
            //     key     : TOASTS_KEYS.accessTokenReaderUpdate,
            //     title   : t('Action was completed successfully'),
            //     message : toastMessage,
            //     type    : 'success'
            // });
            handleSuccess(result);
        } catch (error) {
            const fields = { };

            fields.formError = fields.message;

            error?.errors?.forEach(element => fields[element.field] = element.message);

            handleError(fields);
        }

        thisRef.isProcessing = false;
    }

    function handleSuccess(entity) {
        setIsProcessing(false);
        setErrors({});

        componentRef.current.onCloseParams = { entity };

        closeModal(name);
    }

    function handleError(errors) {    /* eslint-disable-line no-shadow */
        componentRef.current.isProcessing = false;
        setIsProcessing(false);
        setErrors(errors);
    }

    function handleInteract(fieldName) {
        setErrors(prevState => ({
            ...prevState,
            [fieldName] : null,
            formError   : null
        }));
    }

    function handleChangeSearch({ name, value }) {  // eslint-disable-line no-shadow
        setSearchData((prevData) => ({
            ...prevData,
            [name] : value
        }));
    }

    function handleCancell() {
        handleCloseModal();
    }

    function handleAddTokenReader(itemId) {
        const { tokenReaders = [] } = formRef?.current?.getValue() || {};    /* eslint-disable-line no-shadow */
        const selected = accessTokenReadersList.find(entity => entity.id == itemId);    // eslint-disable-line eqeqeq
        const isExist  = tokenReaders.find(entity => entity.id == itemId);    // eslint-disable-line eqeqeq

        const valueToSet = isExist
            ? tokenReaders
            : [ ...tokenReaders, selected ];

        formRef?.current?.setValue({   // eslint-disable-line no-unused-expressions, no-undef
            name  : 'tokenReaders',
            value : valueToSet
        });
    }

    function handleDeleteSelectedTokenReader(itemId) {
        const { tokenReaders = [] } = formRef?.current?.getValue() || {};  // eslint-disable-line no-shadow
        const valueToSet = tokenReaders.filter(entity => entity.id !== itemId);

        formRef?.current?.setValue({
            name  : 'tokenReaders',
            value : valueToSet
        });
    }

    function formDataFormatter({ name, value }) {   // eslint-disable-line no-shadow
        if (name === 'tokenReaders') setSelectedTokenReaders(value);

        switch (name) {
            case 'name':
                return leftrim(value);
            default:
                return value;
        }
    }

    function leftrim(str) {
        if (!str) return str;

        return str.replace(/^\s+/g, '');
    }

    function getAvailableTokenReaders() {
        return accessTokenReadersList?.filter(selected =>
            !(selectedTokenReaders || []).find(readersGroup => readersGroup?.id == selected.id)) || []; // eslint-disable-line eqeqeq, max-len
    }

    function getMobileReadersList() {
        const listToRender = [ ...accessTokenReadersList ];

        selectedTokenReaders?.forEach(item => {
            const isExist = listToRender?.find(entity => entity?.id === item?.id);

            if (!isExist) listToRender.push(item);
        });

        return listToRender;
    }

    function renderReadersGroups(item) {
        const isSelected = selectedTokenReaders?.find(entity => entity?.id === item?.id);

        if (!!isSelected) return null;

        return (
            <div className={styles.expandedListDetails} key={`${item.id}${item.fullName}`}>
                { sortByIsArchived(item?.accessReadersGroups)
                    ?.map(entity => (
                        <Chip
                            key        = {`${entity?.name}`}
                            variant    = 'outlined'
                            background = {entity.color}
                            isArchived = {entity?.isArchived}
                            size       = 'S'
                            t          = {t}
                        >
                            { entity?.name }
                        </Chip>
                    )
                )}
            </div>
        );
    }

    function renderTokenReader(item, isPreview, isDeleteAvailable) {
        const itemtoRender = isPreview
            ? accessTokenReadersList?.find(entity => entity.id == item)  // eslint-disable-line eqeqeq
            : item;

        if (!itemtoRender) return null;

        const chipCN = cx(styles.chip, {
            preview    : isPreview,
            expandable : !!itemtoRender?.accessReadersGroups?.length
        });

        return (
            <Chip
                key        = {itemtoRender.id}
                className  = {chipCN}
                color      = 'green'
                variant    = 'outlined'
                isArchived = {itemtoRender?.isArchived}
                onDelete   = {isDeleteAvailable ? () => handleDeleteSelectedTokenReader(itemtoRender.id) : void 0}  // eslint-disable-line react/jsx-no-bind, max-len
                disabled   = {componentRef.current.isProcessing}
                t          = {t}
            >
                {itemtoRender.name}
            </Chip>
        );
    }

    function setRef(ref) {
        if (!forwardRef) return;

        forwardRef.current = ref;
    }

    const accessReadersGroupCN = cx(styles.AccessReadersGroup, {
        topModal          : isTopModal,
        [`${level}Level`] : level
    });
    const availableTokenReaders = getAvailableTokenReaders();

    return (
        <div className={accessReadersGroupCN} key={name} ref={setRef}>
            <IconButton
                className = {styles.closeButton}
                iconType = 'cross'
                onClick = {handleCancell}
            />
            <EntityWithSidebar
                level   = {level}
                t       = {t}
                sidebar = {useMemo(() => ({
                    items : [ {
                        id                : 'tokenReaders',
                        name              : 'tokenReaders',
                        title             : t('Spaces'),
                        className         : styles.sidebarList,
                        list              : availableTokenReaders,
                        selected          : selectedTokenReaders,
                        renderItem        : renderTokenReader,
                        renderItemDetails : renderReadersGroups,
                        expandedKey       : 'accessReadersGroups',
                        emptyMessage      : t('readers-groups-page:There are no points to display'),
                        searchLabel       : t('readers-groups-page:Find access point'),
                        forwardRef        : entityListRef,
                        onAddEntity       : handleAddTokenReader,
                        search            : searchData.tokenReaders,
                        updateSearch      : handleChangeSearch,
                        refreshList       : refreshTokenReaders,
                        countToLoad       : 30
                    } ]
                }), [
                    searchData, availableTokenReaders, selectedTokenReaders?.length
                ])}
                errors                = {errors}
                controls              = {useMemo(() => ({
                    submit : {
                        title : `${isCreateEntity ? t('Create') : t('Update') }`
                    }
                }), [])}
                isProcessing          = {isProcessing}
                formRef               = {formRef}
                closeModal            = {useCallback(handleCloseModal, [])}
                formatter             = {useCallback(formDataFormatter, [])}
                onSubmit              = {useCallback(handleSubmit, [])}
                onInteract            = {useCallback(handleInteract, [])}
                onCancell             = {useCallback(handleCancell, [])}
                initialState          = {useMemo(() => ({
                    name         : entityData?.name || '',
                    color        : entityData?.color || '',
                    tokenReaders : !isCreateEntity ? selectedTokenReaders : []
                }), [ ])}
                title               = {isCreateEntity ? t('readers-groups-page:Create space') : t('readers-groups-page:Edit space')}
                entityConfiguration = {useMemo(() => ({
                    name   : 'accessTokenReader',
                    fields : [
                        {
                            name    : 'name',
                            type    : 'string',
                            label   : t('readers-groups-page:Space name'),
                            default : '',
                            props   : {
                                autoFocus : true,
                                ref       : firstInputRef
                            }
                        },
                        {
                            name    : 'color',
                            type    : 'colorPicker',
                            label   : t('readers-groups-page:Space color'),
                            default : entityData?.color,
                            props   : {
                                withError : false,
                                key       : 'colorpicker'
                            }
                        },
                        {
                            name    : 'tokenReaders',
                            type    : 'mobileEntityList',
                            label   : t('Spaces'),
                            default : '',
                            props   : {
                                name              : 'tokenReaders',
                                className         : styles.mobileList,
                                searchLabel       : t('readers-groups-page:Find access point'),
                                list              : getMobileReadersList(),
                                forwardRef        : entityListRef,
                                refreshList       : refreshTokenReaders,
                                expandedKey       : 'accessReadersGroups',
                                renderItem        : renderTokenReader,
                                renderItemDetails : renderReadersGroups,
                                onAddEntity       : handleAddTokenReader,
                                onDeleteEntity    : handleDeleteSelectedTokenReader,
                                search            : searchData.tokenReaders,
                                updateSearch      : handleChangeSearch,
                                emptyMessage      : t('readers-groups-page:There are no points to display'),
                                withError         : false,
                                countToLoad       : 30,
                                key               : 'mobileReadersGroups'
                            }
                        },
                        {
                            name      : 'tokenReaders',
                            type      : 'draggableList',
                            label     : '',
                            default   : '',
                            className : styles.draggableListWrapper,
                            props     : {
                                className      : styles.draggableList,
                                emptyListLabel : t('readers-groups-page:Drag access point here to create space'),
                                renderItem     : (item, isPreview) => renderTokenReader(item, isPreview, true),
                                list           : accessTokenReadersList,
                                withError      : false,
                                key            : 'draggableReadersGroups'
                            }
                        }
                    ]
                }), [ accessTokenReadersList, searchData, selectedTokenReaders?.length ])}
            />
        </div>
    );
}

AccessReadersGroup.propTypes = {
    isCreateEntity : PropTypes.bool,
    entityId       : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    entityData     : PropTypes.shape({
        name               : PropTypes.string,
        code               : PropTypes.string,
        accessTokenReaders : PropTypes.array
    }),
    closeModal              : PropTypes.func.isRequired,
    name                    : PropTypes.string.isRequired,
    fetchAccessTokenReaders : PropTypes.func.isRequired,
    readersListFromState    : PropTypes.arrayOf(PropTypes.shape({
        id   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
        name : PropTypes.string.isRequired
    })).isRequired,

    createAccessReadersGroup : PropTypes.func.isRequired,
    updateAccessReadersGroup : PropTypes.func.isRequired,
    forwardRef               : PropTypes.shape({  current: PropTypes.shape({ }) }),
    onClose                  : PropTypes.func,
    level                    : PropTypes.oneOf([ 'first', 'second' ]),
    isTopModal               : PropTypes.bool.isRequired,
    t                        : PropTypes.func.isRequired
};

AccessReadersGroup.defaultProps = {
    entityId       : '',
    entityData     : {},
    isCreateEntity : false,
    level          : 'first',
    forwardRef     : void 0,
    onClose        : void 0
};

export default AccessReadersGroup;
