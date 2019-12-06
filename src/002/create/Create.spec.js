import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import Create from './Create';

const props = {
    classes: {
        ZShape: '',
        Context: '',
        Main: '',
        DialoguePages: ''
    },

    pageNumber: '1',
    metaFieldsToggle: 0,
    toggleStartDatePicker: sinon.spy(),
    toggleEndDatePicker: sinon.spy(),
    togglePartnersMultiSelect: sinon.spy(),
    startDatePickerIsOpen: false,
    endDatePickerIsOpen: false,
    partnersMultiSelectIsOpenArray: [false],
    partnersMemo: { searches: {}, count: 0 },
    partnersSearchString: '',

    onChange: sinon.spy(),
    onChangeMetaFields: sinon.spy(),
    onChangeRate: sinon.spy(),
    onSave: sinon.spy(),
    onContinue: sinon.spy(),
    onGoBack: sinon.spy(),
    onCancel: sinon.spy(),
    onSearchForPublishersAndGroups: sinon.spy(),
    onAddCommissionRule: sinon.spy(),
    onRemoveCommissionRule: sinon.spy(),
    onSetEditData: sinon.spy(),

    campaign: {
        reporting_timezone: 'Etc/GMT-10'
    },

    description: '',
    start_date: '',
    end_date: '',
    meta_fields: [],
    rates: [{
        'id': [],
        'performance_value': '',
        'performance_model': 'fixed_cpa',
        'cookie_period': ''
    }],

    errors: {
        description: 'description error',
        start_date: 'start_date error',
        end_date: 'end_date error',
        'rates[group-5]': 'rate[0] error'
    },

    countries: [],
    verticals: [],
    campaignDefaultCurrency: 'GBP',
    campaignDefaultCookiePeriod: 30,
    campaignId: '1',
    conversionTypes: [],
    publishersList: { publishers: [] },
    groupsList: []
};

describe('Create Commission - Create ', () => {
    it('renders page one by default', () => {
        const wrapper = mount(<Create {...props} />);
        expect(wrapper.text()).to.include('Create commission');
        expect(wrapper.find('#CreateCommission').hostNodes()).to.have.lengthOf(1);

        expect(wrapper.find('#CreatePageOne').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreatePageTwo').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#CreatePageThree').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#CreateNextStep').hostNodes()).to.have.lengthOf(1);
        expect(
            wrapper
                .find('#CreateNextStepButton')
                .hostNodes()
                .find('[disabled=true]')
        ).to.have.lengthOf(1);
        expect(wrapper.text()).to.include('Continue');
        expect(wrapper.find('#CreatePreviousStep').hostNodes()).to.have.lengthOf(0);

        // errors
        expect(wrapper.text()).to.include('description error');
        expect(wrapper.text()).to.include('start_date error');
        expect(wrapper.text()).to.include('end_date error');
    });

    it('Create renders page one with the continue button enabled', () => {
        const wrapper = mount(<Create {...props} description={'description'} start_date={new Date()} />);
        expect(
            wrapper
                .find('#CreateNextStepButton')
                .hostNodes()
                .find('[disabled=true]')
        ).to.have.lengthOf(0);
    });

    it('Create renders page one with a spinner when editing and no commission data has loaded', () => {
        const wrapper = mount(<Create {...props} commissionId={'commissionId'} />);
        expect(wrapper.find('#CreatePageOne').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#EditSpinner').hostNodes()).to.have.lengthOf(1);
    });

    it('Create renders page one without a spinner when editing and commission data has loaded', () => {
        const wrapper = mount(<Create {...props} commissionId={'commissionId'} commissionToEdit={{}} />);
        expect(wrapper.find('#EditSpinner').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#CreatePageOne').hostNodes()).to.have.lengthOf(1);
    });

    it('Create renders page two', () => {
        const wrapper = mount(<Create {...props} pageNumber='2' />);
        expect(wrapper.find('#CreatePageOne').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#CreatePageTwo').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreatePageThree').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#CreateNextStep').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.text()).to.include('Continue');
        expect(wrapper.find('#CreatePreviousStep').hostNodes()).to.have.lengthOf(1);
    });

    it('Page two provides required meta fields', () => {
        const propsWithMetaFields = {
            ...props,
            metaFieldsToggle: 1,
            meta_fields:[{
                name: 'category',
                values: []
            }, {
                name: 'length_of_stay',
                values: []
            }],
            onChangeMetaFields: sinon.spy() // make a new one so it does not interfere with other tests
        };
        const wrapper = mount(
            <Create
                {...propsWithMetaFields}
                pageNumber='2'
            />
        );
        const metaFieldsComp = wrapper.find('#CreateMetaFields');

        // put a value in the Category input field
        metaFieldsComp.find('Input#CreateMetaInput-category').simulate('change', { target: { value: 'cat1' } });
        // expec the callback to be called for the field with the provided value
        expect(propsWithMetaFields.onChangeMetaFields.getCall(0).args.slice(0, 2)).to.deep.equal(['cat1', 'category']);

        propsWithMetaFields.onChangeMetaFields.reset();
        // put a value in the Length of Stay input field
        metaFieldsComp.find('Input#CreateMetaInput-length_of_stay').simulate('change', { target: { value: 'len1' } });
        // expec the callback to be called for the field with the provided value
        expect(propsWithMetaFields.onChangeMetaFields.getCall(0).args.slice(0, 2)).to.deep.equal(['len1', 'length_of_stay']);
    });

    it('Create renders page three with the save button disabled by default', () => {
        const wrapper = mount(
            <Create
                {...props}
                pageNumber='3'
                rates={[
                    {
                        id: [{ id: '5', type: 'group' }],
                        performance_value: ''
                    },
                    {
                        id: [],
                        performance_value: ''
                    }
                ]}
            />
        );
        expect(wrapper.find('#CreatePageOne').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#CreatePageTwo').hostNodes()).to.have.lengthOf(0);
        expect(wrapper.find('#CreatePageThree').hostNodes()).to.have.lengthOf(1);
        expect(wrapper.find('#CreateNextStep').hostNodes()).to.have.lengthOf(1);
        expect(
            wrapper
                .find('#CreateNextStepButton')
                .hostNodes()
                .find('[disabled=true]')
        ).to.have.lengthOf(1);
        expect(wrapper.text()).to.include('Save');
        expect(wrapper.text()).to.include('Add more +');
        expect(wrapper.text()).not.to.include('Remove');
        expect(wrapper.find('#CreatePreviousStep').hostNodes()).to.have.lengthOf(1);

        // errors
        expect(wrapper.text()).to.include('rate[0] error');
    });

    it('Create renders page three with the save button enabled', () => {
        const wrapper = mount(
            <Create
                {...props}
                pageNumber='3'
                rates={[
                    {
                        id: [{ id: 'id', label: 'label', type: 'campaign' }],
                        performance_value: 2,
                        performance_model: 'cpc'
                    },
                    {
                        id: [],
                        performance_value: 3,
                        performance_model: 'cpc'
                    }
                ]}
            />
        );
        expect(
            wrapper
                .find('#CreateNextStepButton')
                .hostNodes()
                .find('[disabled=true]')
        ).to.have.lengthOf(0);
    });

    it('Create renders page three with the save button disabled with an incomplete commission', () => {
        const wrapper = mount(
            <Create
                {...props}
                pageNumber='3'
                rates={[
                    {
                        id: [{ id: 'id', label: 'label', type: 'campaign' }],
                        performance_value: '',
                        performance_model: 'cpc'
                    },
                    {
                        id: [],
                        performance_value: 3,
                        performance_model: 'cpc'
                    }
                ]}
            />
        );
        expect(
            wrapper
                .find('#CreateNextStepButton')
                .hostNodes()
                .find('[disabled=true]')
        ).to.have.lengthOf(1);
    });
});
