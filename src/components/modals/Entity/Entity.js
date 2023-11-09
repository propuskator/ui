import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Typography               from 'templater-ui/src/components/base/Typography';
import IconButton               from 'templater-ui/src/components/base/IconButton';

import CustomForm               from 'Shared/CustomForm';

import styles                   from './Entity.less';

const cx = classnames.bind(styles);

class Entity extends PureComponent {
    static propTypes = {
        className     : PropTypes.string,
        onSubmit      : PropTypes.func.isRequired,
        onCancell     : PropTypes.func,
        initialState  : PropTypes.object.isRequired,
        name          : PropTypes.string.isRequired,
        title         : PropTypes.string.isRequired,
        isTopModal    : PropTypes.bool.isRequired,
        formatter     : PropTypes.func,
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
            }).isRequired
        }).isRequired,
        level : PropTypes.oneOf([ 'first', 'second' ])
    };

    static defaultProps = {
        className : '',
        onCancell : void 0,
        formatter : void 0,
        level     : 'first'
    }

    state = {
        isProcessing : false,
        errors       : null
    }

    getProcessErrors = (error) => {
        if (!error) return error;

        return error?.fields || {};
    }

    handleSubmit = async (entity) => {
        if (this.isProcessing) return;
        this.isProcessing = true;
        const { onSubmit } = this.props;

        this.setState({ isProcessing: true });

        try {
            await onSubmit(entity);

            this.setState({
                isProcessing : false,
                errors       : null
            });
        } catch (error) {
            this.handleError(error);
        } finally {
            this.isProcessing = false;
        }
    }

    handleError = error => {
        this.setState({
            isProcessing : false,
            errors       : this.getProcessErrors(error)
        });
    }

    handleCancell = () => {
        const { onCancell, name } = this.props;

        if (onCancell) onCancell(name);
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

        if (value && typeof value === 'string') return value.replace(/\s/g, '');

        return value;
    }

    render() {
        const {
            name, initialState, configuration, isTopModal,
            level, title, className
        } = this.props;
        const { isProcessing, errors } = this.state;
        const entityCN = cx(styles.Entity, {
            topModal          : isTopModal,
            [`${level}Level`] : level
        });
        const customFormCN = cx(styles.customForm, {
            [className] : className
        });

        return (
            <div className={entityCN} key={name}>
                <IconButton
                    className = {styles.closeButton}
                    iconType  = 'cross'
                    onClick   = {this.handleCancell}
                />
                <Typography
                    className = {styles.title}
                    variant   = 'headline3'
                    color     = 'black'
                >
                    {title}
                </Typography>
                <div className={styles.content}>
                    <CustomForm
                        configuration = {configuration}
                        className     = {customFormCN}
                        initialState  = {initialState}
                        isProcessing  = {isProcessing}
                        errors        = {errors}
                        onSubmit      = {this.handleSubmit}
                        onCancell     = {this.handleCancell}
                        onInteract    = {this.handleInteract}
                        formatter     = {this.onFormatFields}
                    />
                </div>
            </div>
        );
    }
}

export default Entity;
