/* eslint-disable  babel/no-unused-expressions */
import React, {
    useMemo,
    useCallback
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import { useHistory }           from 'react-router-dom';

import { LOGIN }                from '../../../../constants/routes';
import CustomForm               from '../../../shared/CustomForm';
import SvgIcon                  from '../../../base/SvgIcon';
import Typography               from '../../../base/Typography';

import styles                   from './StatusForm.less';

const cx = classnames.bind(styles);


function StatusForm(props) {
    const { isProcessing, theme, t } = props;
    const history = useHistory();

    async function handleSubmit() {
        history.push(LOGIN);
    }

    return (
        <CustomForm
            className     = {styles.StatusForm}
            configuration = {useMemo(() => ({
                name   : 'statusForm',
                fields : [
                    {
                        name              : 'customField',
                        type              : 'customField',
                        renderCustomField : () => {
                            return (
                                <div className={cx(styles.iconWrapper, { [theme]: theme })} key='icon'>
                                    <SvgIcon
                                        type      = 'successGreen'
                                        className = {styles.icon}
                                    />
                                </div>
                            );
                        }
                    },
                    {
                        name              : 'customField',
                        type              : 'customField',
                        renderCustomField : () => {
                            return (
                                <Typography
                                    className = {styles.title}
                                    variant   = 'headline3'
                                    key       = 'title'
                                >
                                    {t('Password changed!')}
                                </Typography>
                            );
                        }
                    },
                    {
                        name              : 'customField',
                        type              : 'customField',
                        renderCustomField : () => {
                            return (
                                <Typography
                                    className = {styles.description}
                                    variant   = 'body1'
                                    key       = 'description'
                                >
                                    {t('Your account password has been changed successfully.')}
                                </Typography>
                            );
                        }
                    }
                ],
                controls : {
                    submit : {
                        title : t('Go to Login'),
                        props : {
                            size      : 'L',
                            className : styles.submitButton,
                            color     : theme || 'primaryGreen'
                        }
                    }
                }
            }), [ ])}
            initialState  = {useMemo(() => ({ }), [])}
            isProcessing  = {isProcessing}
            errors        = {useMemo(() => ({ }), [])}
            onSubmit      = {useCallback(handleSubmit, [])}
            onInteract    = {useCallback(() => {}, [])}
        />
    );
}

StatusForm.propTypes = {
    isProcessing : PropTypes.bool,
    theme        : PropTypes.oneOf([ 'orange', 'primaryGreen' ]).isRequired,
    t            : PropTypes.func.isRequired
};

StatusForm.defaultProps = {
    isProcessing : false
};

export default StatusForm;
