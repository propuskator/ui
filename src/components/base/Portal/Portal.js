import React, {
    memo,
    useEffect,
    useState
}                       from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';

function Portal({ id, children }) {
    const [ containerToMount, setContainerToMount ] = useState(false);
    const [ childId ] = useState(() => uuidv4().slice(0, 7));   /* eslint-disable-line no-magic-numbers */

    useEffect(() => {
        const container = document.getElementById(id) || document.body;

        setContainerToMount(container);

        return () => {
            // const elementToRemove = document.getElementById(childId);
            // if (!elementToRemove) return;
            // elementToRemove.parentElement.removeChild(elementToRemove);
        };
    }, [ ]);

    if (!containerToMount) return null;

    return createPortal(
        (
            <div id={childId}>
                {children}
            </div>
        ), containerToMount
    );
}

export default memo(Portal);
