/* eslint-disable  babel/no-unused-expressions */
import React, {
    useMemo,
    useCallback,
    useState,
    useRef
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Typography               from 'templater-ui/src/components/base/Typography';

import { TOASTS_KEYS }          from 'Constants/toasts';
import CustomForm               from 'Shared/CustomForm';

import styles                   from './ChangeTimezoneForm.less';

const cx = classnames.bind(styles);


function ChangeTimezoneForm(props) { // eslint-disable-line max-lines-per-function
    const { addToast, updateWorkspaceSettings, timezone, t, languageId } = props;
    const [ isProcessing, setIsProcessing ] = useState(false);
    const [ errors, setErrors ]             = useState({});
    const formRef                           = useRef({});
    const componentRef                      = useRef({});

    function formdataFormatter(data) {
        // pass
        return data.value;
    }

    async function handleSubmit(data) {
        if (componentRef.current.isProcessing) return;
        componentRef.current.isProcessing = true;   // eslint-disable-line more/no-duplicated-chains
        setIsProcessing(true);
        try {
            await updateWorkspaceSettings(data);

            addToast({
                key     : TOASTS_KEYS.acoountSettingsUpdate,
                title   : t('Action was completed successfully'),
                message : t('Timezone has been updated'),
                type    : 'success'
            });
            setErrors({});
        } catch (error) {
            const fields = { };

            error?.errors?.forEach(element => fields[element.field] = element.message); /* eslint-disable-line no-unused-expressions, max-len */

            setErrors(fields);
        } finally {
            setIsProcessing(false);
            componentRef.current.isProcessing = false;   // eslint-disable-line more/no-duplicated-chains, require-atomic-updates, max-len
        }
    }

    function handleInteract(name) {
        setErrors(prevState => ({
            ...prevState.errors,
            [name] : null
        }));
    }
    const changeTimezoneFormCN = cx(styles.ChangeTimezoneForm);

    return (
        <div className={changeTimezoneFormCN}>
            <Typography variant='headline4' className={styles.title}>
                {t('Change timezone')}
            </Typography>

            <CustomForm
                className = {styles.form}
                configuration = {useMemo(() => ({
                    name   : 'changeTimezone',
                    fields : [
                        {
                            name      : 'timezone',
                            type      : 'dropdownTimezone',
                            label     : t('Timezone'),
                            className : styles.timezone,
                            default   : ''
                        }
                    ],
                    controls : {
                        submit : {
                            title : t('Update'),
                            props : {
                                size      : 'L',
                                className : styles.submitButton,
                                color     : 'actionButton'
                            }
                        }
                    }
                }), [ languageId ])}
                initialState  = {useMemo(() => ({
                    timezone
                }), [ ])}
                isProcessing  = {isProcessing}
                errors        = {errors}
                onSubmit      = {useCallback(handleSubmit, [])}
                onInteract    = {useCallback(handleInteract, [])}
                formatter     = {useCallback(formdataFormatter, [])}
                forwardRef    = {formRef}
                alwaysSubmitOnOnter
            />
        </div>
    );
}

ChangeTimezoneForm.propTypes = {
    updateWorkspaceSettings : PropTypes.func.isRequired,
    addToast                : PropTypes.func.isRequired,
    timezone                : PropTypes.string,
    t                       : PropTypes.func.isRequired,
    languageId              : PropTypes.string.isRequired
};

ChangeTimezoneForm.defaultProps = {
    timezone : ''
};

export default React.memo(ChangeTimezoneForm);
