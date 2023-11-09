/* eslint-disable-line  */

import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Button                   from './../../base/Button';

import styles                   from './FormControls.less';

const cx = classnames.bind(styles);

class FormControls extends PureComponent {
    static propTypes = {
        controls : PropTypes.shape({
            cancel : PropTypes.shape({
                title : PropTypes.string,
                props : PropTypes.object
            }),
            submit : PropTypes.shape({
                desktopTitle : PropTypes.string,
                title        : PropTypes.string,
                props        : PropTypes.object
            })
        }),
        isSubmitDisabled : PropTypes.bool,
        isFormProcessing : PropTypes.bool,
        className        : PropTypes.string,
        onSubmit         : PropTypes.func,
        onCancel         : PropTypes.func
    }

    static defaultProps = {
        controls         : void 0,
        isSubmitDisabled : false,
        isFormProcessing : false,
        className        : '',
        onSubmit         : void 0,
        onCancel         : null
    }

    render = () => {
        const {
            isFormProcessing,
            isSubmitDisabled,
            controls,
            className,
            onSubmit,
            onCancel
        } = this.props;

        if (!controls) return null;

        const { cancel, submit, renderCustomBlock } = controls;

        const formControlsCN = cx(styles.FormControls, {
            [className]     : className,
            withCustomBlock : renderCustomBlock,
            singleControl   : !(submit?.title && cancel?.title)
        });

        return (
            <div className={formControlsCN}>
                {renderCustomBlock ? renderCustomBlock() : void 0}
                { cancel?.title && (
                    <Button
                        onClick    = {onCancel}
                        isDisabled = {isFormProcessing}
                        className  = {cx(styles.control, 'abort-submit')}
                        variant    = 'outlined'
                        type       = 'button'
                        size       = 'S'
                        color      = 'primary600'
                        {...(cancel?.props || {})}
                    >
                        {cancel.title}
                    </Button>
                ) }
                { submit?.title && (
                    <Button
                        size       = 'S'
                        onClick    = {onSubmit}
                        isDisabled = {isSubmitDisabled}
                        isLoading  = {isFormProcessing}
                        className  = {cx(styles.control, 'abort-submit')}
                        type       = 'submit'
                        color      = 'primary600'
                        forwardRef = {submit?.forwardRef}
                        {...(submit?.props || {})}
                    >
                        <span className={cx({ mobile: submit?.desktopTitle })}>
                            { submit.title }
                        </span>
                        { submit?.desktopTitle
                            ? (
                                <span className={cx({ desktop: submit?.desktopTitle })}>
                                    { submit.desktopTitle }
                                </span>
                            ) : null
                        }
                    </Button>
                ) }
            </div>
        );
    }
}

export default FormControls;
