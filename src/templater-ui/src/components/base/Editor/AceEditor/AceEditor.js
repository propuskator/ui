import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import AceEditor                from 'react-ace';
import brace                    from 'brace';   // eslint-disable-line

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

import styles                   from './AceEditor.less';

class CustomAceEditor extends PureComponent {
    static propTypes = {
        mode         : PropTypes.string,
        initialValue : PropTypes.string,
        options      : PropTypes.object,
        onChange     : PropTypes.func.isRequired,
        onValidate   : PropTypes.func.isRequired,
        onFocus      : PropTypes.func,
        onBlur       : PropTypes.func,
        autoFocus    : PropTypes.bool,
        readOnly     : PropTypes.bool
    }

    static defaultProps = {
        mode         : 'plain_text',
        initialValue : void 0,
        options      : void 0,
        onFocus      : void 0,
        onBlur       : void 0,
        autoFocus    : false,
        readOnly     : false
    }

    state = {
        value : this.props.initialValue
    }

    componentDidMount() {
        this.editorRef.addEventListener('keydown', this.preventParent);
    }

    componentWillUnmount() {
        this.editorRef.removeEventListener('keydown', this.preventParent);

        if (this.timeout) clearTimeout(this.timeout);
    }

    getEditorTheme = () => {
        return 'xcode';
        // const { theme: globalTheme } = this.context;

        // if (globalTheme === 'DARK') return 'monokai';
        // if (globalTheme === 'LIGHT') return 'xcode';
    }

    handleChange = (value) => {
        const { onChange } = this.props;

        this.setState({
            value
        });

        onChange(value);
    }

    handleEditorValidate = (value) => {
        const { onValidate } = this.props;
        const isValid = !value.filter(({ type }) => type === 'error').length;

        onValidate(isValid);
    }

    handleEditorLoaded = (editor) => {
        const { autoFocus, readOnly } = this.props;

        if (autoFocus) {
            this.timeout = setTimeout(() => {
                editor?.focus();    // eslint-disable-line  babel/no-unused-expressions
            }, 500);    // eslint-disable-line  no-magic-numbers
        }
        if (readOnly) editor.setReadOnly(true);
    }

    preventParent = (e) => {
        e.stopPropagation();
    }

    render() {
        const { value } = this.state;
        const { mode, initialValue, options, onFocus, onBlur } = this.props;
        const editorTheme = this.getEditorTheme();

        return (
            <div
                className = {styles.AceEditor}
                ref       = {node => this.editorRef = node}
            >
                <AceEditor
                    mode                = {mode}
                    onLoad              = {this.handleEditorLoaded}
                    theme               = {editorTheme}
                    name                = 'editor'
                    defaultValue        = {initialValue}
                    fontSize            = '14px'
                    width               = '100%'
                    height              = '100%'
                    value               = {value}
                    onChange            = {this.handleChange}
                    onValidate          = {this.handleEditorValidate}
                    showPrintMargin     = {false}
                    onFocus             = {onFocus}
                    onBlur              = {onBlur}
                    highlightActiveLine = {false}
                    setOptions          = {options}
                    showGutter
                />
            </div>
        );
    }
}

export default CustomAceEditor;
