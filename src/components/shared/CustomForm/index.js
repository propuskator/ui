import { connect }                     from 'react-redux';
import { compose }                     from 'redux';
import { withTranslation }             from 'react-i18next';

import CustomForm                      from 'templater-ui/src/components/shared/CustomForm';

import { addToast }                    from 'Actions/toasts';
import DraggableList                   from 'Shared/DraggableList';
import MobileEntityList                from 'Shared/MobileEntityList';
import ColorPicker                     from 'Base/ColorPicker';
import AvatarFormField                 from 'Base/Avatar/AvatarFormField';

const ConnectedAvatarFormField = connect(null, { addToast })(AvatarFormField);

function mapStateToProps() {
    return {
        fieldsMap : {
            draggableList    : DraggableList,
            mobileEntityList : MobileEntityList,
            colorPicker      : ColorPicker,
            avatar           : ConnectedAvatarFormField
        }
    };
}

export default compose(
    withTranslation(),
    connect(mapStateToProps, null)
)(CustomForm);
