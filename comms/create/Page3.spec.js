import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import Page3 from './Page3';
import CommissionRate from './CommissionRate';

const props = {
    togglePartnersMultiSelect: sinon.spy(),
    partnersMultiSelectIsOpenArray: [false],
    partnersMemo: { searches: {}, count: 0 },
    partnersSearchString: '',

    onChangeRate: sinon.spy(),
    onSearchForPublishersAndGroups: sinon.spy(),
    onAddCommissionRule: sinon.spy(),

    rates: [],
    errors: {},

    publishersList: { publishers: [] },
    groupsList: [],
    currency: 'GBP',
    campaignDefaultCookiePeriod: 30
};

const ratesSinglePlusCampaignRate = [
    {
        id: [{ id: 'id', label: 'label', type: 'group' }],
        performance_value: 1,
        performance_model: 'cpc',
        cookie_period: 30
    },
    {
        id: [],
        performance_value: 2,
        performance_model: 'cpc',
        cookie_period: 30
    }
];

const ratesMultiPlusCampaignRate = [
    {
        id: [{ id: 'id', label: 'label', type: 'group' }],
        performance_value: 1,
        performance_model: 'cpc',
        cookie_period: 30
    },
    {
        id: [{ id: 'id2', label: 'label2', type: 'publisher' }],
        performance_value: 2,
        performance_model: 'fixed_cpa',
        cookie_period: 30
    },
    {
        id: [],
        performance_value: 2,
        performance_model: 'cpc',
        cookie_period: 30
    }
];

const publishersList = {
    publishers: [
        {
            publisher: {
                account_name: 'adamcable',
                publisher_id: 300451
            }
        }
    ]
};

const groupsList = [
    {
        commission_group: {
            name: 'Group1',
            commission_group_id: '1'
        }
    }
];

describe('Create Commission - Page3 ', () => {
    it('renders as many CommissionRate components as there are rates', () => {
        const wrapper = mount(<Page3 {...props} rates={ratesMultiPlusCampaignRate} publishersList={publishersList} groupsList={groupsList} />);
        expect(wrapper.find(CommissionRate)).to.have.lengthOf(3);
    });

    it('renders with remove buttons when there are multiple rows', () => {
        const wrapper = mount(<Page3 {...props} rates={ratesMultiPlusCampaignRate} publishersList={publishersList} groupsList={groupsList} />);
        expect(wrapper.text()).to.include('Remove');
    });

    it('renders without remove buttons when there is one row', () => {
        const wrapper = mount(<Page3 {...props} rates={ratesSinglePlusCampaignRate} publishersList={publishersList} groupsList={groupsList} />);
        expect(wrapper.find(CommissionRate)).to.have.lengthOf(2);
        expect(wrapper.text()).not.to.include('Remove');
    });
});
