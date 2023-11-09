/* eslint-disable  no-throw-literal */
import React, {
    useCallback,
    useMemo,
    useEffect
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Base                     from '../Base';

import styles                   from './Field.less';

const cx = classnames.bind(styles);

function Field(props) {
    const {
        onClose, name, entityData,
        closeModal, onSuccess, onChange,
        fieldName, title, subtitle,
        customControls, t, tip, classes
    } = props;

    useEffect(() => {
        return () => onClose && onClose();
    }, []);

    function handleCloseModal() {
        closeModal(name);
    }

    function formDataFormatter({ name, value }) {   // eslint-disable-line no-shadow
        switch (name) {
            default:
                return value;
        }
    }

    async function handleSubmit(data) {
        try {
            if (onChange) {
                await onChange(data);
            }
            if (onSuccess) onSuccess(data);

            handleCloseModal();
        } catch (error) {
            console.error('Submit edit field error: ', { error });
            if (error?.type === 'validation') throw error?.errors;
        }
    }

    function renderSubtitle() {
        if (!tip) return subtitle;

        return (
            <div className={styles.subtitle}>
                <div>{subtitle}</div>
                <div className={cx(styles.tip, classes?.tip)}>{tip}</div>
            </div>
        );
    }

    return (
        <Base
            name         = 'editField'
            className    = {styles.Field}
            classes      = {useMemo(() => ({
                fieldSet : styles.fieldSet
            }), [])}
            initialState = {useMemo(() => ({
                [fieldName] : entityData?.[fieldName]
            }), [])}
            title         = {title}
            subtitle      = {renderSubtitle()}
            formatter     = {useCallback(formDataFormatter, [])}
            configuration = {useMemo(() => ({
                name   : fieldName,
                fields : [
                    {
                        name      : fieldName,
                        type      : 'editor',
                        label     : title,
                        className : styles.lastFieldWrapper,
                        props     : {
                            autoFocus : true,
                            type      : 'plain_text'
                        }
                    }
                ],
                controls : customControls || {
                    className : styles.controls,
                    submit    : {
                        title : t('Save'),
                        props : {
                            // color : 'actionButton'
                        }
                    }
                }
            }), [])}
            onSubmit     = {useCallback(handleSubmit, [])}
            onCancel     = {useCallback(handleCloseModal, [])}
            onCloseModal = {useCallback(handleCloseModal, [])}
        />
    );
}

Field.propTypes = {
    onClose        : PropTypes.func,
    closeModal     : PropTypes.func,
    onSuccess      : PropTypes.func,
    onChange       : PropTypes.func,
    t              : PropTypes.func.isRequired,
    title          : PropTypes.string.isRequired,
    subtitle       : PropTypes.string.isRequired,
    tip            : PropTypes.string,
    fieldName      : PropTypes.string.isRequired,
    name           : PropTypes.string.isRequired,
    entityData     : PropTypes.shape({}),
    customControls : PropTypes.shape({}),
    classes        : PropTypes.shape({})
};

Field.defaultProps = {
    closeModal     : void 0,
    onSuccess      : void 0,
    onChange       : void 0,
    onClose        : void 0,
    entityData     : void 0,
    customControls : void 0,
    tip            : void 0,
    classes        : void 0
};

export default Field;
