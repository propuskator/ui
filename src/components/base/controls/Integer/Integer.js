import React     from 'react';

import Base      from '../Base';

function IntegerControl(props) {
    return (
        <Base
            {...props}
            type       = 'integer'
            inputProps = {{
                placeholder : ''
            }}
        />
    );
}

export default IntegerControl;
