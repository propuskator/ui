/* eslint-disable react/prop-types */
import React, {
    useEffect
}                               from 'react';
import { useHistory }           from 'react-router-dom';

import { DASHBOARD }            from '../../constants/routes';


export default function withRedicrect(Component) {
    return function ConnectedComponent(props) {
        const { isRedirect, urlToRedirect, ...restProps } = props;
        const history = useHistory();

        useEffect(() => {
            if (isRedirect) history.replace(urlToRedirect || DASHBOARD);
        }, []);

        return <Component {...restProps} />;
    };
}
