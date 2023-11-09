/* eslint-disable babel/no-unused-expressions */
import React, {
    useCallback,
    useMemo,
    useEffect,
    useRef
}                               from 'react';
import PropTypes                from 'prop-types';

import Entity                   from '../Entity';

// import styles                   from './AccessSubjectToken.less';

function AccessSubjectToken(props) {    // eslint-disable-line max-lines-per-function
    const {
        updateAccessSubjectToken, onClose, createAccessSubjectToken, name,
        entityData, entityId, isCreateEntity, closeModal, level, forwardRef, onSuccess,
        t
    } = props;
    const componentRef  = useRef({});

    useEffect(() => {
        return () => {
            if (onClose) onClose(componentRef.current.onCloseParams);
        };
    }, []);

    function handleCloseModal() {
        closeModal(name);
    }

    function formDataFormatter({ name, value }) {   // eslint-disable-line no-shadow
        switch (name) {
            case 'name':
                return value ? leftrim(value) : value;
            case 'code':
                return value.replace(/\s/g, '');
            default:
                return value;
        }
    }

    function leftrim(str) {
        if (!str) return str;

        return str.replace(/^\s+/g, '');
    }

    async function handleSubmit(data) {
        try {
            const handler = isCreateEntity ? createAccessSubjectToken : updateAccessSubjectToken;
            const payload = isCreateEntity ? data : { id: entityId, data };

            const entity = await handler(payload);

            // const toastMessage = isCreateEntity
            //     ? t('tokens-page:Tag has been created')
            //     : t('tokens-page:Tag has been updated');

            // addToast({
            //     key     : TOASTS_KEYS.accessSubjectTokenUpdate,
            //     title   : t('Action was completed successfully'),
            //     message : toastMessage,
            //     type    : 'success'
            // });

            componentRef.current.onCloseParams = { entity };

            if (onSuccess) onSuccess(entity);

            handleCloseModal();
        } catch (error) {
            const fields = { };

            error?.errors?.forEach(element => fields[element.field] = element.message);

            throw ({ // eslint-disable-line
                fields
            });
        }
    }

    function setRef(ref) {
        if (!forwardRef) return;

        forwardRef.current = ref;
    }

    return (
        <div ref={setRef}>
            <Entity
                name         = 'accessSubjectToken'
                initialState = {{
                    code : entityData?.code || '',
                    name : entityData?.name || ''
                }}
                title         = {isCreateEntity ? t('tokens-page:Create tag') : t('tokens-page:Edit tag')}
                formatter     = {formDataFormatter}
                configuration = {useMemo(() => ({
                    name   : 'accessSubjectToken',
                    fields : [
                        {
                            name    : 'name',
                            type    : 'string',
                            label   : t('tokens-page:Tag name'),
                            default : '',
                            props   : {
                                autoFocus : true
                            }
                        },
                        {
                            name    : 'code',
                            type    : 'string',
                            label   : t('tokens-page:Tag Code'),
                            default : '',
                            props   : {}
                        }
                    ],
                    controls : {
                        submit : {
                            title : isCreateEntity ? t('Create') : t('Update')
                        }
                    }
                }), [])}
                onSubmit     = {useCallback(handleSubmit, [])}
                onCancell    = {useCallback(handleCloseModal, [])}
                level        = {level}
                isTopModal
            />
        </div>
    );
}

AccessSubjectToken.propTypes = {
    entityId : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    entityData : PropTypes.shape({
        code : PropTypes.string,
        type : PropTypes.string
    }),
    onClose                  : PropTypes.func,
    closeModal               : PropTypes.func,
    onSuccess                : PropTypes.func,
    name                     : PropTypes.string.isRequired,
    updateAccessSubjectToken : PropTypes.func.isRequired,
    createAccessSubjectToken : PropTypes.func.isRequired,
    forwardRef               : PropTypes.shape({  current: PropTypes.shape({ }) }),
    isCreateEntity           : PropTypes.bool,
    level                    : PropTypes.oneOf([ 'first', 'second' ]),
    t                        : PropTypes.func.isRequired
};

AccessSubjectToken.defaultProps = {
    entityId       : '',
    entityData     : {},
    isCreateEntity : false,
    level          : 'first',
    closeModal     : void 0,
    onSuccess      : void 0,
    onClose        : void 0,
    forwardRef     : void 0
};

export default AccessSubjectToken;
