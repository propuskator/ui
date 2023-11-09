import React     from 'react';

import Base      from '../Base';

function StringControl(props) {
    return (
        <Base
            {...props}
            type     = 'string'
        />
    );
}

export default StringControl;
