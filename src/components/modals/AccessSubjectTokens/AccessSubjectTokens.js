import React, {
    useCallback,
    useEffect,
    useRef,
    useState
}                           from 'react';
import PropTypes            from 'prop-types';
import classnames           from 'classnames/bind';

import globalEnterHandler   from 'templater-ui/src/utils/eventHandlers/globalEnterHandler';
import IconButton           from 'templater-ui/src/components/base/IconButton/IconButton';
import Typography           from 'templater-ui/src/components/base/Typography';

import TokensReading        from 'Modals/AccessSubjectTokens/TokensReading';
import TokensImport         from 'Modals/AccessSubjectTokens/TokensImport';

import { getMaxDateInList } from 'Actions/notifications';
import { notificationTypes } from 'Constants/notifications';

import styles               from './AccessSubjectTokens.less';

const cx = classnames.bind(styles);

/* eslint-disable react/no-danger */
// eslint-disable-next-line max-lines-per-function
function AccessSubjectTokens(props) {
    const {
        name, level, isTopModal, addToast,  closeModal,
        onSuccessImport, createAccessSubjectTokens, fetchNotificationsList,
        convertCsvToJson, t
    } = props;

    const stateRef = useRef({});
    const fetchTimeout = useRef(null);
    const createStart = useRef(new Date().toISOString());

    const [ errors, setErrors ] = useState({});
    const [ tokens, setTokens ] = useState([]);
    const [ activeStep, setActiveStep ] = useState('read');
    const [ isProcessing, setIsProcessing ] = useState(false);

    useEffect(() => {
        fetchTokenNotifications();

        globalEnterHandler.register(handleSubmitOnEnter);

        return () => {
            clearTimeout(fetchTimeout.current);
            globalEnterHandler.unregister(handleSubmitOnEnter);
        };
    }, []);

    useEffect(() => {
        stateRef.current = {
            activeStep,
            tokens,
            isProcessing
        };
    }, [ tokens, activeStep, isProcessing ]);

    async function fetchTokenNotifications() {
        try {
            const { data:notifications } = await fetchNotificationsList({
                createStart : createStart.current,
                types       : [ notificationTypes.unknownToken ]
            });

            if (notifications.length) {
                const newStartDate = getMaxDateInList(notifications, 'createdAt') || createStart;

                // eslint-disable-next-line require-atomic-updates
                createStart.current = new Date(+new Date(newStartDate) + 1).toISOString();

                const parsedTokens = [];

                // eslint-disable-next-line no-shadow
                notifications.forEach(({ type, data, name }) => {
                    if (type === notificationTypes.unknownToken) {
                        parsedTokens.push({
                            id   : data?.tokenCode,
                            code : data?.tokenCode,
                            name
                        });
                    }
                });

                handleAddTokens(parsedTokens);
            }
        } catch (e) {
            console.log(e);
        } finally {
            const twoSeconds = 2e3;

            fetchTimeout.current = setTimeout(fetchTokenNotifications, twoSeconds);
        }
    }

    const changeActiveStep = useCallback(step => () => setActiveStep(step), [ setActiveStep ]);

    const resetErrorById = useCallback(id => {
        setErrors(prevState => ({
            ...prevState,
            [id] : null
        }));
    }, [ setErrors ]);

    const handleRemoveTokenById = useCallback(id => {
        const filtered = tokens?.filter(token => token?.id !== id);

        setTokens(filtered);
        resetErrorById(id);
    }, [ tokens, setTokens, resetErrorById ]);

    const handleUpdateToken = useCallback((id, token) => {
        const tokensCopy = [ ...tokens ];
        const foundIndex = tokensCopy.findIndex(_token => _token.id === id);

        tokensCopy[foundIndex] = { ...token };
        setTokens(tokensCopy);
    }, [ tokens, setTokens ]);

    const handleAddTokens = useCallback(_tokens => {
        setTokens(prevTokens => {
            const tokensMap = new Map();
            const mergedTokens = [ ...prevTokens, ..._tokens ];

            // eslint-disable-next-line no-shadow
            mergedTokens.forEach(({ id, code, name }, index) => {
                const key = code || id;

                if (key && !tokensMap.has(key)) {
                    tokensMap.set(key, {
                        code,
                        id   : key,
                        name : name || `${t('tokens-page:Tag')}${index + 1}`
                    });
                }
            });

            return Array.from(tokensMap).map(([ , value ]) => ({ ...value }));
        });
    }, [ setTokens ]);

    const handleSubmit = useCallback(async () => {
        // eslint-disable-next-line no-shadow
        const { tokens } = stateRef?.current;

        try {
            setIsProcessing(true);

            await createAccessSubjectTokens(tokens);

            setErrors({});
            onSuccessImport({ isSuccess: true });
            handleCloseModal();
        } catch (error) {
            if (error?.type === 'validation') {
                const tokenErrors = {};

                error.errors.forEach(e => {
                    const index = /\d+/gm.exec(e.field)[0];
                    const token = tokens[index];

                    if (token) {
                        const field = /\w+$/.exec(e.field)[0];

                        tokenErrors[token?.id] = {
                            message : e.message,
                            field
                        };
                    }
                });

                setErrors(tokenErrors);
            }
        } finally {
            setIsProcessing(false);
        }
    }, [ setIsProcessing, handleCloseModal, stateRef ]);

    function handleSubmitOnEnter() {
        // eslint-disable-next-line no-shadow
        const { tokens, activeStep, isProcessing } = stateRef?.current;

        if (activeStep === 'read' && !isProcessing && tokens?.length) handleSubmit();
    }

    function handleCloseModal() {
        closeModal(name);
    }

    const notificationSettingsCN = cx(styles.AccessSubjectTokens, {
        [`${level}Level`] : level,
        topModal          : isTopModal
    });

    const isReadingStep = activeStep === 'read';

    return (
        <div className={notificationSettingsCN}>
            {
                !isReadingStep
                    ? (
                        <IconButton
                            className = {styles.backBtn}
                            iconType  = 'sortArrow'
                            onClick   = {changeActiveStep('read')}
                        />
                    )
                    : null
            }

            <IconButton
                className = {styles.closeButton}
                iconType  = 'cross'
                onClick   = {handleCloseModal}
            />
            <Typography
                className = {styles.title}
                variant   = 'headline3'
                color     = 'black'
            >
                { isReadingStep
                    ? t('tokens-page:Reading')
                    : t('The import')
                }
            </Typography>

            <div className={styles.content}>
                {
                    isReadingStep
                        ? (
                            <TokensReading
                                tokens              = {tokens}
                                addTokens           = {handleAddTokens}
                                updateToken         = {handleUpdateToken}
                                removeTokenById     = {handleRemoveTokenById}

                                onImportButtonClick = {changeActiveStep('import')}
                                saveTokensList      = {handleSubmit}
                                resetErrorById      = {resetErrorById}
                                addToast            = {addToast}

                                isProcessing        = {isProcessing}
                                errors              = {errors}
                                t                   = {t}
                            />
                        )
                        : <TokensImport
                            addTokens        = {handleAddTokens}
                            onSuccessImport  = {changeActiveStep('read')}
                            convertCsvToJson = {convertCsvToJson}
                            addToast         = {addToast}
                            t                = {t}
                        />
                }
            </div>
        </div>
    );
}

AccessSubjectTokens.propTypes = {
    name                      : PropTypes.string.isRequired,
    isTopModal                : PropTypes.bool,
    level                     : PropTypes.oneOf([ 'first', 'second' ]),
    addToast                  : PropTypes.func.isRequired,
    onSuccessImport           : PropTypes.func.isRequired,
    closeModal                : PropTypes.func.isRequired,
    createAccessSubjectTokens : PropTypes.func.isRequired,
    fetchNotificationsList    : PropTypes.func.isRequired,
    convertCsvToJson          : PropTypes.func.isRequired,
    t                         : PropTypes.func
};

AccessSubjectTokens.defaultProps = {
    isTopModal : false,
    level      : 'first',
    t          : text => text
};

export default AccessSubjectTokens;
