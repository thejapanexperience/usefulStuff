import React from 'react';
import { render } from 'app/utils/@testing-library/react';
import None from './None';

beforeEach( () => {
    console.warn = jest.fn(); // eslint-disable-line no-console
});

test('None renders correctly', () => {
    const {
        getByText,
    } = render(<None/>);

    expect(getByText('There are no incident details to display ...')).toExist;
});
