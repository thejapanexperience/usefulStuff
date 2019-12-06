import React from 'react';
import { renderThemed, fireEvent } from 'app/utils/@testing-library/react';
import { PartnerActions } from './partnerActions';

beforeEach( () => {
    console.warn = jest.fn(); // eslint-disable-line no-console
});

test('PartnerActions renders correctly and opens on click to display options', () => {
    const props = {
        actionOptions: [
            { name: 'Action Option One', value: 1, disabled: false },
            { name: 'Action Option Two', value: 2, disabled: false },
            { name: 'Action Option Three', value: 3, disabled: true },
        ]
    };

    const {
        getByText,
        queryByText
    } = renderThemed(<PartnerActions {...props} />);

    expect(getByText('Actions')).toExist;
    expect(getByText('Choose...')).toExist;

    fireEvent.click(getByText('Choose...'));
    expect((getByText('Action Option One'))).toExist;
    expect((getByText('Action Option Two'))).toExist;
    expect((queryByText('Action Option Three'))).toBeNull;
});
