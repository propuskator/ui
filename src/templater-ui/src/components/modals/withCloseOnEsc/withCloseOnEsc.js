import React, {
    useEffect
}                               from 'react';

import globalEscHandler         from './../../../utils/eventHandlers/globalEscHandler.js';

export default function withCloseOnEsc(Component) {
    return function ConnectedComponent(props) {
        const { closeModal, name, isTopModal } = props; // eslint-disable-line react/prop-types

        useEffect(() => {
            function closeModalOnExit() {
                if (isTopModal && closeModal) closeModal(name);
            }

            globalEscHandler.register(closeModalOnExit);

            return () => {
                globalEscHandler.unregister(closeModalOnExit);
            };
        }, []);

        return <Component {...props} />;
    };
}
