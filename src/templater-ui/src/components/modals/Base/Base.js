import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import { leftTrim }             from '../../../utils';
import globalEscHandler         from '../../../utils/eventHandlers/globalEscHandler';
import globalEnterHandler       from '../../../utils/eventHandlers/globalEnterHandler';

import IconButton               from '../../base/IconButton';
import Typography               from '../../base/Typography';

import { default as Form }      from '../../shared/CustomForm';
import styles                   from './Base.less';

const cx = classnames.bind(styles);

class Base extends PureComponent {
    static propTypes = {
        className    : PropTypes.string,
        id           : PropTypes.string,
        onSubmit     : PropTypes.func.isRequired,
        onCancel     : PropTypes.func,
        onCloseModal : PropTypes.func,
        initialState : PropTypes.object.isRequired,
        name         : PropTypes.string.isRequired,
        title        : PropTypes.string.isRequired,
        subtitle     : PropTypes.string,
        isTopModal   : PropTypes.bool,
        isProcessing : PropTypes.bool,
        formatter    : PropTypes.func,
        CustomForm   : PropTypes.func,
        forwardRef   : PropTypes.shape({
            current : PropTypes.shape({})
        }),
        configuration : PropTypes.shape({
            name     : PropTypes.string,
            title    : PropTypes.string,
            fields   : PropTypes.array.isRequired,
            controls : PropTypes.shape({
                cancell : PropTypes.shape({
                    title : PropTypes.string.isRequired
                }),
                submit : PropTypes.shape({
                    title : PropTypes.string.isRequired
                }).isRequired
            })
        }).isRequired,
        level   : PropTypes.oneOf([ 'first', 'second' ]),
        classes : PropTypes.shape({})
    };

    static defaultProps = {
        className    : '',
        id           : void 0,
        onCancel     : void 0,
        formatter    : void 0,
        onCloseModal : void 0,
        forwardRef   : void 0,
        CustomForm   : void 0,
        level        : 'first',
        subtitle     : '',
        isTopModal   : true,
        isProcessing : false,
        classes      : {}
    }

    constructor(props) {
        super(props);

        this.state = {
            isProcessing : false,
            errors       : null
        };

        this.formRef = React.createRef({});

        const { forwardRef } = this.props;

        if (forwardRef && 'current' in forwardRef) {
            forwardRef.current = {
                getValue  : () => this.formRef.current.getValue(),
                setErrors : (errors) => {
                    this.setState({
                        ...this.state,
                        errors : { ...this.state.errors, ...(errors || {}) }
                    });
                }
            };
        }
    }

    componentDidMount() {
        globalEnterHandler.register(this.handleEnterPress);
    }

    componentWillUnmount() {
        globalEnterHandler.unregister(this.handleEnterPress);
        globalEscHandler.unregister(this.preventModalClose);
    }

    preventModalClose = () => {
        // pass
    }

    handleEnterPress = () => {
        if (!this.formRef?.current) return;
        const entity = this.formRef.current.getValue();

        this.handleSubmit(entity);
    }

    handleSubmit = async (entity) => {
        if (this.isProcessing) return;
        this.isProcessing = true;
        const { onSubmit } = this.props;

        this.setState({ isProcessing: true });
        globalEscHandler.register(this.preventModalClose);

        try {
            await onSubmit(entity);
            this.setState({
                isProcessing : false,
                errors       : null
            });
        } catch (error) {
            this.handleError(error);
            this.setState({ isProcessing: false });
        } finally {
            this.isProcessing = false;
            globalEscHandler.unregister(this.preventModalClose);
        }
    }

    handleError = errors => {
        this.setState({
            isProcessing : false,
            errors
        });
    }

    handleCloseModal = () => {
        const { onCloseModal, name } = this.props;

        if (onCloseModal) onCloseModal(name);
    }

    handleCancel = () => {
        const { onCancel, name } = this.props;

        if (onCancel) onCancel(name);
    }

    handleInteract = name => this.setState(prevState => ({
        errors : {
            ...prevState.errors,
            [name] : null
        }
    }));

    onFormatFields = ({ name, value }) => {
        const { formatter } = this.props;

        if (formatter) return formatter({ name, value });

        if (value && typeof value === 'string') return leftTrim(value);

        return value;
    }

    render() {
        const {
            id, name, initialState, configuration, isTopModal,
            level, title, subtitle, className, classes, CustomForm,
            ...rest
        } = this.props;
        const { isProcessing, errors } = this.state;
        const baseCN = cx(styles.Base, {
            topModal          : isTopModal,
            [`${level}Level`] : level,
            [className]       : className
        });

        const CustomFormComponent = CustomForm ? CustomForm : Form;
        const customFormCN = cx(styles.customForm);

        return (
            <div className={baseCN} key={name} id={id || name}>
                <IconButton
                    className = {cx(styles.closeButton, classes.closeButton)}
                    iconType  = 'cross'
                    onClick   = {this.handleCloseModal}
                />
                <Typography
                    className = {cx(styles.title, classes.title)}
                    variant   = 'headline3'
                    color     = 'black'
                >
                    {title}
                </Typography>
                { subtitle
                    ? (
                        <Typography
                            className = {cx(styles.subtitle, classes.subTitle)}
                            variant   = 'headline4'
                            color     = 'black'
                        >
                            {subtitle}
                        </Typography>
                    ) : null
                }
                <div className={cx(styles.content, classes.content)}>
                    <CustomFormComponent
                        {...rest}
                        forwardRef    = {this.formRef}
                        configuration = {configuration}
                        className     = {customFormCN}
                        initialState  = {initialState}
                        isProcessing  = {isProcessing || this.props?.isProcessing}
                        errors        = {errors}
                        onSubmit      = {this.handleSubmit}
                        onCancel      = {this.handleCancel}
                        onInteract    = {this.handleInteract}
                        formatter     = {this.onFormatFields}
                        classes       = {classes}
                    />
                </div>
            </div>
        );
    }
}

export default Base;
