import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import Page2 from './Page2';

const props = {
    metaFieldsToggle: 0,

    onChange: sinon.spy(),
    onChangeMetaFields: sinon.spy(),

    meta_fields: [],

    countries: [],
    verticals: [],
    conversionTypes: [],
    customerTypes: [],
    errors: {}
};

describe('Create Commission - Page2 ', () => {
    it('renders', () => {
        const wrapper = mount(
            <Page2
                {...props}
            />
        );

        expect(wrapper.text()).to.include('Apply to');
        expect(wrapper.text()).to.include('All conversions');
        expect(wrapper.text()).to.include('Filter conversions');
        expect(wrapper.find('#CreatePageTwo')).to.have.lengthOf(1);
        expect(wrapper.find('#CreateMetaFields')).to.have.lengthOf(0);
    });

    it('renders MetaFields', () => {
        const wrapper = mount(
            <Page2
                {...props}
                metaFieldsToggle={1}
            />
        );
        expect(wrapper.find('#CreateMetaFields')).to.have.lengthOf(1);
    });
});
