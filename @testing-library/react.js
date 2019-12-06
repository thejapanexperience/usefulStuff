import React from 'react';
import { render } from '@testing-library/react';

//theme
import { ThemeProvider } from '@phg/stilo-toolbox/components/ThemeProvider';
import defaultTheme from '@phg/stilo-toolbox/v2/theme';

type PropsType = {
    children: React.Node
};

const AllTheProviders = ({ children }: PropsType) => {
    return (
        <ThemeProvider theme={defaultTheme}>
            {children}
        </ThemeProvider>
    );
};

const renderThemed = (ui, options) =>
    render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// add new render methods
export { renderThemed };
