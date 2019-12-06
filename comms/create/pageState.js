import { makeActionTypes, actionFrom } from 'app/utils';
import { createSelector } from 'reselect';
import api from 'app/api';
import { defaultRate, commissionRate } from './defaults';

const initialState = {
    // General
    pageNumber: '1',
    metaFieldsToggle: 0,
    startDatePickerIsOpen: false,
    endDatePickerIsOpen: false,
    partnersMultiSelectIsOpenArray: [false],
    partnersMemo: {
        searches: {},
        count: 0,
        isNotAllPartners: false,
    },
    partnersSearchString: '',
    isActiveEdit: false,

    // Commission
    description: '',
    start_date: null,
    end_date: null,
    meta_fields: [],
    rates: [defaultRate, commissionRate],
    commission_based_on_field: 'value',
    errors: null
};

const mountPoint = 'page/commissions/detail';
const actionTypeNames = [
    'SET_PAGE_NUMBER',
    'RESET_FORM',
    'SET_APPLY_TO_TOGGLE',
    'TOGGLE_START_DATEPICKER',
    'TOGGLE_END_DATEPICKER',
    'TOGGLE_PARTNER_GROUP_MULTISELECT',
    'SET_PARTNERS_GROUPS_MEMO',
    'SET_PARTNERS_GROUPS_SEARCH_STRING',
    'SET_IS_ACTIVE_EDIT',

    'SET_DESCRIPTION',
    'SET_START_DATE',
    'SET_END_DATE',
    'SET_META_FIELDS',
    'SET_RATES',
    'SET_COMMISSION_BASED_ON_FIELD',
    'SET_ERRORS'
];
const actionTypes = makeActionTypes(mountPoint, actionTypeNames);

// basic action-creator functions
const setPageNumber = actionFrom(actionTypes.SET_PAGE_NUMBER);
const resetForm = actionFrom(actionTypes.RESET_FORM);
const setMetaFieldsToggle = actionFrom(actionTypes.SET_APPLY_TO_TOGGLE);
const toggleStartDatePicker = actionFrom(actionTypes.TOGGLE_START_DATEPICKER);
const toggleEndDatePicker = actionFrom(actionTypes.TOGGLE_END_DATEPICKER);
const togglePartnersMultiSelect = actionFrom(actionTypes.TOGGLE_PARTNER_GROUP_MULTISELECT);
const setpartnersMemo = actionFrom(actionTypes.SET_PARTNERS_GROUPS_MEMO);
const setpartnersSearchString = actionFrom(actionTypes.SET_PARTNERS_GROUPS_SEARCH_STRING);
const setIsActiveEdit = actionFrom(actionTypes.SET_IS_ACTIVE_EDIT);

const setDescription = actionFrom(actionTypes.SET_DESCRIPTION);
const setStartDate = actionFrom(actionTypes.SET_START_DATE);
const setEndDate = actionFrom(actionTypes.SET_END_DATE);
const setMetaFields = actionFrom(actionTypes.SET_META_FIELDS);
const setRates = actionFrom(actionTypes.SET_RATES);
const setCommissionBasedOnField = actionFrom(actionTypes.SET_COMMISSION_BASED_ON_FIELD);
const setErrors = actionFrom(actionTypes.SET_ERRORS);

// basic selectors
const selectorFrom = mountPoint => prop => globalState => globalState[mountPoint][prop];
const getPageNumber = selectorFrom(mountPoint)('pageNumber');
const getMetaFieldsToggle = selectorFrom(mountPoint)('metaFieldsToggle');
const getStartDatePickerIsOpen = selectorFrom(mountPoint)('startDatePickerIsOpen');
const getEndDatePickerIsOpen = selectorFrom(mountPoint)('endDatePickerIsOpen');
const getPartnerGroupMultiSelectIsOpen = selectorFrom(mountPoint)('partnersMultiSelectIsOpenArray');
const getpartnersMemo = selectorFrom(mountPoint)('partnersMemo');
const getpartnersSearchString = selectorFrom(mountPoint)('partnersSearchString');
const getIsActiveEdit = selectorFrom(mountPoint)('isActiveEdit');

const getDescription = selectorFrom(mountPoint)('description');
const getStartDate = selectorFrom(mountPoint)('start_date');
const getEndDate = selectorFrom(mountPoint)('end_date');
const getRates = selectorFrom(mountPoint)('rates');
const getCommissionBasedOnField = selectorFrom(mountPoint)('commission_based_on_field');


// custom selectors
const getErrors = createSelector(
    selectorFrom(mountPoint)('errors'),
    error => {
        if (error) {
            const map = {};
            error.errors.forEach( error => {
                // can be a validation error on a field or some general error
                let prop = error.property || '*';
                if (prop.indexOf('rates[') == 0)  // if that's a rates error (prop is like "rates[publisher-3].xxx)
                    prop = prop.match(/rates\[.+\]/)[0];   // then leave just the rates index as the rest will not be handled for now
                else if (prop.indexOf('meta_fields[') == 0)  // if that's a meta_fields error (prop is like "meta_fields[3].xxx)
                    prop = prop.match(/meta_fields\[\d+\]/)[0];   // then leave just the meta_fields index
                const errsList = map[prop] || (map[prop] = []);
                errsList.push(error.message);
            });
            return map;
        } else
            return {};
    }
);
const getMetaFields = createSelector(
    api.commissions.selectors.selectMetaFields,
    selectorFrom(mountPoint)('meta_fields'),
    (fieldNamesFromApi, metaFields) => {
        if (metaFields.length) {
            return metaFields;
        } else {
            const blankMetaFields = fieldNamesFromApi
                .filter(field => field.name)
                .sort((a, b) => a.weight - b.weight)
                .map(field => {
                    return { name: field.name, values: [] };
                });
            return blankMetaFields.length ? blankMetaFields : [];
        }
    }
);

const getCommissionByMetaSettings = createSelector(
    api.campaign.selectors.selectData,
    campaign => campaign && campaign.commission_by_meta && campaign.commission_by_meta != 'value' && {
        field: campaign.commission_by_meta,
        label: campaign.commission_by_meta_label
    }
);

const page = {
    mountPoint,
    actionTypes,
    actionCreators: {
        setPageNumber,
        resetForm,

        setMetaFieldsToggle,
        toggleStartDatePicker,
        toggleEndDatePicker,
        togglePartnersMultiSelect,
        setpartnersMemo,
        setpartnersSearchString,
        setIsActiveEdit,

        setDescription,
        setStartDate,
        setEndDate,
        setMetaFields,
        setRates,

        setCommissionBasedOnField,
        setErrors
    },
    selectors: {
        getPageNumber,
        getMetaFieldsToggle,
        getStartDatePickerIsOpen,
        getEndDatePickerIsOpen,
        getPartnerGroupMultiSelectIsOpen,
        getpartnersMemo,
        getpartnersSearchString,
        getIsActiveEdit,

        getDescription,
        getStartDate,
        getEndDate,
        getMetaFields,
        getRates,

        getCommissionByMetaSettings,
        getCommissionBasedOnField,
        getErrors
    },
    //eslint-disable-next-line
    reducer(state = initialState, action) {
        switch (action.type) {
            case actionTypes.SET_PAGE_NUMBER:
                return {
                    ...state,
                    pageNumber: action.payload
                };
            case actionTypes.RESET_FORM:
                return initialState;

            case actionTypes.SET_APPLY_TO_TOGGLE:
                return {
                    ...state,
                    metaFieldsToggle: action.payload
                };
            case actionTypes.TOGGLE_START_DATEPICKER:
                return {
                    ...state,
                    startDatePickerIsOpen: action.payload
                };
            case actionTypes.TOGGLE_END_DATEPICKER:
                return {
                    ...state,
                    endDatePickerIsOpen: action.payload
                };
            case actionTypes.TOGGLE_PARTNER_GROUP_MULTISELECT:
                return {
                    ...state,
                    partnersMultiSelectIsOpenArray: action.payload
                };
            case actionTypes.SET_PARTNERS_GROUPS_MEMO:
                return {
                    ...state,
                    partnersMemo: action.payload
                };
            case actionTypes.SET_PARTNERS_GROUPS_SEARCH_STRING:
                return {
                    ...state,
                    partnersSearchString: action.payload
                };
            case actionTypes.SET_IS_ACTIVE_EDIT:
                return {
                    ...state,
                    isActiveEdit: action.payload
                };

            case actionTypes.SET_DESCRIPTION:
                return {
                    ...state,
                    description: action.payload
                };
            case actionTypes.SET_START_DATE:
                return {
                    ...state,
                    start_date: action.payload
                };
            case actionTypes.SET_END_DATE:
                return {
                    ...state,
                    end_date: action.payload
                };
            case actionTypes.SET_META_FIELDS:
                return {
                    ...state,
                    meta_fields: action.payload
                };
            case actionTypes.SET_RATES:
                return {
                    ...state,
                    rates: action.payload
                };
            case actionTypes.SET_COMMISSION_BASED_ON_FIELD:
                return {
                    ...state,
                    commission_based_on_field: action.payload
                };
            case actionTypes.SET_ERRORS:
                return {
                    ...state,
                    errors: action.payload
                };
            default:
                return state;
        }
    }
};

export { page as default, page, initialState };
