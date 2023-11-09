/* eslint-disable no-magic-numbers, babel/no-unused-expressions, max-lines-per-function */

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
import SwitchFormField          from 'templater-ui/src/components/base/Switch/SwitchFormField/SwitchFormField.js';

import {
    sortByIsArchived
}                               from 'Utils/sort';

import EntityWithSidebar        from '../EntityWithSidebar';
import SecondLevelModal         from '../SecondLevelModal';
import { TOASTS_KEYS }          from './../../../constants/toasts';

import styles                   from './AccessSubject.less';

const cx = classnames.bind(styles);

const COUNT_TO_LOAD = 30;

function AccessSubject(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        name, isTopModal, closeModal, onClose, level,
        entityData, isCreateEntity, entityId, createAccessSubject, updateAccessSubject,
        accessSubjectTokensList, fetchAccessSubjectTokens, addToast, isCreatingByRequest,
        subjectDataFromRequest, t
    } = props;
    const componentRef  = useRef({});
    const formRef       = useRef();
    const firstInputRef = useRef({});
    const entityListRef = useRef({});
    const requestParams = useRef({
        accessSubjectTokens : {}
    });

    const [ modalData, setModalData ]                         = useState(null);
    const [ selectedSubjectTokens, setSelectedSubjectTokens ] = useState(entityData?.accessSubjectTokens || []);
    const [ searchData, setSearchData ]                       = useState({
        accessSubjectTokens : ''
    });

    function refreshAccessSubjectTokens(params = requestParams?.current?.accessSubjectTokens) {
        const { limit = COUNT_TO_LOAD, offset = 0 } = params;

        requestParams.current = {
            ...requestParams.current,
            accessSubjectTokens : {
                ...params,
                offset      : 0,
                limit       : limit + offset,
                isMergeList : false
            }
        };

        return fetchAccessSubjectTokens({
            ...params,
            sortedBy        : 'createdAt',
            accessSubjectId : 'null',
            isArchived      : false
        });
    }

    const [ isProcessing, setIsProcessing ] = useState(false);
    const [ errors, setErrors ] = useState({});

    useEffect(() => {
        return () => onClose(componentRef.current.onCloseParams);
    }, []);

    useEffect(() => {
        setSelectedSubjectTokens([ ...selectedSubjectTokens ]);
    }, [ accessSubjectTokensList ]);

    function handleCloseModal() {
        closeModal(name);
    }

    async function handleSubmit({ accessSubjectTokens = [], avatarImg, ...restEntity }) {
        const thisRef = componentRef.current;

        if (!restEntity?.accessSubjectTokenIds) restEntity.accessSubjectTokenIds = [];

        if (!restEntity.email) restEntity.email = '';

        if (thisRef.isProcessing) return;
        thisRef.isProcessing = true;
        setIsProcessing(true);

        try {
            const handler = isCreateEntity ? createAccessSubject : updateAccessSubject;
            const data = isCreateEntity ? restEntity : { id: entityId, ...restEntity };

            data.accessSubjectTokenIds = accessSubjectTokens.map(item => item.id);

            if (isCreateEntity) data.avatarImg = avatarImg;
            else if (entityData.avatar !== avatarImg) {
                data.avatarImg = avatarImg;
            }
            const result = await handler(data, isCreatingByRequest);

            // const toastMessage = isCreateEntity
            //     ? t('subjects-page:Subject has been created')
            //     : t('subjects-page:Subject has been updated');

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
                if (element.field === 'accessSubjectTokenIds') {
                    fields.accessSubjectTokens = element.message;
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
        if (isCreateEntity && !entity?.invitationSentSuccessfully) {
            addToast({
                key     : TOASTS_KEYS.accessSubjectCreate,
                title   : t('Something went wrong'),
                message : t('subjects-page:Invitation hasn\'t been sent'),
                type    : 'error'
            });
        }
    }

    function handleChangeSearch({ name, value }) {  // eslint-disable-line no-shadow
        setSearchData((prevData) => ({
            ...prevData,
            [name] : value
        }));
    }

    function handleError(errors) {  // eslint-disable-line no-shadow
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

    function handleOpenSubjectTokenModal(e) {
        openSecondLevelModal(e, {
            name        : 'accessSubjectToken',
            modalParams : {
                width  : 276,
                height : 219
            },
            props : {
                isCreateEntity : true,
                onSuccess      : (entity) => {
                    if (entityListRef?.current) {
                        entityListRef?.current.changeTotalCount({ type: 'increase' });
                    }

                    accessSubjectTokensList.push(entity);
                    handleAddSubjectToken(entity.id);
                    refreshAccessSubjectTokens();
                },
                onCancell : () => closeSecondLevelModal(),
                onClose   : () => {
                    closeSecondLevelModal();

                    firstInputRef.current.focus();
                }
            }
        });
    }

    function handleCancell() {
        handleCloseModal();
    }
    const [ isInviteToggleVisible, setIsInviteToggleVisible ] = useState(true);
    const [ isInvitationNeeded, setIsInvitationNeeded ] = useState(true);
    const [ isAttachToggleDisabled, setIsAttachToggleDisabled ] = useState(isCreateEntity
        ? false : !entityData?.mobileEnabled);

    function formDataFormatter({ name, value }) {   // eslint-disable-line no-shadow
        if (name === 'accessSubjectTokens') setSelectedSubjectTokens(() => [ ...(value || []) ]);
        else if (name === 'mobileEnabled') {
            setIsInviteToggleVisible(current => !current);
            setIsInvitationNeeded(current => !current);
            setIsAttachToggleDisabled(!value);
            if (!value) handleInteract('email');
            handleMobileEnabledChange(value);
        }

        switch (name) {
            case 'name':
            case 'position':
            case 'email':
                return value ? leftrim(value) : value;
            default:
                return value;
        }
    }

    function leftrim(str) {
        if (!str) return str;

        return str.replace(/^\s+/g, '');
    }

    function closeSecondLevelModal() {
        setModalData(void 0);
    }

    function openSecondLevelModal(e, { name, props, modalParams = {} } = {}) {  // eslint-disable-line no-shadow
        const nodeData = e?.target?.getBoundingClientRect() || null;
        const TOP_OFFSET = 10;

        const modalStyles = nodeData
            ? ({
                top  : nodeData?.top + nodeData?.height + TOP_OFFSET,
                left : nodeData?.left
            }) : null;

        setModalData({
            name,
            props,
            ...modalParams,
            styles : modalStyles
        });
    }

    function handleAddSubjectToken(itemId) {
        const { accessSubjectTokens = [] } = formRef?.current?.getValue() || {};
        const selected = accessSubjectTokensList.find(entity => entity.id == itemId);    // eslint-disable-line eqeqeq
        const isExist  = accessSubjectTokens.find(entity => entity.id == itemId);    // eslint-disable-line eqeqeq

        const valueToSet = isExist
            ? accessSubjectTokens
            : [ ...accessSubjectTokens, selected ];

        formRef?.current?.setValue({   // eslint-disable-line no-unused-expressions, no-undef
            name  : 'accessSubjectTokens',
            value : valueToSet
        });
    }

    function handleDeleteSelectedSubjectToken(itemId) {
        const { accessSubjectTokens = [] } = formRef?.current?.getValue() || {};
        const tokenData = accessSubjectTokens.find(entity => entity.id === itemId);

        if (!tokenData) return;
        const valueToSet = accessSubjectTokens.filter(entity => entity.id !== itemId);

        formRef?.current?.setValue({
            name  : 'accessSubjectTokens',
            value : valueToSet
        });
    }

    function handleMobileEnabledChange(isMobileEnabled) {
        formRef?.current?.setValue({
            name  : 'sendInvitation',
            value : isMobileEnabled
        });
    }

    function handleInvitationToggleChange() {
        setIsInvitationNeeded(current => !current);
        formRef?.current?.setValue({
            name  : 'sendInvitation',
            value : !isInvitationNeeded
        });
    }

    function getAvailableSubjectAccessTokens() {
        const availableTokens = accessSubjectTokensList || [];
        const selectedOnInitiTokens = entityData?.accessSubjectTokens?.filter(token => !token?.isArchived) || [];

        if (selectedOnInitiTokens?.length) {
            selectedOnInitiTokens.forEach(item => {
                const isExist = availableTokens.find(entity => entity?.id === item?.id);

                if (isExist) return;
                const search = searchData?.accessSubjectTokens || '';

                if (search) {
                    const isAvailableBySearch = new RegExp(search).test(item?.name || '');  // eslint-disable-line security/detect-non-literal-regexp, max-len

                    if (isAvailableBySearch) {
                        availableTokens.push(item);
                    }
                } else {
                    availableTokens.push(item);
                }
            });
        }

        return availableTokens?.filter(token =>
            !(selectedSubjectTokens || [])?.find(item => item?.id === token.id)) || []; // eslint-disable-line eqeqeq
    }

    function getInitialState() {
         if (isCreatingByRequest) {
            const { subjectName = '', email = '', phone = '' } = subjectDataFromRequest;

            return {
                name : subjectName,
                email,
                phone
            };
         }
    }

    function renderAccessSubjectToken(item) {
        return (
            <div className={styles.subjectToken} key={item.id}>
                <Chip className={styles.chip} t={t}>{item.name}</Chip>
            </div>
        );
    }

    function renderCustomBlock() {
        return (
            <SwitchFormField
                className = {styles.invitationSwitch}
                name  = {'sendInvitation'}
                label = {t('Invite')}
                value = {isInvitationNeeded}
                isDisabled = {!!isCreatingByRequest}
                onChange = {handleInvitationToggleChange}
                withError = {false}
                classes = {{ body: styles.switch }}
            />
        );
    }

    function renderDraggableAccessToken(item, isPreview) {
        const itemtoRender = isPreview
            ? accessSubjectTokensList?.find(entity => entity.id == item)  // eslint-disable-line eqeqeq
            : item;

        if (!itemtoRender) return null;

        const chipCN = cx(styles.chip, { preview: isPreview });

        return (
            <Chip
                key        = {itemtoRender.id}
                className  = {chipCN}
                onDelete   = {() => handleDeleteSelectedSubjectToken(itemtoRender.id)}  // eslint-disable-line react/jsx-no-bind, max-len
                isArchived = {itemtoRender?.isArchived}
                disabled   = {componentRef.current.isProcessing}
                t          = {t}
            >
                {itemtoRender.name}
            </Chip>
        );
    }

    const accessSubjectCN = cx(styles.AccessSubject, {
        topModal          : isTopModal,
        // withInviteToggle  : isInviteToggleVisible,
        [`${level}Level`] : level
    });
    const availableSubjectTokens = getAvailableSubjectAccessTokens();

    return (
        <div className={accessSubjectCN} key={name}>
            <IconButton
                className = {styles.closeButton}
                iconType  = 'cross'
                onClick   = {handleCancell}
            />
            <EntityWithSidebar
                level   = {level}
                t       = {t}
                sidebar = {useMemo(() => ({
                    className : styles.tagsSidebar,
                    items     : [ {
                        id    : t('Tags'),
                        name  : 'accessSubjectTokens',
                        title : t('Tags'),
                        list  : availableSubjectTokens.map((item) => ({
                            id   : item.id,
                            name : item.name,
                            type : item.type
                        })),
                        selected       : selectedSubjectTokens,
                        refreshList    : refreshAccessSubjectTokens,
                        forwardRef     : entityListRef,
                        countToLoad    : COUNT_TO_LOAD,
                        color          : 'lightViolet',
                        expanded       : false,
                        emptyMessage   : `${t('tokens-page:No tags to display')}. ${t('tokens-page:You can create tag')}`,
                        search         : searchData.accessSubjectTokens,
                        updateSearch   : handleChangeSearch,
                        searchLabel    : t('subjects-page:Find tag'),
                        onCreateEntity : handleOpenSubjectTokenModal,
                        onAddEntity    : handleAddSubjectToken,
                        renderItem     : renderAccessSubjectToken
                    } ]
                }), [
                    searchData,
                    accessSubjectTokensList,
                    availableSubjectTokens, selectedSubjectTokens
                ])}
                errors                = {errors}
                controls              = {useMemo(() => ({
                    renderCustomBlock : isCreateEntity && isInviteToggleVisible ? renderCustomBlock : void 0,
                    submit            : {
                        title : `${isCreateEntity ? t('Create') : t('Update')}`
                    }
                }), [ isInviteToggleVisible, isInvitationNeeded ])}
                isProcessing          = {isProcessing}
                formRef               = {formRef}
                closeModal            = {useCallback(handleCloseModal, [])}
                formatter             = {useCallback(formDataFormatter, [])}
                onSubmit              = {useCallback(handleSubmit, [])}
                onInteract            = {useCallback(handleInteract, [])}
                onCancell             = {useCallback(handleCancell, [])}
                initialState          = {useMemo(() => ({
                    avatarImg           : !isCreateEntity ? entityData?.avatar || ''              : '',
                    name                : !isCreateEntity ? entityData?.name || ''                : getInitialState()?.name || '',
                    position            : !isCreateEntity ? entityData?.position || ''            : '',
                    email               : !isCreateEntity ? entityData?.email || ''               : getInitialState()?.email || '',
                    phone               : !isCreateEntity ? entityData?.phone || ''               : getInitialState()?.phone || '',
                    phoneEnabled        : !isCreateEntity ? entityData?.phoneEnabled || false     : false,
                    mobileEnabled       : !isCreateEntity ? entityData?.mobileEnabled || false    : true,
                    canAttachTokens     : !isCreateEntity ? entityData?.canAttachTokens || false  : true,
                    accessSubjectTokens : !isCreateEntity
                        ? sortByIsArchived(entityData?.accessSubjectTokens)
                        : [],
                    ...(isCreateEntity ? { sendInvitation: true } : {})
                }), [ ])}
                title               = {isCreateEntity ? t('subjects-page:Create subject') : t('subjects-page:Edit subject')}
                entityConfiguration = {useMemo(() => ({
                    name   : 'accessSubject',
                    fields : [
                        {
                            name    : 'avatarImg',
                            type    : 'avatar',
                            label   : '',
                            default : '',
                            props   : {
                                size      : 'L',
                                className : styles.avatarField,
                                key       : 'avatarField'
                            }
                        },
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
                            name    : 'position',
                            type    : 'string',
                            label   : t('subjects-page:Position'),
                            default : '',
                            props   : {}
                        },
                        {
                            name    : 'email',
                            type    : 'string',
                            label   : 'Email',
                            default : '',
                            props   : {}
                        },
                        {
                            name    : 'phone',
                            type    : 'phone',
                            label   : t('subjects-page:Phone'),
                            default : '',
                            props   : {
                                key : 'phoneField'
                            }
                        },
                        {
                            name    : 'phoneEnabled',
                            type    : 'switch',
                            label   : t('subjects-page:Allow opening AP'),
                            default : '',
                            props   : {
                                key     : 'phoneEnabled',
                                classes : {
                                    body : styles.switch
                                }
                            }
                        },
                        {
                            name    : 'mobileEnabled',
                            type    : 'switch',
                            label   : t('subjects-page:Allow mobile app to be used as a tag'),
                            default : '',
                            props   : {
                                key     : 'mobileEnabled',
                                classes : {
                                    body : styles.switch
                                }
                            }
                        },
                        {
                            name    : 'canAttachTokens',
                            type    : 'switch',
                            label   : t('subjects-page:Allow tag management'),
                            default : '',
                            props   : {
                                key        : 'canAttachTokens',
                                isDisabled : isAttachToggleDisabled,
                                classes    : {
                                    body : styles.switch
                                }
                            }
                        },
                        {
                            name      : 'accessSubjectTokens',
                            type      : 'mobileEntityList',
                            label     : t('Tags'),
                            className : styles.mobileList,
                            default   : '',
                            props     : {
                                onCreateEntity : handleOpenSubjectTokenModal,
                                searchLabel    : t('subjects-page:Find tag'),
                                color          : 'lightViolet',
                                list           : accessSubjectTokensList?.map((item) => ({
                                    id   : item.id,
                                    name : item.name,
                                    type : item.type
                                })),
                                refreshList    : refreshAccessSubjectTokens,
                                forwardRef     : entityListRef,
                                countToLoad    : COUNT_TO_LOAD,
                                name           : 'accessSubjectToken',
                                search         : searchData.accessSubjectToken,
                                renderItem     : renderAccessSubjectToken,
                                updateSearch   : handleChangeSearch,
                                expanded       : false,
                                onAddEntity    : handleAddSubjectToken,
                                onDeleteEntity : handleDeleteSelectedSubjectToken,
                                emptyMessage   : `${t('tokens-page:No tags to display')}. ${t('tokens-page:You can create tag')}`,
                                key            : 'mobileSubjectTokensList'
                            }
                        },
                        {
                            name      : 'accessSubjectTokens',
                            type      : 'draggableList',
                            label     : '',
                            default   : '',
                            className : styles.draggableListWrapper,
                            props     : {
                                className      : styles.draggableList,
                                size           : 'S',
                                color          : 'lightViolet',
                                list           : accessSubjectTokensList,
                                emptyListLabel : t('subjects-page:Drag tags here to create subject'),
                                renderItem     : renderDraggableAccessToken,
                                key            : 'draggableSubjectTokensList',
                                searchLabel    : t('subjects-page:Find tag')
                            }
                        }
                    ]
                }), [ searchData, accessSubjectTokensList, isAttachToggleDisabled ])}
            />

            <SecondLevelModal
                modalData  = {modalData}
                closeModal = {closeSecondLevelModal}
            />
        </div>
    );
}

AccessSubject.propTypes = {
    entityId       : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    isCreateEntity : PropTypes.bool,
    entityData     : PropTypes.shape({
        name                  : PropTypes.string,
        code                  : PropTypes.string,
        accessSubjectTokenIds : PropTypes.array
    }),
    closeModal              : PropTypes.func.isRequired,
    name                    : PropTypes.string.isRequired,
    accessSubjectTokensList : PropTypes.arrayOf(PropTypes.shape({
        id   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
        code : PropTypes.string.isRequired,
        type : PropTypes.string
    })).isRequired,
    fetchAccessSubjectTokens : PropTypes.func.isRequired,
    subjectDataFromRequest   : PropTypes.object,
    isCreatingByRequest      : PropTypes.bool,
    isTopModal               : PropTypes.bool.isRequired,
    createAccessSubject      : PropTypes.func.isRequired,
    updateAccessSubject      : PropTypes.func.isRequired,
    onClose                  : PropTypes.func.isRequired,
    level                    : PropTypes.oneOf([ 'first', 'second' ]),
    addToast                 : PropTypes.func.isRequired,
    t                        : PropTypes.func.isRequired
};

AccessSubject.defaultProps = {
    entityId               : '',
    entityData             : {},
    isCreateEntity         : false,
    level                  : 'first',
    subjectDataFromRequest : void 0,
    isCreatingByRequest    : false
};

export default React.memo(AccessSubject);
