/* eslint-disable no-magic-numbers,  babel/no-unused-expressions, no-unused-expressions, no-undef, no-shadow */
import React, {
    useState,
    useCallback,
    useMemo,
    useEffect,
    useRef
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import { leftTrim }             from 'templater-ui/src/utils/index';
import Chip                     from 'templater-ui/src/components/base/Chip';
import Link                     from 'templater-ui/src/components/base/Link';
import IconButton               from 'templater-ui/src/components/base/IconButton';
import Input                    from 'templater-ui/src/components/base/Input';

import {
    sortByIsArchived
}                               from 'Utils/sort';

import EntityWithSidebar        from '../EntityWithSidebar';
import styles                   from './Camera.less';

const cx = classnames.bind(styles);

const COUNT_TO_LOAD = 30;

function Camera(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        name, isTopModal, closeModal, onClose, level,
        entityData, isCreateEntity, entityId, createCamera, updateCamera,
        readersList, fetchReaders, t
    } = props;
    const componentRef  = useRef({});
    const formRef       = useRef();
    const firstInputRef = useRef({});
    const entityListRef = useRef({});
    const requestParams = useRef({
        accessTokenReaders : {}
    });

    const [ selectedReaders, setSelectedReaders ] = useState(entityData?.accessTokenReaders || []);
    const [ searchData, setSearchData ]           = useState({
        accessTokenReaders : ''
    });
    const [ isUrlEditing, setIsUrlEditing ] = useState(false);

    function refreshReaders(params = requestParams?.current?.accessTokenReaders) {
        const { limit = COUNT_TO_LOAD, offset = 0 } = params;

        requestParams.current = {
            ...requestParams.current,
            accessTokenReaders : {
                ...params,
                offset      : 0,
                limit       : limit + offset,
                isMergeList : false
            }
        };

        return fetchReaders({
            ...params,
            sortedBy          : 'createdAt',
            isArchived        : false,
            hasAssignedCamera : false
        });
    }

    const [ isProcessing, setIsProcessing ] = useState(false);
    const [ errors, setErrors ] = useState({});

    useEffect(() => {
        return () => onClose(componentRef.current.onCloseParams);
    }, []);

    useEffect(() => {
        setSelectedReaders(prev => [ ...prev ]);
    }, [ readersList ]);

    function handleCloseModal() {
        closeModal(name);
    }

    async function handleSubmit({ accessTokenReaders = [], ...restEntity }) {
        const thisRef = componentRef.current;

        if (thisRef.isProcessing) return;
        thisRef.isProcessing = true;
        setIsProcessing(true);

        try {
            const handler = isCreateEntity ? createCamera : updateCamera;

            restEntity.accessTokenReaderIds = accessTokenReaders.map(item => item.id);

            const data = isCreateEntity
                ? restEntity
                : { id   : entityId,
                    data : {
                    ...restEntity,
                    rtspUrl : isUrlEditing ? restEntity?.rtspUrl : undefined
                } };

            const result = await handler(data);

            // const toastMessage = isCreateEntity
            //     ? t('cameras-page:Camera has been added')
            //     : t('cameras-page:Camera has been updated');

            // addToast({
            //     key     : TOASTS_KEYS.accessSubjectUpdate,
            //     title   : t('Action was completed successfully'),
            //     message : toastMessage,
            //     type    : 'success'
            // });
            handleSuccess(result);
        } catch (error) {
            const fields = { };

            fields.formError = fields.message;

            error?.errors?.forEach(element => {
                if (element.field === 'accessTokenReadersIds') {
                    fields.accessTokenReaders = element.message;
                } else fields[element.field] = element.message;
            });

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

    function handleChangeSearch({ name, value }) {
        setSearchData((prevData) => ({
            ...prevData,
            [name] : value
        }));
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

    function handleCancell() {
        handleCloseModal();
    }

    function formDataFormatter({ name, value }) {   // eslint-disable-line
        if (name === 'accessTokenReaders') setSelectedReaders(() => [ ...(value || []) ]);

        switch (name) {
            case 'name':
            case 'rtspUrl':
                return value ? leftTrim(value) : value;
            default:
                return value;
        }
    }

    function handleAddReader(itemId) {
        const { accessTokenReaders = [] } = formRef?.current?.getValue() || {};
        const selected = readersList.find(entity => entity.id == itemId);    // eslint-disable-line eqeqeq
        const isExist  = accessTokenReaders.find(entity => entity.id == itemId);    // eslint-disable-line eqeqeq

        const valueToSet = isExist
            ? accessTokenReaders
            : [ ...accessTokenReaders, selected ];

        formRef?.current?.setValue({
            name  : 'accessTokenReaders',
            value : valueToSet
        });
    }

    function handleDeleteSelectedReader(itemId) {
        const { accessTokenReaders = [] } = formRef?.current?.getValue() || {};
        const readerData = accessTokenReaders.find(entity => entity.id === itemId);

        if (!readerData) return;
        const valueToSet = accessTokenReaders.filter(entity => entity.id !== itemId);

        formRef?.current?.setValue({
            name  : 'accessTokenReaders',
            value : valueToSet
        });
    }

    function getAvailableReaders() {
        const availableReaders = readersList || [];
        const selectedOnIniti = entityData?.accessTokenReaders?.filter(token => !token?.isArchived) || [];

        if (selectedOnIniti?.length) {
            selectedOnIniti.forEach(item => {
                const isExist = availableReaders.find(entity => entity?.id === item?.id);

                if (isExist) return;
                const search = searchData?.accessTokenReaders || '';

                if (search) {
                    const isAvailableBySearch = new RegExp(search).test(item?.name || '');  // eslint-disable-line security/detect-non-literal-regexp, max-len

                    if (isAvailableBySearch) {
                        availableReaders.push(item);
                    }
                } else {
                    availableReaders.push(item);
                }
            });
        }

        return availableReaders?.filter(token =>
            !(selectedReaders || [])?.find(item => item?.id === token.id)) || []; // eslint-disable-line eqeqeq
    }

    function renderReader(item) {
        return (
            <div className={styles.reader} key={item.id}>
                <Chip className={styles.chip} t={t}>{item.name}</Chip>
            </div>
        );
    }

    function renderDraggableReader(item, isPreview) {
        const itemtoRender = isPreview
            ? readersList?.find(entity => entity.id == item)  // eslint-disable-line eqeqeq
            : item;

        if (!itemtoRender) return null;

        const chipCN = cx(styles.chip, { preview: isPreview });

        return (
            <Chip
                key        = {itemtoRender.id}
                className  = {chipCN}
                onDelete   = {() => handleDeleteSelectedReader(itemtoRender.id)}  // eslint-disable-line react/jsx-no-bind, max-len
                isArchived = {itemtoRender?.isArchived}
                disabled   = {componentRef.current.isProcessing}
                t          = {t}
            >
                {itemtoRender.name}
            </Chip>
        );
    }

    // eslint-disable-next-line react/prop-types
    function renderEditableField({ title, label, name, onChange, value, errorText }) {
        function handleEditClick() {
            setIsUrlEditing(!isUrlEditing);
        }

        return (
            <div className={styles.editableField}>
                {
                    isUrlEditing
                        ? (
                            <Input
                                label        = {label}
                                value        = {value}
                                name         = {name}
                                errorMessage = {errorText}
                                onChange     = {onChange}
                        />)
                        : (<div className={styles.fieldWrapper}>
                            <Link
                                className = {styles.editableFieldText}
                                color     = 'grey'
                                variant   = 'withoutUnderline'
                                onClick   = {handleEditClick}
                            >
                                {title}
                            </Link>
                            <IconButton
                                className = {styles.editableFieldIcon}
                                iconType  = 'edit'
                                onClick   = {handleEditClick}
                                disableFocusRipple
                            />
                        </div>)
                }
            </div>
        );
    }

    const cameraCN = cx(styles.Camera, {
        topModal          : isTopModal,
        [`${level}Level`] : level
    });
    const availableReaders = getAvailableReaders();

    return (
        <div className={cameraCN} key={name}>
            <IconButton
                className = {styles.closeButton}
                iconType  = 'cross'
                onClick   = {handleCancell}
            />
            <EntityWithSidebar
                level   = {level}
                t       = {t}
                sidebar = {useMemo(() => ({
                    className : styles.sidebar,
                    items     : [ {
                        id           : t('Tags'),
                        name         : 'accessTokenReaders',
                        title        : t('Tags'),
                        list         : availableReaders,
                        refreshList  : refreshReaders,
                        forwardRef   : entityListRef,
                        countToLoad  : COUNT_TO_LOAD,
                        color        : 'lightViolet',
                        expanded     : false,
                        emptyMessage : t('readers-page:No access points to display'),
                        search       : searchData.accessTokenReaders,
                        updateSearch : handleChangeSearch,
                        searchLabel  : t('cameras-page:Find access point'),
                        onAddEntity  : handleAddReader,
                        renderItem   : renderReader
                    } ]
                }), [
                    searchData,
                    availableReaders,
                    selectedReaders
                ])}
                errors                = {errors}
                controls              = {useMemo(() => ({
                    submit : {
                        title : `${isCreateEntity ? t('Add') : t('Update')}`
                    }
                }), [])}
                isProcessing = {isProcessing}
                formRef      = {formRef}
                closeModal   = {useCallback(handleCloseModal, [])}
                formatter    = {useCallback(formDataFormatter, [])}
                onSubmit     = {useCallback(handleSubmit, [ isUrlEditing ])}
                onInteract   = {useCallback(handleInteract, [])}
                onCancell    = {useCallback(handleCancell, [])}
                initialState = {useMemo(() =>  ({
                    rtspUrl            : '',
                    name               : !isCreateEntity ? entityData?.name || '' : '',
                    accessTokenReaders : !isCreateEntity
                        ? sortByIsArchived(entityData?.accessTokenReaders)
                        : []
                }), [ ])}
                title               = {isCreateEntity ? t('cameras-page:Add camera') : t('cameras-page:Edit camera')}
                entityConfiguration = {useMemo(() => ({
                    name   : 'accessSubject',
                    fields : [
                        {
                            name    : 'name',
                            type    : 'string',
                            label   : t('Name'),
                            default : '',
                            props   : {
                                autoFocus : true,
                                ref       : firstInputRef
                            }
                        },
                        {
                            name              : 'rtspUrl',
                            type              : isCreateEntity ? 'string' : 'customField',
                            default           : '',
                            renderCustomField : !isCreateEntity ? renderEditableField : void 0,
                            props             : {
                                title : t('cameras-page:Edit stream url'),
                                label : t('cameras-page:Stream url')
                            }
                        },
                        {
                            name      : 'accessTokenReaders',
                            type      : 'mobileEntityList',
                            label     : t('Readers'),
                            className : styles.mobileList,
                            default   : '',
                            props     : {
                                searchLabel : t('cameras-page:Find access point'),
                                color       : 'lightViolet',
                                list        : readersList?.map((item) => ({
                                    ...item,
                                    id   : item.id,
                                    name : item.name
                                })),
                                refreshList    : refreshReaders,
                                forwardRef     : entityListRef,
                                countToLoad    : COUNT_TO_LOAD,
                                name           : 'accessTokenReaders',
                                search         : searchData.accessTokenReaders,
                                renderItem     : renderReader,
                                updateSearch   : handleChangeSearch,
                                expanded       : false,
                                onAddEntity    : handleAddReader,
                                onDeleteEntity : handleDeleteSelectedReader,
                                emptyMessage   : t('readers-page:No access points to display'),
                                key            : 'mobilAaccessTokenReaders'
                            }
                        },
                        {
                            name      : 'accessTokenReaders',
                            type      : 'draggableList',
                            label     : '',
                            default   : '',
                            className : styles.draggableListWrapper,
                            props     : {
                                className      : styles.draggableList,
                                size           : 'S',
                                color          : 'lightViolet',
                                list           : readersList,
                                emptyListLabel : t('cameras-page:Drag access points here to add camera'),
                                renderItem     : renderDraggableReader,
                                key            : 'accessTokenReadersList',
                                searchLabel    : t('cameras-page:Find access point')
                            }
                        }
                    ]
                }), [ searchData, readersList, isUrlEditing ])}
            />
        </div>
    );
}

Camera.propTypes = {
    entityId       : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    isCreateEntity : PropTypes.bool,
    entityData     : PropTypes.shape({
        name               : PropTypes.string,
        rtspUrl            : PropTypes.string,
        accessTokenReaders : PropTypes.array
    }),
    closeModal  : PropTypes.func.isRequired,
    name        : PropTypes.string.isRequired,
    readersList : PropTypes.arrayOf(PropTypes.shape({
        id   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
        name : PropTypes.string.isRequired
    })).isRequired,
    fetchReaders : PropTypes.func.isRequired,
    isTopModal   : PropTypes.bool.isRequired,
    createCamera : PropTypes.func.isRequired,
    updateCamera : PropTypes.func.isRequired,
    onClose      : PropTypes.func.isRequired,
    level        : PropTypes.oneOf([ 'first', 'second' ]),
    t            : PropTypes.func.isRequired
};

Camera.defaultProps = {
    entityId       : '',
    entityData     : {},
    isCreateEntity : false,
    level          : 'first'
};

export default React.memo(Camera);
