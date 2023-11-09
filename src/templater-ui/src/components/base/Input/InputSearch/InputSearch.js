import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
    memo
}                          from 'react';
import PropTypes           from 'prop-types';
import { v4 as uuidv4 }    from 'uuid';
import InputAdornment      from '@material-ui/core/InputAdornment';
import SvgIcon             from '../../SvgIcon';
import IconButton          from '../../IconButton';
import Input               from '../Input';

import styles              from './InputSearch.less';

let timeout = null;

function InputSearch(props, ref) {
    const { onChange, name, label, autoFocus, ...rest } = props;
    const [ hackKey, setHackKey ] = useState({
        key    : uuidv4(),
        action : ''
    });
    const [ state, setState ] = useState({
        value         : props.value,
        typing        : false,
        typingTimeout : 0
    });
    const inputRef = useRef({});

    useEffect(() => {
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        setState({ ...state, value: props.value });
    }, [ props.value ]);

    useImperativeHandle(ref, () => ({
        node  : inputRef.current,
        focus : () => {
            setHackKey({
                key    : uuidv4(),
                action : 'set-focus'
            });

            // Doesn`t work: inputRef.current.focus();
        },
        blur : () => {
            inputRef.current.blur();
        }
    }), []);

    function handleClearInput() {
        if (timeout) clearTimeout(timeout);

        setState({ value: '' });
        onChange({ name, value: '' });
    }

    function handleChangeInput({ value }) {
        if (timeout) clearTimeout(timeout);

        setState({ value });

        timeout = setTimeout(() => {
            onChange({ name, value });
        }, 500); /* eslint-disable-line no-magic-numbers */
    }

    const { value } = state;

    return (
        <Input
            key                = {hackKey.key}
            {...rest}
            name               = {name}
            value              = {value}
            onChange           = {handleChangeInput}
            label              = {label}
            className          = {styles.Input}
            ref                = {node => inputRef.current = node}
            autoFocus          = {hackKey.action === 'set-focus' || autoFocus}
            renderEndAdornment = {() => (/* eslint-disable-line react/jsx-no-bind */
                <InputAdornment position='end' classes={{ root: styles.inputAdornment }}>
                    { value === ''
                        ? (
                            <SvgIcon
                                type      = 'search'
                                color     = ''
                                className = {styles.searchIcon}
                            />
                        ) : (
                            <IconButton
                                className = {styles.clearIconButton}
                                onClick   = {handleClearInput}
                                iconType  = 'cross'
                            />
                        )
                    }
                </InputAdornment>
            )}
        />
    );
}

InputSearch.propTypes = {
    name      : PropTypes.string,
    label     : PropTypes.string,
    onChange  : PropTypes.func.isRequired,
    value     : PropTypes.string,
    autoFocus : PropTypes.bool
};

InputSearch.defaultProps = {
    name      : '',
    label     : '',
    value     : '',
    autoFocus : false
};

export default memo(forwardRef(InputSearch));
