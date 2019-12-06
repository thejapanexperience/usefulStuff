import React from 'react';
import { renderThemed } from './react';

// redux
import { Provider } from 'react-redux';
import makeStore from 'app/state/store';

const renderConnected = (component, initialState) => {
    const store = makeStore(initialState);

    return renderThemed(
        <Provider store={store}>
            {component}
        </Provider>);
};

// add new render methods
export { renderConnected };
