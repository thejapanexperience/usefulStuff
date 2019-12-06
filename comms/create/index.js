// @flow

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import api from 'app/api';
import { componentMount, debounceFactory } from 'app/utils';
import globalErrors from 'app/state/globalDucks/errors';
import pageState from './pageState';
import {
    transformCommissionObjectForApi,
    convertSecondsToDays,
    getRatesCompletionStatuses,
    getActiveValues,
    checkEditIsUnchanged,
    processSaveErrors
} from './helpers';

import Create from './Create';
import type { CreateCommissionIndexPropTypes, CreateCommissionMDTPTypes, StateType, DispatchType } from './types';
import { defaultRate } from './defaults';

class CreateCommission extends React.Component<CreateCommissionIndexPropTypes, {}> {
    state = {}

    static getDerivedStateFromProps({
        commissionId,
        commissionToEdit,
        description,
        start_date,
        end_date,
        meta_fields,
        rates,
        isActiveEdit,
        onSetEditData,
        commission_based_on_field
    }) {

        const {
            active_description,
            active_start_date,
            active_end_date,
            active_meta_fields,
            active_rates,
            has_active_meta_field_values,
            active_commission_based_on_field
        } = getActiveValues({
            commissionId,
            commissionToEdit,
            description,
            start_date,
            end_date,
            meta_fields,
            rates,
            isActiveEdit,
            commission_based_on_field
        });

        commissionToEdit && !isActiveEdit && onSetEditData({
            description: active_description,
            start_date: active_start_date,
            end_date: active_end_date,
            meta_fields: active_meta_fields,
            rates: active_rates,
            has_active_meta_field_values,
            commission_based_on_field: active_commission_based_on_field
        });

        return null;
    }

    render() {
        return <Create {...this.props } id='CreateCommissionComponent' />;
    }
}

const mapStateToProps = (state: StateType) => {
    const campaign = api.campaign.selectors.selectData(state);
    return {
        pageNumber: pageState.selectors.getPageNumber(state),
        metaFieldsToggle: pageState.selectors.getMetaFieldsToggle(state),
        startDatePickerIsOpen: pageState.selectors.getStartDatePickerIsOpen(state),
        endDatePickerIsOpen: pageState.selectors.getEndDatePickerIsOpen(state),
        partnersMultiSelectIsOpenArray: pageState.selectors.getPartnerGroupMultiSelectIsOpen(state),
        partnersMemo: pageState.selectors.getpartnersMemo(state),
        partnersSearchString: pageState.selectors.getpartnersSearchString(state),
        isActiveEdit: pageState.selectors.getIsActiveEdit(state),

        description: pageState.selectors.getDescription(state),
        start_date: pageState.selectors.getStartDate(state),
        end_date: pageState.selectors.getEndDate(state),
        meta_fields: pageState.selectors.getMetaFields(state),
        rates: pageState.selectors.getRates(state),
        commission_based_on_field: pageState.selectors.getCommissionBasedOnField(state),
        errors: pageState.selectors.getErrors(state),

        verticals: api.vertical.selectors.selectData(state),
        countries: api.country.selectors.selectData(state),
        campaign,
        campaignDefaultCurrency: campaign && campaign.default_currency,
        campaignDefaultCookiePeriod: campaign && convertSecondsToDays(campaign.cookie_period),
        campaignId: campaign && campaign.campaign_id,
        conversionTypes: api.conversiontypes.selectors.selectData(state),
        publishersList: api.campaignPartners.selectors.selectData(state),
        groupsList: api.adminGroups.selectors.selectData(state),
        commissionToEdit: api.commissions.selectors.selectCommissionToEdit(state),

        commissionByMetaSettings: pageState.selectors.getCommissionByMetaSettings(state)
    };
};

const debounce = debounceFactory();

const mapDispatchToProps = (dispatch: DispatchType): CreateCommissionMDTPTypes => ({
    onMountLoadAction: () => {
        dispatch(api.commissions.actionCreators.fetchMetaFieldsAction());
        dispatch(api.vertical.actionCreators.fetchVerticalsAction());
        dispatch(api.country.actionCreators.fetchAction());
        dispatch(api.user.actionCreators.fetchAction());
        dispatch(pageState.actionCreators.resetForm());

        const fetchPartnersFunction = () => {
            return {
                account_name: '',
                campaign_status: 'a',
                inner_id: ''
            };
        };
        dispatch(api.campaignPartners.actionCreators.fetchPartnersAction(fetchPartnersFunction)());
        dispatch(api.adminGroups.actionCreators.fetchAction);
    },

    onSetEditData:({
        description,
        start_date,
        end_date,
        meta_fields,
        rates,
        has_active_meta_field_values,
        commission_based_on_field
    }) =>{
        dispatch(pageState.actionCreators.setDescription(description));
        dispatch(pageState.actionCreators.setStartDate(start_date));
        dispatch(pageState.actionCreators.setEndDate(end_date));
        dispatch(pageState.actionCreators.setMetaFields(meta_fields));
        dispatch(pageState.actionCreators.setRates(rates));
        dispatch(pageState.actionCreators.setCommissionBasedOnField(commission_based_on_field));
        dispatch(pageState.actionCreators.setIsActiveEdit(true));
        has_active_meta_field_values && dispatch(pageState.actionCreators.setMetaFieldsToggle(1));
    },

    onChange: (value, key) => {
        dispatch(pageState.actionCreators[`set${key}`](value));
    },

    onChangeMetaFields: (value, metaFieldName, metaFields) => {
        const updatedMetaFields = metaFields.map(metaField => {
            return metaField.name === metaFieldName ? { name: metaFieldName, values: [value] } : metaField;
        });
        dispatch(pageState.actionCreators.setMetaFields(updatedMetaFields));
    },

    onChangeRate: ({ value, key, index, rates }) => {
        const updatedRate = { ...rates[index] };

        updatedRate[key] = value;
        const updatedRates = rates.map((rate, i) => {
            return i === index ? updatedRate : rate;
        });

        dispatch(pageState.actionCreators.setRates(updatedRates));
    },

    onContinue: pageNumber => {
        dispatch(pageState.actionCreators.setPageNumber((Number(pageNumber) + 1).toString()));
    },

    onGoBack: pageNumber => {
        dispatch(pageState.actionCreators.setPageNumber((Number(pageNumber) - 1).toString()));
    },

    onCancel: () => {
        dispatch(push('/v2/optimizations/partnerrel'));
        dispatch(pageState.actionCreators.resetForm());
        dispatch(api.commissions.actionCreators.fetchOneActionV2Reset());
    },

    onSave: ({ commissionObject, campaignId, commissionId, commissionToEdit, noMeta }) => {
        const statuses = getRatesCompletionStatuses(commissionObject.rates);
        const removedEmptyRates = {
            ...commissionObject,
            rates: commissionObject.rates.filter((rate, i) => statuses[i] === 'complete')
        };
        const transformedCommissionObject = transformCommissionObjectForApi(removedEmptyRates, campaignId, noMeta);
        const isUnchanged = checkEditIsUnchanged(transformedCommissionObject, commissionToEdit);

        const onSaveComplete = () => {
            dispatch(api.commissions.actionCreators.fetchOneActionV2Reset());
            dispatch(push('/v2/optimizations/partnerrel'));
            dispatch(pageState.actionCreators.resetForm());
        };


        const onSaveError = error => {
            if (error.response) {
                const result = processSaveErrors(error.response.data.error.errors, transformedCommissionObject.rates);
                const firstErrPageInd = result.firstErrPageInd;

                result.errorsToAlert.forEach( err =>
                    dispatch({
                        type: globalErrors.actionTypes.ADD_GLOBAL_ERROR,
                        payload: err
                    })
                );

                dispatch(pageState.actionCreators.setErrors(error.response.data.error));

                if (firstErrPageInd > -1) // if a page was found
                    dispatch(pageState.actionCreators.setPageNumber(String(firstErrPageInd + 1)));  // then switch to it

                return true;    // prevent the default error handler from being invoked
            }

            dispatch(api.commissions.actionCreators.errorAction(null));
        };

        if (commissionId && isUnchanged) {
            dispatch(push('/v2/optimizations/partnerrel'));
            dispatch(pageState.actionCreators.resetForm());
            dispatch(api.commissions.actionCreators.fetchOneActionV2Reset());
        } else {
            !commissionId
                ? dispatch(api.commissions.actionCreators.saveActionV2(transformedCommissionObject, onSaveComplete, onSaveError))
                : (
                    commissionToEdit && dispatch(api.commissions.actionCreators.updateActionV2(
                        commissionToEdit.id,
                        transformedCommissionObject,
                        onSaveComplete,
                        onSaveError
                    ))
                );
        }
    },

    onSearchForPublishersAndGroups: ({
        searchString,
        partnersMemo,
        partnersSearchString,
        sortedPartners,
        isNotAllPartners
    }) => {
        const fetchPartnersFunction = () => {
            return {
                account_name: searchString,
                inner_id: ''
            };
        };

        const isNewSearch = !(searchString in partnersMemo.searches);

        isNewSearch ? (partnersMemo.count = partnersMemo.count += 1) : null;

        if (partnersMemo.count > 20) {
            partnersMemo.searches = { '': partnersMemo.searches[''] };
            partnersMemo.count = 1;
        }

        !(partnersSearchString in partnersMemo.searches)
            ? (partnersMemo.searches[partnersSearchString] = sortedPartners)
            : null;

        partnersMemo.isNotAllPartners = !partnersMemo.isNotAllPartners && isNotAllPartners;

        dispatch(pageState.actionCreators.setpartnersMemo(partnersMemo));
        dispatch(pageState.actionCreators.setpartnersSearchString(searchString));

        debounce.clear();
        debounce.set(500, () => {
            isNewSearch && isNotAllPartners ? dispatch(api.campaignPartners.actionCreators.fetchPartnersAction(fetchPartnersFunction)()) : null;
        });
    },

    onAddCommissionRule: (rates, partnersMultiSelectIsOpenArray) => {
        dispatch(pageState.actionCreators.setRates([...rates.slice(0, rates.length - 1), defaultRate, rates[rates.length - 1]]));
        dispatch(pageState.actionCreators.togglePartnersMultiSelect([...partnersMultiSelectIsOpenArray, false]));
    },

    onRemoveCommissionRule: (rates, partnersMultiSelectIsOpenArray, index) => {
        dispatch(pageState.actionCreators.setRates(rates.filter((rate, i) => index != i)));
        dispatch(pageState.actionCreators.togglePartnersMultiSelect([...partnersMultiSelectIsOpenArray, false]));
    },

    toggleStartDatePicker: isOpen => {
        dispatch(pageState.actionCreators.toggleStartDatePicker(isOpen));
    },

    toggleEndDatePicker: isOpen => {
        dispatch(pageState.actionCreators.toggleEndDatePicker(isOpen));
    },

    togglePartnersMultiSelect: (partnersMultiSelectIsOpenArray, index) => {
        while (index > partnersMultiSelectIsOpenArray.length - 1 ) {
            partnersMultiSelectIsOpenArray.push(false);
        }
        dispatch(pageState.actionCreators.setpartnersSearchString(''));
        dispatch(
            pageState.actionCreators.togglePartnersMultiSelect(
                partnersMultiSelectIsOpenArray.map((bool, i) => (index === i ? !bool : bool))
            )
        );
    }
});

const connectedCreateCommission = connect(
    mapStateToProps,
    mapDispatchToProps
)(componentMount(CreateCommission));

export { connectedCreateCommission as default };
