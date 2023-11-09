/* eslint-disable no-magic-numbers, react/prop-types, babel/no-unused-expressions, function-paren-newline */

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
import ChipSubject              from 'templater-ui/src/components/base/Chip/ChipSubject';
import IconButton               from 'templater-ui/src/components/base/IconButton';

import {
    checkIsScheduleRepeated,
    getFormattedSchedule
}                               from 'Utils/schedules';
import {
    sortByIsArchived
}                               from 'Utils/sort';

import EntityWithSidebar        from '../EntityWithSidebar';

import styles                   from './AccessSetting.less';

const cx = classnames.bind(styles);

function AccessSetting(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        level, isTopModal, name, onClose, closeModal, isCreateEntity, entityId, entityData,
        forwardRef, createAccessSetting, updateAccessSetting, t,
        fetchAccessSubjects,
        accessTokenReadersList, fetchAccessTokenReaders,
        accessReadersGroupsList, fetchAccessReadersGroups,
        fetchAccessSchedules, timezone
    } = props;
    const [ searchData, setSearchData ] = useState({
        accessSubjects  : '',
        accessReaders   : '',
        accessSchedules : ''
    });
    const accessSubjectsList  = props?.accessSubjectsList?.map(item => ({ ...item, uniqueId: `${item?.id}-subject` })) || [];
    const accessSchedulesList = props?.accessSchedulesList?.map(item => ({ ...item, uniqueId: `${item?.id}-schedule` })) || [];

    const componentRef  = useRef({});
    const formRef       = useRef();
    const firstInputRef = useRef({});
    const thisRef = componentRef.current;
    const [ isProcessing, setIsProcessing ]                       = useState(false); // eslint-disable-line no-unused-vars, max-len
    const [ errors, setErrors ]                                   = useState({});
    const [ selectedAccessSubjects, setSelectedAccessSubjects ]   = useState(() => {
        const list = entityData?.accessSubjects?.map(item => ({ ...item, uniqueId: `${item?.id}-subject` })) || [];

        return !isCreateEntity ? sortByIsArchived(list) : [];
    });
    const [ selectedReaders, setSelectedReaders ]                 = useState(() => {
        return !isCreateEntity
            ? sortByIsArchived([
                ...(entityData?.accessReadersGroups
                        ?.map(entity => ({ ...entity, isGroup: true, uniqueId: `${entity?.id}-group` })) || []),
                ...(entityData?.accessTokenReaders
                        ?.map(entity => ({ ...entity, isGroup: false, uniqueId: `${entity?.id}-reader` })) || [])
            ]) : [];
    });
    const [ selectedAccessSchedules, setSelectedAccessSchedules ] = useState(() => {
        const list = entityData?.accessSchedules?.map(item => ({ ...item, uniqueId: `${item?.id}-schedule` })) || [];

        return !isCreateEntity ? sortByIsArchived(list) : [];
    });

    const [ readersList, setReadersList ] = useState([]);

    useEffect(() => {
        const readers = accessReadersGroupsList.map(entity => ({ ...entity, isGroup: true }));

        accessTokenReadersList.forEach(entity => readers.push({ ...entity, isGroup: false }));

        setReadersList(readers?.map(reader => ({
            ...reader,
            uniqueId : `${reader?.id}-${reader?.isGroup ? 'group' : 'reader'}`
        })));
    }, [ accessReadersGroupsList, accessTokenReadersList ]);

    useEffect(() => {
        firstInputRef?.current?.focus();

        return () => onClose(componentRef.current.onCloseParams);
    }, []);

    function getSchedulesList(list, isMobileList) {
        const listToRender = [ ...list ];

        if (isMobileList) {
            selectedAccessSchedules?.forEach(item => {
                const isExist = listToRender?.find(entity => entity?.id === item?.id);

                if (!isExist) listToRender.push(item);
            });
        }

        return listToRender
            .map(listItem => ({
                ...listItem,
                isExpandable : true,
                name         : listItem.name
            }));
    }

    function getReadersList(list, isMobileList) {
        const listToRender = [ ...list ];

        if (isMobileList) {
            selectedReaders?.forEach(item => {
                const isExist = listToRender?.find(entity => entity?.uniqueId === item?.uniqueId);

                if (!isExist) listToRender.push(item);
            });
        }

        return listToRender
            .map(listItem => ({
                ...listItem,
                isExpandable : !!listItem?.isGroup
                    ? !!listItem?.accessTokenReaders?.length
                    : !!listItem?.accessReadersGroups?.length,
                name : listItem?.name
            }));
    }

    function getSubjectsList(list, isMobileList) {
        const listToRender = [ ...list ];

        if (isMobileList) {
            selectedAccessSubjects?.forEach(item => {
                const isExist = listToRender?.find(entity => entity?.id === item?.id);

                if (!isExist) listToRender.push(item);
            });
        }

        return listToRender
            .map(listItem => ({
                ...listItem,
                isExpandable : !!(listItem?.position || listItem?.email
                    || listItem?.phone || listItem?.accessSubjectTokens?.length)
            }));
    }

    function refreshAccessSubjects(params = {}) {
        const processParams = { ...params, isArchived: false };

        return fetchAccessSubjects(processParams);
    }

    function refreshAccessTokenReaders(params = {}) {
        const processParams = { ...params, isArchived: false };

        return fetchAccessTokenReaders(processParams);
    }

    function refreshAccessSchedules(params = {}) {
        const processParams = { ...params, isArchived: false };

        return fetchAccessSchedules(processParams);
    }

    function refreshAccessReadersGroups(params = {}) {
        const processParams = { ...params, isArchived: false };

        return fetchAccessReadersGroups(processParams);
    }

    async function refreshReaders(params) {
        const promises = [
            refreshAccessReadersGroups(params),
            refreshAccessTokenReaders(params)
        ];

        const [ readersGroups = {}, tokenReaders = {} ] = await Promise.all(promises);

        const result = {
            meta : {
                filteredCount : readersGroups?.meta?.filteredCount
                    + tokenReaders?.meta?.filteredCount
            }
        };

        return result;
    }

    function handleCloseModal() {
        closeModal(name);
    }

    function getListWithoutSelected(list, selected) {
        return list.filter(listItem => !selected.find(entity => {
            if ('isGroup' in listItem) {
                return entity.isGroup === listItem.isGroup
                    && entity.id === listItem.id;
            }

            return entity.id === listItem.id;
        }));
    }

    async function handleSubmit() {    // eslint-disable-line no-shadow, no-unused-vars
        if (thisRef.isProcessing) return;
        thisRef.isProcessing = true;
        setIsProcessing(true);
        const formData = {
            accessSubjectIds      : selectedAccessSubjects.map(entity => entity.id),
            accessTokenReaderIds  : selectedReaders.filter(entity => !entity?.isGroup).map(entity => entity.id),
            accessReadersGroupIds : selectedReaders.filter(entity => entity?.isGroup).map(entity => entity.id),
            accessScheduleIds     : selectedAccessSchedules.map(entity => entity.id)
        };

        try {
            const handler = isCreateEntity ? createAccessSetting : updateAccessSetting;
            const data = isCreateEntity ? formData : { id: entityId, ...formData };

            const result = await handler(data);

            // const toastMessage = isCreateEntity
            //     ? t('access-page:Access has been created')
            //     : t('access-page:Access has been updated');

            // addToast({
            //     key     : TOASTS_KEYS.accessSettingUpdate,
            //     title   : t('Action was completed successfully'),
            //     message : toastMessage,
            //     type    : 'success'
            // });
            handleSuccess(result);
        } catch (error) {
            const fields = { };

            fields.formError = fields.message;

            error?.errors?.forEach(element => {
                const { message = '', field } = element || {};

                if (field === 'accessSubjectIds') {
                    fields.selectedAccessSubjects = message;
                } else if ([ 'accessTokenReaderIds', 'accessReadersGroupIds' ].includes(field)) {
                    fields.selectedReaders = message;
                } else if (field === 'accessScheduleIds') {
                    fields.selectedAccessSchedules = message;
                }
            });

            handleError(fields);
        }

        thisRef.isProcessing = false;   // eslint-disable-line require-atomic-updates
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

    function handleCancell() {
        handleCloseModal();
    }

    function handleChangeSearch({ name, value }) {  // eslint-disable-line no-shadow
        setSearchData((prevData) => ({
            ...prevData,
            [name] : value
        }));
    }

    function handleAddSchedule(itemId, isUniqueId) {
        const selected = accessSchedulesList.find(entity =>  !isUniqueId
            ? entity.id === itemId
            : entity.uniqueId === itemId);
        const isExist  = selectedAccessSchedules.find(entity => !isUniqueId
            ? entity.id === itemId
            : entity.uniqueId === itemId);

        if (isExist) return;

        handleInteract('selectedAccessSchedules');
        setSelectedAccessSchedules([ ...selectedAccessSchedules, selected ]);
    }

    function handleDeleteSchedule(itemId) {
        const result = selectedAccessSchedules.filter(entity => entity.id !== itemId);

        handleInteract('selectedAccessSchedules');
        setSelectedAccessSchedules(result);
    }

    function renderSchedule(item, isPreview, isDeleteAvailable) {
        const itemtoRender = isPreview
            ? accessSchedulesList?.find(entity => entity.uniqueId === item)
            : item;

        if (!itemtoRender) return null;

        return (
            <div
                key       = {`${itemtoRender.id}${itemtoRender.name}${isPreview}${isDeleteAvailable}`}
                className = {cx(styles.listItemPreview, {
                    preview       : isPreview,
                    expandable    : true,
                    notExpandable : false
                })}
            >
                <Chip
                    className      = {styles.chip}
                    variant        = {checkIsScheduleRepeated(itemtoRender) ? 'filled' : 'outlined'}
                    color          = 'accessSchedule'
                    size           = 'M'
                    t              = {t}
                    tooltipContent = {itemtoRender.name}
                    isArchived     = {itemtoRender?.isArchived}
                    onDelete       = {isDeleteAvailable
                        ? () => handleDeleteSchedule(itemtoRender.id)
                        : null
                    }
                >
                    {itemtoRender.name}
                </Chip>
            </div>
        );
    }

    function renderScheduleDetails(item) {
        const formattedSchedule = getFormattedSchedule(item, timezone);

        return (
            <div className={cx(styles.expandedListDetails, styles.scheduleList)} key={`${item.id}${item.name}`}>
                { formattedSchedule }
            </div>
        );
    }

    function renderReader(item, isPreview, isDeleteAvailable) {
        const itemtoRender = isPreview
            ? readersList?.find(entity => entity.uniqueId === item)
            : item;

        if (!itemtoRender) return null;

        const { isGroup = false } = itemtoRender;
        const readerName = isGroup ? itemtoRender.name : itemtoRender.name;
        const expandedList = isGroup
            ? itemtoRender?.accessTokenReaders
            : itemtoRender?.accessReadersGroups;

        return (
            <div
                key       = {`${itemtoRender.id}${readerName}${isPreview}${isDeleteAvailable}`}
                className = {cx(styles.listItemPreview, {
                    preview       : isPreview,
                    expandable    : !!expandedList?.length,
                    notExpandable : !expandedList?.length
                })}
            >
                <Chip
                    {...itemtoRender}
                    className      = {styles.chip}
                    variant        = {isGroup ? void 0 : 'outlined'}
                    color          = {isGroup ? void 0 : 'green'}
                    background     = {isGroup ? itemtoRender.color : void 0}
                    size           = 'M'
                    isArchived     = {itemtoRender?.isArchived}
                    tooltipContent = {readerName}
                    t              = {t}
                    onDelete       = {isDeleteAvailable
                        ? () => {
                            handleDeleteReader(itemtoRender.uniqueId, true);
                        } : null
                    }
                >
                    {readerName}
                </Chip>
            </div>
        );
    }

    function renderReaderDetails(item) {
        const { accessReadersGroups = [], accessTokenReaders = [], isGroup = false } = item;
        const list = isGroup ? accessTokenReaders : accessReadersGroups;

        if (!list?.length) return;

        return (
            <div
                className = {cx(styles.expandedListDetails, styles.chipList)}
                key       = {`${item.id}${isGroup}`}
            >
                { sortByIsArchived(list)
                    ?.map(listItem => (
                        <Chip
                            key            = {`${listItem.id}${listItem.name}${isGroup}`}
                            className      = {styles.chip}
                            t              = {t}
                            background     = {!isGroup ? listItem.color : void 0}
                            color          = {!isGroup ? void 0 : 'green'}
                            variant        = {!isGroup ? void 0 : 'outlined'}
                            size           = 'S'
                            isArchived     = {listItem?.isArchived}
                            tooltipContent = {listItem.name}
                        >
                            {listItem.name}
                        </Chip>
                    )
                )}
            </div>
        );
    }

    function handleAddReader(itemId, isUniqueId) {
        const selected = readersList.find(entity => !isUniqueId
            ? entity?.id === itemId
            : entity?.uniqueId === itemId);
        const isExist  = selectedReaders.find(entity => !isUniqueId
            ? entity.id === itemId
            : entity.uniqueId === itemId);

        if (isExist) return;

        handleInteract('selectedReaders');
        setSelectedReaders([ ...selectedReaders, selected ]);
    }

    function handleDeleteReader(itemId, isUniqueId) {
        const result = selectedReaders.filter(item => !isUniqueId
            ? item.id !== itemId
            : item.uniqueId !== itemId);

        handleInteract('selectedReaders');
        setSelectedReaders(result);
    }

    function handleDeleteSubject(itemId) {
        const result = selectedAccessSubjects.filter(entity => entity.id !== itemId);

        handleInteract('selectedAccessSubjects');
        setSelectedAccessSubjects(result);
    }

    function handleAddSubject(itemId, isUniqueId) {
        const selected = accessSubjectsList.find(entity => !isUniqueId
            ? entity.id === itemId
            : entity.uniqueId === itemId);
        const isExist  = selectedAccessSubjects.find(entity => entity.id === itemId);

        if (isExist) return;

        handleInteract('selectedAccessSubjects');
        setSelectedAccessSubjects([ ...selectedAccessSubjects, selected ]);
    }

    function renderSubject(item, isPreview, isDeleteAvailable, isDraggableList) {
        const itemtoRender = isPreview
            ? accessSubjectsList?.find(entity => entity.uniqueId === item)
            : item;

        if (!itemtoRender) return null;

        const isExpandable = !!(itemtoRender?.position || itemtoRender?.email
            || itemtoRender?.phone || itemtoRender?.accessSubjectTokens?.length);

        return (
            <div
                key       = {`${itemtoRender.fullName}${itemtoRender.id}${isPreview}${isDeleteAvailable}`}
                className = {cx(styles.listItemPreview, {
                    preview       : isPreview,
                    expandable    : isExpandable,
                    notExpandable : !isExpandable
                })}
            >
                <ChipSubject
                    fullName    = {itemtoRender?.fullName}
                    avatarColor = {itemtoRender?.avatarColor}
                    name        = {itemtoRender?.name}
                    avatar      = {itemtoRender?.avatar}
                    isArchived  = {itemtoRender?.isArchived}
                    t           = {t}
                    onDelete    = {isDeleteAvailable ? () => handleDeleteSubject(itemtoRender.id) : null}
                    size        = {isDraggableList ? 'XL' : 'XXL'}
                />
            </div>
        );
    }

    function renderSubjectDetails(item) {
        return (
            <div className={styles.expandedListDetails} key={`${item.id}${item.fullName}`}>
                { item.position ? (
                    <div className={styles.descriptionField}>
                        <div className={styles.fieldName}>{t('subjects-page:Position')}:</div>
                        <div className={styles.fieldValue}>{item.position}</div>
                    </div>
                ) : null }
                { item.email ? (
                    <div className={styles.descriptionField}>
                        <div className={styles.fieldName}>Email:</div>
                        <div className={styles.fieldValue}>{item.email}</div>
                    </div>
                ) : null }
                { item.phone ? (
                    <div className={styles.descriptionField}>
                        <div className={styles.fieldName}>{t('subjects-page:Phone')}:</div>
                        <div className={styles.fieldValue}>{item.phone}</div>
                    </div>
                ) : null }
                { item.accessSubjectTokens?.length ? (
                    <div className={cx(styles.descriptionField, styles.accessTokenList)}>
                        <div className={styles.fieldName}>{t('Tags')}:</div>
                        <div className={cx(styles.fieldValue, styles.accessTokensWrapper)}>
                            { sortByIsArchived(item?.accessSubjectTokens)
                                ?.map(entity => (
                                    <Chip
                                        key        = {`${entity?.code}${entity?.id}`}
                                        variant    = 'outlined'
                                        color      = 'yellow'
                                        t          = {t}
                                        isArchived  = {entity?.isArchived}
                                        size       = 'S'
                                    >
                                        { entity?.name }
                                    </Chip>
                                )
                            )}
                        </div>
                    </div>
                ) : null }
            </div>
        );
    }

    function setRef(ref) {
        if (!forwardRef) return;

        forwardRef.current = ref;
    }

    const accessSettingCN = cx(styles.AccessSetting, {
        topModal          : isTopModal,
        [`${level}Level`] : level
    });

    return (
        <div className={accessSettingCN} ref={setRef}>
            <IconButton
                className = {styles.closeButton}
                iconType = 'cross'
                onClick = {handleCancell}
            />
            <EntityWithSidebar
                contentClassName = {styles.entityWithSidebarContent}
                level            = {level}
                t                = {t}
                sidebar          = {useMemo(
                    () => ({
                        className : styles.sidebarList,
                        items     : [ {
                            id        : 'accessSubjects',
                            name      : 'accessSubjects',
                            className : styles.accessSubjectsSidebarPanel,
                            list      : getSubjectsList(getListWithoutSelected(
                                accessSubjectsList,
                                selectedAccessSubjects
                            )),
                            selected          : selectedAccessSubjects,
                            refreshList       : refreshAccessSubjects,
                            emptyMessage      : t('subjects-page:No subjects to display'),
                            searchLabel       : t('access-page:Find subject'),
                            color             : 'lightViolet',
                            searchRef         : firstInputRef,
                            renderItem        : renderSubject,
                            renderItemDetails : renderSubjectDetails,
                            onAddEntity       : handleAddSubject,
                            search            : searchData.accessSubjects,
                            updateSearch      : handleChangeSearch,
                            useUniqueId       : true,
                            size              : 'S'
                        }, {
                            id   : 'accessReaders',
                            name : 'accessReaders',
                            list : getReadersList(getListWithoutSelected(
                                readersList,
                                selectedReaders
                            )),
                            selected          : selectedReaders,
                            refreshList       : refreshReaders,
                            emptyMessage      : t('access-page:There are no points to display'),
                            searchLabel       : t('access-page:Find space or point'),
                            color             : 'lightGreen',
                            renderItem        : renderReader,
                            renderItemDetails : renderReaderDetails,
                            onAddEntity       : handleAddReader,
                            search            : searchData.accessReaders,
                            updateSearch      : handleChangeSearch,
                            useUniqueId       : true,
                            size              : 'S'
                        }, {
                            id   : 'accessSchedules',
                            name : 'accessSchedules',
                            list : getSchedulesList(getListWithoutSelected(
                                accessSchedulesList,
                                selectedAccessSchedules
                            )),
                            selected          : selectedAccessSchedules,
                            refreshList       : refreshAccessSchedules,
                            emptyMessage      : t('access-page:There are no schedules to display'),
                            searchLabel       : t('access-page:Find schedule'),
                            color             : 'lightOrange',
                            renderItem        : renderSchedule,
                            renderItemDetails : renderScheduleDetails,
                            onAddEntity       : handleAddSchedule,
                            search            : searchData.accessSchedules,
                            updateSearch      : handleChangeSearch,
                            useUniqueId       : true,
                            size              : 'S'
                        } ]
                    }),
                    [
                        searchData,
                        accessSubjectsList, selectedAccessSubjects,
                        readersList, selectedReaders,
                        accessSchedulesList, selectedAccessSchedules
                    ]
                )}
                errors                = {errors}
                controls              = {useMemo(() => ({
                    submit : {
                        title : `${isCreateEntity ? t('Create') : t('Update')  }`
                    }
                }), [])}
                isProcessing          = {isProcessing}
                formRef               = {formRef}
                closeModal            = {useCallback(handleCloseModal, [])}
                onSubmit              = {useCallback(handleSubmit, [
                    selectedReaders, selectedAccessSubjects, selectedAccessSchedules
                ])}
                onInteract            = {useCallback(handleInteract, [])}
                onCancell             = {useCallback(handleCancell, [])}
                initialState          = {useMemo(() => {}, [ ])}
                title               = {isCreateEntity ? t('access-page:Create access') : t('access-page:Edit access')}
                entityConfiguration = {useMemo(
                    () => ({    // eslint-disable-line max-lines-per-function
                        name      : 'createAccessSetting',
                        className : styles.draggableListPanel,
                        fields    : [
                            {
                                name    : 'selectedAccessSubjects',
                                type    : 'draggableList',
                                label   : '',
                                default : '',
                                props   : {
                                    title          : t('access-page:Who?'),
                                    className      : styles.accessSubjectsDraggableList,
                                    color          : 'lightViolet',
                                    value          : selectedAccessSubjects,
                                    emptyListLabel : t('access-page:Drag subjects here to create access'),
                                    renderItem     : (item, isPreview = false) => {
                                        return renderSubject(item, isPreview, true, true);
                                    },
                                    onChange : ({ name, value }) => {   // eslint-disable-line no-shadow
                                        setSelectedAccessSubjects(value);
                                        handleInteract(name);
                                    },
                                    renderItemDetails : renderSubjectDetails,
                                    list              : accessSubjectsList,
                                    withError         : false,
                                    isRequired        : true,
                                    useUniqueId       : true,
                                    searchLabel       : t('access-page:Find subject'),
                                    key               : 'accessSubjectsDraggableList'
                                }
                            }, {
                                name    : 'selectedAccessSubjects2',
                                type    : 'mobileEntityList',
                                label   : t('Spaces'),
                                default : '',
                                props   : {
                                    name              : 'accessSubjects',
                                    className         : styles.mobileAccessSubjectsList,
                                    searchLabel       : t('access-page:Find subject'),
                                    list              : getSubjectsList(accessSubjectsList, true),
                                    refreshList       : refreshAccessSubjects,
                                    color             : 'lightViolet',
                                    value             : selectedAccessSubjects,
                                    renderItem        : renderSubject,
                                    renderItemDetails : renderSubjectDetails,
                                    onAddEntity       : handleAddSubject,
                                    onDeleteEntity    : handleDeleteSubject,
                                    search            : searchData.accessSubjects,
                                    updateSearch      : handleChangeSearch,
                                    emptyMessage      : t('subjects-page:No subjects to display'),
                                    withError         : false,
                                    isRequired        : true,
                                    fillSelectedBg    : true,
                                    key               : 'mobileAccessSubjectsList'
                                }
                            },


                            {
                                name    : 'selectedReaders',
                                type    : 'draggableList',
                                label   : '',
                                default : '',
                                props   : {
                                    title          : t('access-page:Where?'),
                                    className      : styles.readersDraggableList,
                                    color          : 'lightGreen',
                                    value          : selectedReaders,
                                    emptyListLabel : t('access-page:Drag space or access point here to create access'),
                                    renderItem     : (item, isPreview = false) => {
                                        return renderReader(item, isPreview, true);
                                    },
                                    onChange : ({ name, value }) => {   // eslint-disable-line no-shadow
                                        setSelectedReaders(value);
                                        handleInteract(name);
                                    },
                                    renderItemDetails : renderReaderDetails,
                                    list              : readersList,
                                    withError         : false,
                                    isRequired        : true,
                                    useUniqueId       : true,
                                    searchLabel       : t('access-page:Find space or point'),
                                    key               : 'readersDraggableList'
                                }
                            }, {
                                name    : 'selectedReaders2',
                                type    : 'mobileEntityList',
                                label   : t('Access points'),
                                default : '',
                                props   : {
                                    name              : 'accessReaders',
                                    className         : styles.mobileReadersList,
                                    searchLabel       : t('access-page:Find space or point'),
                                    list              : getReadersList(readersList, true),
                                    refreshList       : refreshReaders,
                                    color             : 'lightGreen',
                                    value             : selectedReaders,
                                    renderItem        : renderReader,
                                    renderItemDetails : renderReaderDetails,
                                    onAddEntity       : handleAddReader,
                                    onDeleteEntity    : handleDeleteReader,
                                    search            : searchData.accessReaders,
                                    updateSearch      : handleChangeSearch,
                                    emptyMessage      : t('subjects-page:No subjects to display'),
                                    withError         : false,
                                    isRequired        : true,
                                    useUniqueId       : true,
                                    key               : 'mobileReadersList'
                                }
                            },

                            {
                                name      : 'selectedAccessSchedules',
                                type      : 'draggableList',
                                label     : '',
                                default   : '',
                                className : styles.accessSchedulesDraggableListsWrapper,
                                props     : {
                                    title          : t('access-page:When?'),
                                    className      : styles.accessSchedulesDraggableList,
                                    color          : 'lightOrange',
                                    value          : selectedAccessSchedules,
                                    emptyListLabel : t('access-page:Drag schedule here to create access'),
                                    renderItem     : (item, isPreview = false) => {
                                        return renderSchedule(item, isPreview, true);
                                    },
                                    onChange : ({ name, value }) => {   // eslint-disable-line no-shadow
                                        setSelectedAccessSchedules(value);
                                        handleInteract(name);
                                    },
                                    renderItemDetails : renderScheduleDetails,
                                    list              : accessSchedulesList,
                                    withError         : false,
                                    isRequired        : true,
                                    useUniqueId       : true,
                                    searchLabel       : t('access-page:Find schedule'),
                                    key               : 'accessSchedulesDraggableList'
                                }
                            }, {
                                name    : 'selectedAccessSchedules2',
                                type    : 'mobileEntityList',
                                label   : t('access-page:Schedule'),
                                default : '',
                                props   : {
                                    name              : 'accessSchedules',
                                    className         : styles.mobileAccessSchedulesList,
                                    searchLabel       : t('access-page:Find schedule'),
                                    list              : getSchedulesList(accessSchedulesList, true),
                                    refreshList       : refreshAccessSchedules,
                                    color             : 'lightOrange',
                                    value             : selectedAccessSchedules,
                                    renderItem        : renderSchedule,
                                    renderItemDetails : renderScheduleDetails,
                                    onAddEntity       : handleAddSchedule,
                                    onDeleteEntity    : handleDeleteSchedule,
                                    search            : searchData.accessSchedules,
                                    updateSearch      : handleChangeSearch,
                                    emptyMessage      : t('access-page:There are no schedules to display'),
                                    withError         : false,
                                    isRequired        : true,
                                    key               : 'mobileAccessSchedulesList'
                                }
                            }
                        ]
                    }),
                    [
                        searchData,
                        accessSubjectsList, selectedAccessSubjects,
                        readersList, selectedReaders,
                        accessSchedulesList, selectedAccessSchedules
                    ]
                )}
            />
        </div>
    );
}

AccessSetting.propTypes = {
    entityId   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    entityData : PropTypes.shape({
        accessTokenReaders  : PropTypes.array,
        accessSubjects      : PropTypes.array,
        accessSchedules     : PropTypes.array,
        accessReadersGroups : PropTypes.array
    }),
    closeModal : PropTypes.func.isRequired,
    name       : PropTypes.string.isRequired,
    isTopModal : PropTypes.bool.isRequired,


    accessSubjectsList : PropTypes.arrayOf(PropTypes.shape({    // eslint-disable-line
        id       : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
        fullName : PropTypes.string.isRequired
    })).isRequired,
    fetchAccessSubjects : PropTypes.func.isRequired,


    accessTokenReadersList : PropTypes.arrayOf(PropTypes.shape({
        id   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
        code : PropTypes.string.isRequired
    })).isRequired,
    fetchAccessTokenReaders : PropTypes.func.isRequired,


    accessSchedulesList : PropTypes.arrayOf(PropTypes.shape({    // eslint-disable-line
        id   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
        name : PropTypes.string.isRequired
    })).isRequired,
    fetchAccessSchedules : PropTypes.func.isRequired,


    accessReadersGroupsList : PropTypes.arrayOf(PropTypes.shape({
        id   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
        name : PropTypes.string.isRequired
    })).isRequired,
    fetchAccessReadersGroups : PropTypes.func.isRequired,

    isCreateEntity      : PropTypes.bool,
    createAccessSetting : PropTypes.func.isRequired,
    updateAccessSetting : PropTypes.func.isRequired,
    forwardRef          : PropTypes.shape({  current: PropTypes.shape({ }) }),
    onClose             : PropTypes.func.isRequired,
    level               : PropTypes.oneOf([ 'first', 'second' ]),
    timezone            : PropTypes.string,
    t                   : PropTypes.func.isRequired
};

AccessSetting.defaultProps = {
    entityId       : '',
    entityData     : {},
    isCreateEntity : false,
    level          : 'first',
    forwardRef     : void 0,
    timezone       : void 0
};

export default AccessSetting;
