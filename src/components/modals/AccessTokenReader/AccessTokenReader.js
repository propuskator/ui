/* eslint-disable no-magic-numbers, more/no-duplicated-chains, babel/no-unused-expressions, no-shadow */

import React, {
    useState,
    useCallback,
    useMemo,
    useEffect,
    useRef
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import { useMedia }             from 'templater-ui/src/utils/mediaQuery';
import Chip                     from 'templater-ui/src/components/base/Chip';
import IconButton               from 'templater-ui/src/components/base/IconButton';

import {
    sortByIsArchived
}                               from 'Utils/sort';

import EntityWithSidebar        from '../EntityWithSidebar';
import SecondLevelModal         from '../SecondLevelModal';

import styles                   from './AccessTokenReader.less';

const cx = classnames.bind(styles);

const COUNT_TO_LOAD = 20;

function AccessTokenReader(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        name, isTopModal, closeModal, onClose, entityId, level, forwardRef,
        fetchAccessReadersGroups, accessReadersGroupsList,
        createAccessTokenReader, updateAccessTokenReader, entityData, isCreateEntity,
        fetchAccessTokenReadersPhones, t
    } = props;
    const componentRef  = useRef({});
    const formRef       = useRef();
    const firstInputRef = useRef({});
    const entityListRef = useRef({});
    const requestParams = useRef({
        readersGroups : {}
    });
    const [ selectedReadersGroups, setSelectedReadersGroups ] = useState(() => {
        return sortByIsArchived(entityData?.accessReadersGroups);
    });
    const [ phonesOptions, setPhonesOptions ] = useState([]);
    const [ isProcessing, setIsProcessing ]   = useState(false);
    const [ errors, setErrors ]               = useState({});
    const [ searchData, setSearchData ]       = useState({
        accessReadersGroups : ''
    });
    const [ modalData, setModalData ] = useState(null);

    useEffect(() => {
        fetchAccessReadersGroups({});
        initializingModal();

        return () => onClose && onClose(componentRef.current.onCloseParams);
    }, []);

    async function initializingModal() {
        setIsProcessing(true);

        const phones = await fetchAccessTokenReadersPhones() || [];
        const options = phones?.map(phone => ({ label: phone, value: phone }));

        const { phone } = entityData || {};

        if (phone) options.push({ label: phone, value: phone });

        setPhonesOptions(options);
        setIsProcessing(false);
    }

    function handleCloseModal() {
        closeModal(name);
    }

    function refreshAccessReadersGroups(params = requestParams?.current?.readersGroups) {
        const { limit = COUNT_TO_LOAD, offset = 0 } = params || {};

        requestParams.current = {
            ...requestParams.current,
            readersGroups : {
                ...params,
                offset      : 0,
                limit       : limit + offset,
                isMergeList : false
            }
        };

        return fetchAccessReadersGroups({
            ...(params || {}),
            isArchived : false
        });
    }

    const isMobile = useMedia(
        // Media queries
        [ '(max-width: 612px)', '(min-width: 613px)' ],
        // values by media index
        [ true, false ],
        // Default
        false
    );

    function calcModalPosition() {
        if (isMobile) {
            return ({
                position : 'absolute',
                top      : `${ modalData?.styles?.top - 240 }px` // 240 - distance from the clicked button to the top border of the first level modal
            });
        }

        return ({
            position : 'absolute',
            top      : `${ modalData?.styles?.top - 40 }px` // 40 - distance from the clicked button to the top border of the first level modal
        });
    }

    function openSecondLevelModal(e, { name, props, modalParams = {} } = {}) {    /* eslint-disable-line no-shadow */
        const nodeData = e?.target?.getBoundingClientRect() || null;
        const modalStyles = nodeData
            ? ({
                top  : nodeData?.y,
                left : nodeData?.x
            }) : null;

        setModalData({
            name,
            props,
            ...modalParams,
            styles : modalStyles
        });
    }

    function closeSecondLevelModal() {
        setModalData(void 0);
    }

    async function handleSubmit({ accessReadersGroups = [], ...restEntity }) {
        const thisRef = componentRef.current;

        if (thisRef.isProcessing) return;
        thisRef.isProcessing = true;
        setIsProcessing(true);

        try {
            const handler = isCreateEntity ? createAccessTokenReader : updateAccessTokenReader;
            const data = isCreateEntity ? restEntity : { id: entityId, ...restEntity };

            data.accessReadersGroupIds = accessReadersGroups.map(entity => entity.id);

            const result = await handler(data);

            // const toastMessage = isCreateEntity
            //     ? t('readers-page:Access point has been created')
            //     : t('readers-page:Access point has been updated');

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

    function handleError(errors) {
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

    function handleChangeSearch({ name, value }) {
        setSearchData((prevData) => ({
            ...prevData,
            [name] : value
        }));
    }

    function handleCancell() {
        handleCloseModal();
    }

    function handleAddAccessReadersGroup(itemId) {
        const { accessReadersGroups = [] } = formRef?.current?.getValue() || {};
        const selected = accessReadersGroupsList.find(entity => entity?.id == itemId);    // eslint-disable-line eqeqeq
        const isExist  = accessReadersGroups.find(entity => entity?.id == itemId);    // eslint-disable-line eqeqeq

        const valueToSet = isExist
            ? accessReadersGroups
            : [ ...accessReadersGroups, selected ];

        formRef?.current?.setValue({   // eslint-disable-line no-unused-expressions, no-undef
            name  : 'accessReadersGroups',
            value : valueToSet
        });
    }

    function handleDeleteSelectedReadersGroup(itemId) {
        const { accessReadersGroups = [] } = formRef?.current?.getValue() || {};
        const valueToSet = accessReadersGroups.filter(entity => entity?.id !== itemId);

        formRef?.current?.setValue({
            name  : 'accessReadersGroups',
            value : valueToSet
        });
    }

    function handleOpenReadersGroupsModal(e) {  // eslint-disable-line
        openSecondLevelModal(e, {
            name        : 'accessReadersGroup',
            modalParams : {
                width  : 305,
                height : 523
            },
            props : {
                isCreateEntity : true,
                onClose        : ({ entity = {} } = {}) => {
                    firstInputRef.current.focus();
                    if (entity?.id) {
                        accessReadersGroupsList.push(entity);
                        handleAddAccessReadersGroup(entity?.id);
                        fetchAccessReadersGroups({});
                    }
                },
                onCancell : () => closeSecondLevelModal()
            }
        });
    }

    function formDataFormatter({ name, value }) {
        if (name === 'accessReadersGroups') setSelectedReadersGroups(value);

        switch (name) {
            case 'code':
                return value ? value.trim() : value;
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

    function getAvailableReaderGroups() {
        const availableTokens = accessReadersGroupsList || [];

        return availableTokens.filter(selected =>
            !(selectedReadersGroups || []).find(readersGroup => readersGroup?.id == selected.id)) || []; // eslint-disable-line eqeqeq, max-len
    }

    function getMobileReadersGroupsList() {
        const listToRender = [ ...accessReadersGroupsList ];

        selectedReadersGroups?.forEach(item => {
            const isExist = listToRender?.find(entity => entity?.id === item?.id);

            if (!isExist) listToRender.push(item);
        });

        return listToRender;
    }

    function renderAccessReaderGroup(item, isPreview) {
        const itemtoRender = isPreview
            ? accessReadersGroupsList?.find(entity => entity.id == item)  // eslint-disable-line eqeqeq
            : item;

        if (!itemtoRender) return null;

        const chipCN = cx(styles.chip, { preview: isPreview });

        return (
            <Chip
                key        = {itemtoRender.id}
                className  = {chipCN}
                background = {itemtoRender.color}
                isArchived = {itemtoRender?.isArchived}
                onDelete   = {() => handleDeleteSelectedReadersGroup(itemtoRender.id)}  // eslint-disable-line react/jsx-no-bind, max-len
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

    const accessTokenReaderCN = cx(styles.AccessTokenReader, {
        topModal          : isTopModal,
        [`${level}Level`] : level
    });
    const availableReadersGroups = getAvailableReaderGroups();

    return (
        <div className={accessTokenReaderCN} key={name} ref={setRef}>
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
                        id             : 'accessReadersGroups',
                        name           : 'accessReadersGroups',
                        title          : t('Spaces'),
                        list           : availableReadersGroups,
                        selected       : selectedReadersGroups,
                        expandedKey    : 'accessTokenReaders',
                        emptyMessage   : t('readers-page:There are no spaces to display'),
                        searchLabel    : t('readers-page:Find space'),
                        forwardRef     : entityListRef,
                        onCreateEntity : handleOpenReadersGroupsModal,
                        onAddEntity    : handleAddAccessReadersGroup,
                        search         : searchData.accessReadersGroups,
                        updateSearch   : handleChangeSearch,
                        refreshList    : refreshAccessReadersGroups,
                        countToLoad    : 30
                    } ]
                }), [
                    searchData,
                    availableReadersGroups, selectedReadersGroups
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
                    name                : entityData?.name || '',
                    code                : entityData?.code || '',
                    phone               : entityData?.phone || '',
                    accessReadersGroups : !isCreateEntity
                        ? sortByIsArchived(selectedReadersGroups)
                        : []
                }), [ ])}
                title               = {isCreateEntity ? t('readers-page:Create access point') : t('readers-page:Edit access point')}
                entityConfiguration = {useMemo(() => ({
                    name   : 'accessTokenReader',
                    fields : [
                        {
                            name    : 'name',
                            type    : 'string',
                            label   : t('readers-page:Access point name'),
                            default : '',
                            props   : {
                                autoFocus : true,
                                ref       : firstInputRef
                            }
                        },
                        {
                            name    : 'code',
                            type    : 'string',
                            label   : t('readers-page:Reader ID'),
                            default : '',
                            props   : {
                                disabled : !isCreateEntity
                            }
                        },
                        {
                            name    : 'phone',
                            type    : 'dropdown',
                            label   : t('Dial number'),
                            default : '',
                            props   : {
                                options      : phonesOptions,
                                withKeyboard : false
                            }
                        },
                        {
                            name      : 'accessReadersGroups',
                            type      : 'mobileEntityList',
                            label     : t('Spaces'),
                            className : styles.mobileReadersList,
                            default   : '',
                            props     : {
                                name           : 'accessReadersGroups',
                                searchLabel    : t('readers-page:Find space'),
                                list           : getMobileReadersGroupsList(),
                                forwardRef     : entityListRef,
                                refreshList    : refreshAccessReadersGroups,
                                expandedKey    : 'accessTokenReaders',
                                onAddEntity    : handleAddAccessReadersGroup,
                                onCreateEntity : handleOpenReadersGroupsModal,
                                onDeleteEntity : handleDeleteSelectedReadersGroup,
                                search         : searchData.accessReadersGroups,
                                updateSearch   : handleChangeSearch,
                                emptyMessage   : t('readers-page:There are no spaces to display'),
                                withError      : false,
                                countToLoad    : 30,
                                key            : 'mobileReadersGroups'
                            }
                        },
                        {
                            name      : 'accessReadersGroups',
                            type      : 'draggableList',
                            label     : '',
                            default   : '',
                            className : styles.draggableListWrapper,
                            props     : {
                                className      : styles.draggableList,
                                emptyListLabel : t('readers-page:Drag spaces here to create access point'),
                                renderItem     : renderAccessReaderGroup,
                                list           : accessReadersGroupsList,
                                withError      : false,
                                searchLabel    : t('readers-page:Find space'),
                                key            : 'draggableReadersGroups'
                            }
                        }
                    ]
                }), [ accessReadersGroupsList, searchData, phonesOptions ])}
            />
            <SecondLevelModal
                modalData         = {modalData}
                closeModal        = {closeSecondLevelModal}
                calcModalPosition = {calcModalPosition}
            />
        </div>
    );
}

AccessTokenReader.propTypes = {
    isCreateEntity : PropTypes.bool,
    entityId       : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    entityData     : PropTypes.shape({
        name                  : PropTypes.string,
        code                  : PropTypes.string,
        accessReadersGroupIds : PropTypes.array
    }),
    closeModal : PropTypes.func.isRequired,
    name       : PropTypes.string.isRequired,

    fetchAccessReadersGroups : PropTypes.func.isRequired,
    accessReadersGroupsList  : PropTypes.arrayOf(PropTypes.shape({
        id   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
        name : PropTypes.string.isRequired
    })).isRequired,

    createAccessTokenReader       : PropTypes.func.isRequired,
    updateAccessTokenReader       : PropTypes.func.isRequired,
    fetchAccessTokenReadersPhones : PropTypes.func.isRequired,
    forwardRef                    : PropTypes.shape({  current: PropTypes.shape({ }) }),
    onClose                       : PropTypes.func,
    level                         : PropTypes.oneOf([ 'first', 'second' ]),
    isTopModal                    : PropTypes.bool.isRequired,
    t                             : PropTypes.func.isRequired
};

AccessTokenReader.defaultProps = {
    entityId       : '',
    entityData     : {},
    isCreateEntity : false,
    level          : 'first',
    forwardRef     : void 0,
    onClose        : void 0
};

export default AccessTokenReader;
