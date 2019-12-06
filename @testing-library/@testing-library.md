# Testing Library
[Docs](https://testing-library.com/)

```
import { render, renderThemed, cleanup, fireEvent } from 'app/utils/@testing-library/react';
import { renderConnected } from 'app/utils/@testing-library/react-redux';
```
We have added some custom render methods to the library to allow us to import components with themes and with redux. Import from this folder instead of `import { render } from '@testing-library/react'`.

`renderConnected` was pulled out into its own file as importing `import makeStore from 'app/state/store'` adds too much time to tests that aren't actually using the `renderConnected` method.

# Integration Tests
Carrying out all of the imports for creating the store takes a long time, so having one integration test file will be more efficient without developing a solution for this (see above re: `renderConnected` if someone wants to investigate)

Given this, I recommend having a `__integtationTests` folder that contains the test file and any mocks responses that are needed.

## Mocking API Calls
```
import api from 'app/api';
import { mockCampaign, mockIncidents } from './mockApiResponses';

api.v2CampaignFraudIncidents.actionCreators.fetchAction = jest.fn(() => {
    return {
        type: 'API:V1/FRAUD/INCIDENTS:SUCCESS',
        payload: mockIncidents,
    };
});

api.campaign.actionCreators.fetchAction = jest.fn(() => {
    return {
        type: 'API:CAMPAIGN:SUCCESS',
        payload: mockCampaign,
    };
});
```
Using `jest.fn()` and returning a success action for the API call we are mocking will allow us to insert our mock responses into the appropriate bit of the redux store.

## Full Example
```
import React from 'react';

import { cleanup, fireEvent } from 'app/utils/@testing-library/react';
import { renderConnected } from 'app/utils/@testing-library/react-redux';

import FraudPage from '../';
import { initialState } from '../pageState';

import api from 'app/api';
import { mockCampaign, mockIncidents } from './mockApiResponses';

const makeMocks = ({
    mockIncidents,
    mockCampaign
}) => {
    api.v2CampaignFraudIncidents.actionCreators.fetchAction = jest.fn(() => {
        return {
            type: 'API:V1/FRAUD/INCIDENTS:SUCCESS',
            payload: mockIncidents,
        };
    });

    api.campaign.actionCreators.fetchAction = jest.fn(() => {
        return {
            type: 'API:CAMPAIGN:SUCCESS',
            payload: mockCampaign,
        };
    });
};

beforeEach( () => {
    cleanup();
});

test('Fraud with incidents to display', () => {
    makeMocks({
        mockCampaign,
        mockIncidents
    });

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    const {
        getByText,
        queryByText,
        getAllByTestId
    } = renderConnected(<FraudPage/>, initialState);

    // general stuff
    expect(getByText('Incidents')).toExist;
    expect(getByText('Actions')).toExist;
    expect(getByText('Choose...')).toExist;

    // seeing list items in list
    const listItems = getAllByTestId('fraud_incident');
    expect(listItems.length).toBe(3);
    expect(getByText('Leadsbox')).toExist;
    expect(queryByText('123')).toBeNull;

    // clicking on list items causes specific info aobut fraud incidents to be displayed
    fireEvent.click(listItems[1]);
    expect(getByText('123')).toExist;
    expect(queryByText('1001l1234')).toBeNull;

    fireEvent.click(listItems[2]);
    expect(getByText('1001l1234')).toExist;
    expect(queryByText('123')).toBeNull;

    // selecting option from actions dropdown
    fireEvent.click(getByText('Choose...'));
    expect((getByText('Download click csv'))).toExist;
    fireEvent.click(getByText('Download click csv'));
    expect(window.alert).toHaveBeenCalledWith('onDownloadClickCSV');
});
```