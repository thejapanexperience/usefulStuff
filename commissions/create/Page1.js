// @flow

import React from 'react';
import { convertToTimeZone, convertToLocalTime } from 'date-fns-timezone';

import { translate as l } from 'app/utils';
import { Input, DatePicker, Dropdown } from '@phg/stilo-toolbox/v2/component';
import { datePickerStrings } from './defaults';
import { checkNameLength } from './helpers';
import withFieldWrapper from '@phg/stilo-toolbox/v2/hoc/withFieldWrapper';

const WrappedInput = withFieldWrapper(Input);
const WrappedDatePicker = withFieldWrapper(DatePicker);
const WrappedDropdown = withFieldWrapper(Dropdown);

import type { PageOnePropTypes } from './types';

const PageOne = ({
    className,
    toggleStartDatePicker,
    toggleEndDatePicker,
    startDatePickerIsOpen,
    endDatePickerIsOpen,
    fromDatePickerIsDisabled,

    onChange,

    campaign,

    description,
    start_date,
    end_date,

    commissionByMetaSettings,
    commission_based_on_field,
    errors

}: PageOnePropTypes) => {
    let datePickerStringsFrom = datePickerStrings.from,
        datePickerFromStartDate = start_date;
    if (datePickerFromStartDate && datePickerFromStartDate.getTime() == 0) {    // if the date is set to 01-01-1970
        // have the picker to show Now and not the 01-01-1970 date
        datePickerStringsFrom = { ...datePickerStringsFrom, triggerDefault: l('Now') };
        datePickerFromStartDate = null;
    }

    return (
        <div id='CreatePageOne' className={className}>
            <div>
                <WrappedInput
                    id='CreatePageOneCommissionName'
                    className='wrappedInput'
                    error={errors.description}
                    label={l('Commission name')}
                    value={description}
                    onChange={
                        (event: SyntheticInputEvent<EventTarget>) =>
                            checkNameLength(event.target.value)
                            && onChange(event.target.value, 'Description')
                    }
                    placeholder={l('Enter')}
                />
            </div>

            <div className='multipleInputs'>
                <div>
                    <WrappedDatePicker
                        id='CreatePageOneDateFrom'
                        className='wrappedInput'
                        label={l('Start date')}
                        initialDate={new Date()}
                        isOpen={startDatePickerIsOpen}
                        locale='en'
                        weekStartsOn='monday'
                        submittedDate={datePickerFromStartDate
                            && convertToTimeZone(datePickerFromStartDate, { timeZone: campaign.reporting_timezone })}
                        labels={datePickerStringsFrom}
                        isValidDate={(date: Date) => date && true}
                        setSelectedDate={(date: Date) =>
                            onChange(convertToLocalTime(date, { timeZone: campaign.reporting_timezone }), 'StartDate')}
                        toggleOpen={() => toggleStartDatePicker(!startDatePickerIsOpen)}
                        hasTimePicker
                        disabled={fromDatePickerIsDisabled}
                        error={errors.start_date}
                    />
                </div>

                <div className="endDateContainer">
                    <WrappedDatePicker
                        id='CreatePageOneDateTo'
                        className='wrappedInput secondDateInput'
                        label={l('to')}
                        initialDate={new Date()}
                        isOpen={endDatePickerIsOpen}
                        locale='en'
                        weekStartsOn='monday'
                        submittedDate={end_date && convertToTimeZone(end_date, { timeZone: campaign.reporting_timezone })}
                        labels={datePickerStrings.to}
                        isValidDate={ (date: Date) =>
                            !!start_date && convertToTimeZone(date, { timeZone: campaign.reporting_timezone }) > new Date(start_date) }
                        setSelectedDate={(date: Date) =>
                            onChange(date && convertToLocalTime(date, { timeZone: campaign.reporting_timezone }), 'EndDate')}
                        toggleOpen={() => toggleEndDatePicker(!endDatePickerIsOpen)}
                        hasTimePicker
                        disabled={start_date ? false : true}
                        reset
                        error={errors.end_date}
                    />
                </div>
            </div>

            { commissionByMetaSettings ?
                <div>
                    <WrappedDropdown
                        id="commission_based_on_field"
                        className="wrappedInput"
                        label={l('Commission by')}
                        value={commission_based_on_field}
                        onSelect={value => onChange(value, 'CommissionBasedOnField') }
                    >
                        <Dropdown.Item className='input' key={'value'} value={'value'}>
                            {l('Item Value')}
                        </Dropdown.Item>
                        <Dropdown.Item className='input' key={commissionByMetaSettings.field} value={commissionByMetaSettings.field}>
                            {commissionByMetaSettings.label}
                        </Dropdown.Item>
                    </WrappedDropdown>
                </div> : null }
        </div>
    );
};

export { PageOne as default, PageOne };
