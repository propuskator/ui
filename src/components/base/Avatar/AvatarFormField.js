import React                           from 'react';
import AvatarFormField                 from 'templater-ui/src/components/base/Avatar/AvatarFormField';

function CustomAvatarFormField(props) {
    return (
        <AvatarFormField
            {...props}
            locale = 'ru'
        />
    );
}

export default CustomAvatarFormField;
