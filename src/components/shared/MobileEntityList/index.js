import React            from 'react';

import { useMedia }     from 'templater-ui/src/utils/mediaQuery';

import MobileEntityList from './MobileEntityList';


export default React.memo((props) => {
    const isMobile = useMedia(
        // Media queries
        [ 'only screen and (hover: none) and (max-width: 900px) and (orientation: landscape)', '(max-width: 612px)', '(min-width: 613px)' ],
        // values by media index
        [ true, true, false ],
        // Default
        false
    );

    if (!isMobile) return null;

    return <MobileEntityList {...props} />;
});
