import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import CommissionRate from './CommissionRate';

const rate = {
    id: [{ id: 'id', label: 'label', type: 'campaign' }],
    performance_value: 1,
    performance_model: 'cpc',
    cookie_period: 30
};

const props = {
    rate,
    onChangeRate: sinon.spy(),
    onSearchForPublishersAndGroups: sinon.spy(),
    index: 0,
    rates: [rate],
    partnersMemo: { searches: {}, count: 0 },
    partnersSearchString: '',
    publishers: [],
    groups: [],
    partnersMultiSelectIsOpenArray: [],
    togglePartnersMultiSelect: sinon.spy(),
    currency: 'GBP',
    campaignDefaultCookiePeriod: 30
};

describe('Create Commission - CommissionRate ', () => {
    it('renders', () => {
        const wrapper = mount(<CommissionRate {...props} />);

        expect(wrapper.find('#CreateCommissionRate-0')).to.have.lengthOf(1);
        expect(wrapper.text()).to.include('Add partners');
        expect(wrapper.text()).to.include('Performance model');
        expect(wrapper.text()).to.include('Commission');
        expect(wrapper.text()).to.include('Cookie period (');

        expect(wrapper.find('#CreateCommissionRate-0-PartnersAndGroups').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreateCommissionRate-0-PerformanceModel').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreateCommissionRate-0-PerformanceValue').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreateCommissionRate-0-CookiePeriod').hostNodes()).to.have.lengthOf(1);
    });
});
