import React            from 'react';

import { useMedia }     from 'templater-ui/src/utils/mediaQuery';

import DraggableList    from './DraggableList';


export default React.memo((props) => {
    const isMobile = useMedia(
        // Media queries
        [ '(max-width: 612px)', '(min-width: 613px)', 'only screen and (hover: none) and (orientation: landscape) and (max-width: 900px)' ],
        // values by media index
        [ true, false, false ],
        // Default
        false
    );

    if (isMobile) return null;

    return <DraggableList {...props} />;
});
