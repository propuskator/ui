import React, {
    useCallback,
    useRef
}                           from 'react';
import PropTypes            from 'prop-types';
import classnames           from 'classnames/bind';
import { v4 as uuidv4 }     from 'uuid';

import Link                 from 'templater-ui/src/components/base/Link';
import Button               from 'templater-ui/src/components/base/Button';
import Typography           from 'templater-ui/src/components/base/Typography';
import BaseControl          from 'templater-ui/src/components/base/controls/Base';
import IconButton           from 'templater-ui/src/components/base/IconButton';

import SvgIcon              from 'Base/SvgIcon';
import { TOASTS_KEYS }      from 'Constants/toasts';

import stepStyles           from '../Step.less';
import styles               from './TokensReading.less';

const cx = classnames.bind(styles);

// eslint-disable-next-line max-lines-per-function
function TokensReading(props) {
    const {
        tokens, errors, onImportButtonClick,
        addTokens, removeTokenById, updateToken,
        saveTokensList, isProcessing,
        resetErrorById, addToast, tokensLimit, t
    } = props;

    const listRef = useRef({});

    function handleImportStep() {
        if (onImportButtonClick) onImportButtonClick();
    }

    function handleCreateToken() {
        addTokens([ {
            id   : uuidv4(),
            code : ''
        } ]);

        const timeout = 250;

        listRef.current.scrollTimeout = setTimeout(() => {
            const elementToScroll = listRef.current?.lastElementChild;

            elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, timeout);
    }

    const handleUpdateToken = useCallback(token => ({ value, name, onSuccess, onError }) => {
        // check if duplicate exists
        if (name === 'code') {
            if (value === token?.code) return onSuccess();
            if (tokens?.some(elem => elem?.code === value)) return onError();
        }

        updateToken(token?.id, { ...token, [name]: value });

        const fieldError = errors[token?.id];

        if (fieldError?.message && fieldError?.field === name) {
            resetErrorById(token?.id);
        }

        onSuccess();
    }, [ updateToken, errors ]);

    const handleRemoveToken = useCallback(id => () => {
        removeTokenById(id);
    }, [ removeTokenById ]);

    const handleSaveTokensList = useCallback(() => {
        if (tokens.length > tokensLimit) {
            addToast({
                key     : TOASTS_KEYS.accessSubjectTokens,
                title   : t('tokens-page:Limit exceeded'),
                message : t('tokens-page:Maximum count of tags is', { max: tokensLimit }),
                type    : 'error'
            });
        } else {
            saveTokensList();
        }
    }, [ tokensLimit, saveTokensList ]);

    function renderTokenList() {
        return tokens.map(token => {
            const errorMessage = errors[token.id]?.message;

            return (
                <div
                    className = {styles.rowWrapper}
                    key       = {token?.code || token?.id}
                >
                    <div className={styles.row} >
                        <div className={styles.cell}>
                            <BaseControl
                                value      = {token.name}
                                name       = 'name'
                                classes    = {{
                                    valueField : styles.nameText,
                                    inputField : styles.inputField,
                                    inputBtn   : styles.inputBtn
                                }}
                                inputClasses = {{
                                    input : styles.input
                                }}
                                maxWidths  = '100%'
                                onChange   = {handleUpdateToken(token)}
                                isSettable
                                isRequired
                            />
                        </div>
                        <div className={styles.cell}>
                            <BaseControl
                                value      = {token.code}
                                name       = 'code'
                                classes    = {{
                                    valueField : styles.nameText,
                                    inputField : styles.inputField,
                                    inputBtn   : styles.inputBtn
                                }}
                                inputClasses = {{
                                    input : styles.input
                                }}
                                maxWidths  = '100%'
                                onChange   = {handleUpdateToken(token)}
                                isSettable
                                isRequired
                            />
                        </div>
                        <div className={styles.cell}>
                            <IconButton
                                iconClassName = {styles.actionIcon}
                                iconType      = 'bin'
                                onClick       = {handleRemoveToken(token?.id)}
                            />
                        </div>
                    </div>
                    {
                        errorMessage
                            ? (
                                <Typography
                                    className = {styles.tokenError}
                                    variant   = 'body2'
                                >
                                    {errorMessage}
                                </Typography>
                            )
                            : null
                    }
                </div>
            );
        });
    }

    const tokensReadingCN = cx(stepStyles.Step, styles.TokensReading);

    return (
        <div className={tokensReadingCN} >
            <div className={stepStyles.content}>
                {
                    !tokens.length
                        ? (
                            <div className={stepStyles.textBlk}>
                                <SvgIcon
                                    type = 'tokenReader'
                                />
                                <Typography
                                    className = {stepStyles.description}
                                    variant   = 'headline3'
                                >
                                    {t('tokens-page:To add a tag, bring it to the reader')}
                                </Typography>
                                <Link
                                    className = {styles.addManually}
                                    onClick   = {handleCreateToken}
                                    variant   = 'withoutUnderline'
                                    color     = 'grey'
                                >
                                    <SvgIcon
                                        className = {styles.addManuallyIcon}
                                        type      = 'add'
                                    />
                                    {t('tokens-page:Add a tag manually')}
                                </Link>
                            </div>
                        )
                        : (
                            <div className={styles.list}>
                                <div className={styles.listHeader}>
                                    <Typography
                                        className = {styles.headerCell}
                                        variant   = 'body2'
                                    >
                                        {t('Name')}
                                    </Typography>

                                    <Typography
                                        className = {styles.headerCell}
                                        variant   = 'body2'
                                    >
                                        {t('tokens-page:Code')}
                                    </Typography>

                                    <div className = {styles.headerCell}>
                                        <IconButton
                                            iconClassName = {styles.actionIcon}
                                            iconType      = 'add'
                                            onClick       = {handleCreateToken}
                                        />
                                    </div>
                                </div>
                                <div
                                    className = {styles.listBody}
                                    ref       = {listRef}
                                >
                                    {renderTokenList()}
                                </div>
                            </div>
                        )
                }
            </div>
            <div className={stepStyles.controls}>
                <Link
                    className = {styles.importBtn}
                    onClick   = {handleImportStep}
                    variant   = 'underline'
                    color     = 'grey'
                >
                    {t('Import')}
                </Link>

                <Button
                    className  = {stepStyles.submitBtn}
                    isDisabled = {!tokens.length}
                    isLoading  = {isProcessing}
                    size       = 'S'
                    color      = 'primary600'
                    onClick    = {handleSaveTokensList}
                >
                    {t('tokens-page:Create list')}
                </Button>
            </div>
        </div>
    );
}

TokensReading.propTypes = {
    tokens              : PropTypes.array,
    errors              : PropTypes.shape({}),
    tokensLimit         : PropTypes.number,
    addTokens           : PropTypes.func.isRequired,
    resetErrorById      : PropTypes.func.isRequired,
    onImportButtonClick : PropTypes.func.isRequired,
    removeTokenById     : PropTypes.func.isRequired,
    updateToken         : PropTypes.func.isRequired,
    saveTokensList      : PropTypes.func.isRequired,
    isProcessing        : PropTypes.func.isRequired,
    addToast            : PropTypes.func.isRequired,
    t                   : PropTypes.func
};

TokensReading.defaultProps = {
    tokens      : [],
    tokensLimit : 500,
    errors      : {},
    t           : text => text
};

export default TokensReading;
