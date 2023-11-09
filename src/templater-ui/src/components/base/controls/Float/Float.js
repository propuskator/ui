import React     from 'react';

import Base      from '../Base';

function FloatControl(props) {
    return (
        <Base
            {...props}
            type       = 'float'
            inputProps = {{
                placeholder : ''
            }}
        />
    );
}

export default FloatControl;
