// @flow

import React from 'react';
import cx from 'classnames';
import { withStyles } from 'stilo-toolbox/src/components/ThemeProvider';
import { Indicator, Label, PageTitle } from '@phg/stilo-toolbox/v2/component';
import { ZShape, Context, Main } from '@phg/stilo-toolbox/v2/layout/page';
import Loader from '@phg/stilo-toolbox/components/Loader';
import { translate as l } from 'app/utils';

import { isNextButtonDisabled } from './helpers';
import { pageTitlesListObject, customerTypesListObject } from './defaults';
import PageOne from './Page1';
import PageTwo from './Page2';
import PageThree from './Page3';
import NextStep from './NextStep';
import PreviousStep from './PreviousStep';
import makeStyle from './style';

import type { CreateCommissionPropTypes } from './types';

// eslint-disable-next-line complexity, max-statements
const Create = ({
    classes,

    pageNumber,
    metaFieldsToggle,
    toggleStartDatePicker,
    toggleEndDatePicker,
    togglePartnersMultiSelect,
    startDatePickerIsOpen,
    endDatePickerIsOpen,
    partnersMultiSelectIsOpenArray,
    partnersMemo,
    partnersSearchString,

    onChange,
    onChangeMetaFields,
    onChangeRate,
    onSave,
    onContinue,
    onGoBack,
    onCancel,
    onSearchForPublishersAndGroups,
    onAddCommissionRule,
    onRemoveCommissionRule,

    description,
    start_date,
    end_date,
    meta_fields,
    rates,
    commission_based_on_field,
    errors,

    countries,
    verticals,
    campaign,
    campaignDefaultCurrency,
    campaignDefaultCookiePeriod,
    campaignId,
    conversionTypes,
    publishersList,
    groupsList,

    commissionId,
    commissionToEdit,
    isActiveEdit,

    commissionByMetaSettings
}: CreateCommissionPropTypes): ZShape => {

    const fromDatePickerIsDisabled = isActiveEdit && commissionId && commissionToEdit && commissionToEdit.status === 'ACTIVE' || false;
    const nextButtonIsDisabled = isNextButtonDisabled({ pageNumber, description, start_date, rates });

    const pageTitleText = commissionId ? l('Edit commission') : l('Create commission');

    return (
        <ZShape id={'CreateCommission'} className={cx(classes.ZShape)}>
            <Context id={'CreateContext'} className={cx(classes.Context)}>
                <PageTitle id={'CreatePageTitle'}>{pageTitleText}</PageTitle>
                <div className='indicatorBox'>
                    <Indicator id={'CreateIndicator'} className='indicator'>
                        <Label id={'CreateLabel1'} active={pageNumber === '1' ? 'true' : 'false'}>
                            {pageTitlesListObject['1']}
                        </Label>
                        <Label id={'CreateLabel2'} active={pageNumber === '2' ? 'true' : 'false'}>
                            {pageTitlesListObject['2']}
                        </Label>
                        <Label id={'CreateLabel3'} active={pageNumber === '3' ? 'true' : 'false'}>
                            {pageTitlesListObject['3']}
                        </Label>
                    </Indicator>
                </div>
            </Context>
            <Main id={'CreateMain'} className={cx(classes.Main)}>
                <div className='title'>{pageTitlesListObject[pageNumber]}</div>

                {pageNumber === '1' && (
                    !commissionId || (commissionId && commissionToEdit)
                        ? (
                            <PageOne
                                className={cx(classes.DialoguePages)}
                                title={pageTitlesListObject.one}
                                toggleStartDatePicker={toggleStartDatePicker}
                                toggleEndDatePicker={toggleEndDatePicker}
                                startDatePickerIsOpen={startDatePickerIsOpen}
                                endDatePickerIsOpen={endDatePickerIsOpen}
                                onChange={onChange}

                                description={description}
                                start_date={start_date}
                                end_date={end_date}

                                errors={errors}

                                campaign={campaign}
                                campaignDefaultCurrency={campaignDefaultCurrency}
                                fromDatePickerIsDisabled={fromDatePickerIsDisabled}

                                commissionByMetaSettings={commissionByMetaSettings}
                                commission_based_on_field={commission_based_on_field}
                            />
                        )
                        : (
                            <div className={cx(classes.DialoguePages)} id='EditSpinner'>
                                <Loader />
                            </div>
                        ))}

                {pageNumber === '2' && (
                    <PageTwo
                        className={cx(classes.DialoguePages)}
                        title={pageTitlesListObject.two}
                        metaFieldsToggle={metaFieldsToggle}
                        onChange={onChange}
                        onChangeMetaFields={onChangeMetaFields}

                        meta_fields={meta_fields}

                        countries={countries}
                        verticals={verticals}
                        conversionTypes={conversionTypes}
                        customerTypes={customerTypesListObject}

                        errors={errors}
                    />
                )}
                {pageNumber === '3' && (
                    <PageThree
                        className={cx(classes.DialoguePages)}
                        title={pageTitlesListObject.three}
                        togglePartnersMultiSelect={togglePartnersMultiSelect}
                        partnersMultiSelectIsOpenArray={partnersMultiSelectIsOpenArray}
                        partnersMemo={partnersMemo}
                        partnersSearchString={partnersSearchString}
                        onChangeRate={onChangeRate}
                        onSearchForPublishersAndGroups={onSearchForPublishersAndGroups}
                        onAddCommissionRule={onAddCommissionRule}
                        onRemoveCommissionRule={onRemoveCommissionRule}

                        rates={rates}

                        publishersList={publishersList}
                        groupsList={groupsList}
                        currency={campaignDefaultCurrency}
                        campaignDefaultCookiePeriod={campaignDefaultCookiePeriod}

                        errors={errors}
                    />
                )}

                <div className="bottomButtons">
                    {pageNumber !== '1' && onGoBack && <PreviousStep onGoBack={() => onGoBack(pageNumber)} />}

                    <NextStep
                        buttonText={pageNumber !== '3' ? l('Continue') : l('Save')}
                        onClick={
                            pageNumber !== '3'
                                ? () =>  onContinue(pageNumber)
                                : () =>  onSave({
                                    commissionObject: {
                                        description,
                                        start_date,
                                        end_date,
                                        meta_fields,
                                        rates,
                                        commission_based_on_field
                                    },
                                    campaignId,
                                    commissionId: commissionId || null,
                                    commissionToEdit: commissionToEdit || null,
                                    noMeta: metaFieldsToggle === 0
                                })
                        }
                        onCancel={onCancel}
                        disabled={nextButtonIsDisabled}
                    />

                </div>

            </Main>
        </ZShape>
    );
};

const StyledCreate = withStyles(makeStyle)(Create);

export { StyledCreate as default, Create };
