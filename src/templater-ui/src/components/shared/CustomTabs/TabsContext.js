import { createContext } from 'react';

const TabsContext = createContext({
    activeTab : void 0,
    onClick   : void 0
});

export default TabsContext;
