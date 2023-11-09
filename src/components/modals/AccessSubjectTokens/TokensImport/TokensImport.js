import React, {
    useCallback, useEffect, useRef,
    useState
} from 'react';
import PropTypes            from 'prop-types';
import classnames           from 'classnames/bind';
import { useDropzone }      from 'react-dropzone';

import Link                 from 'templater-ui/src/components/base/Link';
import Button               from 'templater-ui/src/components/base/Button';
import Typography           from 'templater-ui/src/components/base/Typography';
import IconButton           from 'templater-ui/src/components/base/IconButton/IconButton';
import globalEnterHandler   from 'templater-ui/src/utils/eventHandlers/globalEnterHandler';

import { getFormData }      from 'templater-ui/src/utils/formData';

import SvgIcon              from 'Base/SvgIcon';
import { TOASTS_KEYS }      from 'Constants/toasts';

import stepStyles           from '../Step.less';
import styles               from './TokensImport.less';

const cx = classnames.bind(styles);

// eslint-disable-next-line max-lines-per-function
function TokensImport(props) {
    const { addTokens, onSuccessImport, addToast, maxFileSizeMb, acceptType, convertCsvToJson, t } = props;

    const stateRef = useRef({});

    const [ files, setFiles ] = useState([]);
    const [ isProcessing, setIsProcessing ] = useState(false);

    useEffect(() => {
        globalEnterHandler.register(handleImportOnEnter);

        return () => globalEnterHandler.unregister(handleImportOnEnter);
    }, []);

    useEffect(() => {
        stateRef.current = {
            files,
            isProcessing
        };
    }, [ files, isProcessing ]);

    const onDrop = useCallback(acceptedFiles => {
        setFiles([ ...files, ...acceptedFiles ]);
    }, [ setFiles ]);

    const {
        open:handleOpenSelectFile, getRootProps,
        getInputProps, isDragActive,
        fileRejections
    } = useDropzone({
        multiple  : false,
        noClick   : true,
        validator : fileValidation,
        onDrop
    });

    function fileValidation(file) {
        if (!file?.path?.endsWith(acceptType)) {
            return {
                code    : 'file-invalid-type',
                message : t('tokens-page:File type must be', { type: acceptType })
            };
            // eslint-disable-next-line no-magic-numbers
        } else if (file?.size > maxFileSizeMb * 1e6) {
            return {
                code    : 'file-too-large',
                message : t('tokens-page:Size of file is larger than megabytes', { max: maxFileSizeMb })
            };
        } else if (file?.size <= 1) {
            return {
                code    : 'file-invalid-size',
                message : t('tokens-page:Not allowed empty files')
            };
        }

        return null;
    }

    async function handleImport() {
        try {
            setIsProcessing(true);
            // eslint-disable-next-line no-shadow
            const { files } = stateRef.current;

            const keys = [ { key: 'file', asKey: 'file' } ];
            const formData = getFormData({ file: files[0] }, keys);

            const parsedData = await convertCsvToJson(formData);

            const isFileHasToken = parsedData?.some(row => row.code);

            if (isFileHasToken) {
                addTokens(parsedData);
                onSuccessImport();
            } else {
                addToast({
                    key     : TOASTS_KEYS.accessSubjectTokens,
                    title   : t('tokens-page:File import error'),
                    message : t('tokens-page:Invalid file content'),
                    type    : 'error'
                });
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsProcessing(false);
        }
    }

    function handleImportOnEnter() {
        // eslint-disable-next-line no-shadow
        const { isProcessing, files } = stateRef.current;

        if (!isProcessing && files.length) handleImport();
    }

    function handleResetAllFiles() {
        setFiles([]);
    }

    const tokensImportCN = cx(stepStyles.Step, styles.TokensImport);

    return (
        <div className={tokensImportCN} >
            <div className={cx(stepStyles.content)}>
                <div
                    {...getRootProps({ className: cx(styles.dropzone, { [styles.drag]: isDragActive }) })}
                >
                    <input
                        {...getInputProps()}
                        className   = {styles.inputUpload}
                        accept      = {acceptType}
                    />

                    <div className={stepStyles.textBlk}>
                        <SvgIcon
                            type  = 'csvFiles'
                            color = {files.length ? 'primary600' : 'default'}
                        />
                        {
                            files.length
                                ? (
                                    <div className={styles.filePreview}>
                                        <IconButton
                                            className = {styles.removeFileIcon}
                                            iconType  = 'close'
                                            onClick   = {handleResetAllFiles}
                                        />
                                        <Typography
                                            className = {styles.fileName}
                                            variant   = 'headline2'
                                            color     = 'greyDark'
                                        >
                                            {files[0]?.name}
                                        </Typography>
                                    </div>
                                )
                                : (
                                    <>
                                        <Typography
                                            className = {stepStyles.description}
                                            variant   = 'headline3'
                                        >
                                            { t('tokens-page:Select csv file')}
                                        </Typography>

                                        <Link
                                            className = {styles.selectFileBtn}
                                            onClick   = {handleOpenSelectFile}
                                            variant   = 'withoutUnderline'
                                            color     = 'primary'
                                        >
                                            {t('Select')}
                                        </Link>

                                        {
                                            fileRejections.length
                                                ? (
                                                    <Typography
                                                        className = {styles.uploadError}
                                                        variant   = 'body2'
                                                    >
                                                        {fileRejections[0]?.errors[0]?.message}
                                                    </Typography>
                                                )
                                                : null
                                        }
                                    </>
                                )
                        }
                    </div>
                </div>

            </div>
            <div className={stepStyles.controls}>
                <Button
                    className  = {stepStyles.submitBtn}
                    isDisabled = {!files.length}
                    isLoading  = {isProcessing}
                    size       = 'S'
                    color      = 'primary600'
                    onClick    = {handleImport}
                >
                    {t('Import')}
                </Button>
            </div>
        </div>
    );
}

TokensImport.propTypes = {
    maxFileSizeMb    : PropTypes.number,
    acceptType       : PropTypes.string,
    addTokens        : PropTypes.func.isRequired,
    addToast         : PropTypes.func.isRequired,
    onSuccessImport  : PropTypes.func.isRequired,
    convertCsvToJson : PropTypes.func.isRequired,
    t                : PropTypes.func
};

TokensImport.defaultProps = {
    maxFileSizeMb : 5,
    acceptType    : '.csv',
    t             : text => text
};

export default TokensImport;
