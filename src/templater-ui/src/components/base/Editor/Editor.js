import React, {
    useState,
    useEffect
}                               from 'react';
import PropTypes                from 'prop-types';
import classNames               from 'classnames/bind';

import globalEnterHandler       from './../../../utils/eventHandlers/globalEnterHandler';
import ErrorMessage             from './../ErrorMessage';

import AceEditor                from './AceEditor';
import styles                   from './Editor.less';

const cx = classNames.bind(styles);

function Editor(props) {
    const {
        type,
        name,
        isProcessing,
        errorMessage,
        value,
        withError,
        onChange,
        onSetValidation,
        className,
        isHidden,
        ...rest
    } = props;
    const isJsonField = type === 'json';
    const [ isEdit, setIsEdit ] = useState(false);

    useEffect(() => {
        function handleEnterPress() {
            // pass
        }

        if (isEdit) {
            globalEnterHandler.register(handleEnterPress);
        }

        return () => {
            globalEnterHandler.unregister(handleEnterPress);
        };
    }, [ isEdit ]);

    function handleSetValidation(isValid) {
        if (!onSetValidation) return;
        onSetValidation({ name, value: isValid ? '' : 'invalid' });
    }

    function handleChangeEditorField(fieldValue) {
        if (!onChange) return;

        return isJsonField
            ? handleChangeJsonField(fieldValue)
            : onChange({ name, value: fieldValue });
    }

    function handleChangeJsonField(json) {
        try {
            const processValue = json ? JSON.parse(json) : undefined;

            if (onChange) onChange({ name, value: processValue });
        } catch {
            // pass
        }
    }

    function handleStartEdit() {
        setIsEdit(true);
    }

    function handleEndEdit() {
        setIsEdit(false);
    }

    const editorCN = cx(styles.Editor, {
        [className] : className,
        withError   : errorMessage,
        processing  : isProcessing,
        focused     : isEdit
    });

    const processInitialValue = isJsonField
        ? JSON.stringify(value, undefined, 2)    // eslint-disable-line no-magic-numbers
        : value;

    return (
        <div className={editorCN}>
            <div className={styles.editorContent}>
                { !isHidden
                    ? (
                        <AceEditor
                            {...rest}
                            mode         = {type || 'plain_text'}
                            initialValue = {processInitialValue}
                            options      = {{
                                enableBasicAutocompletion : true,
                                enableLiveAutocompletion  : true,
                                enableSnippets            : false,
                                showLineNumbers           : true,
                                tabSize                   : 2
                            }}
                            onChange   = {handleChangeEditorField}
                            onValidate = {handleSetValidation}
                            onFocus    = {handleStartEdit}
                            onBlur     = {handleEndEdit}
                        />
                    ) : null
                }
            </div>
            { withError ? <ErrorMessage error={errorMessage} /> : null }
        </div>
    );
}

Editor.propTypes = {
    errorMessage    : PropTypes.string,
    type            : PropTypes.oneOf([ 'json', 'yaml', 'plain_text' ]),
    withError       : PropTypes.bool,
    isProcessing    : PropTypes.bool,
    name            : PropTypes.string,
    onChange        : PropTypes.func,
    onSetValidation : PropTypes.func,
    value           : PropTypes.any,
    className       : PropTypes.string,
    isHidden        : PropTypes.bool
};

Editor.defaultProps = {
    isHidden        : false,
    errorMessage    : '',
    className       : '',
    type            : 'plain_text',
    onChange        : void 0,
    isProcessing    : false,
    withError       : true,
    onSetValidation : void 0,
    name            : '',
    value           : {}
};

export default React.memo(Editor);
