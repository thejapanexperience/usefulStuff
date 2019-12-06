// @flow

import React from 'react';
import { translate as l } from 'app/utils';

import { Dropdown, Input, TextArea } from '@phg/stilo-toolbox/v2/component';
import withFieldWrapper from '@phg/stilo-toolbox/v2/hoc/withFieldWrapper';
import { metaFieldsReference } from './defaults';
import { formatCustomMetaFieldName, getDropdownItems } from './helpers';

const WrappedInput = withFieldWrapper(Input);
const WrappedTextArea = withFieldWrapper(TextArea);
const WrappedDropdown = withFieldWrapper(Dropdown);

import type {
    MetaFieldsPropTypes,
    MetaInputType,
    MetaDropdownType
} from './types';

const metaInput = ({ key, label, values, onChangeMetaField, error }: MetaInputType) => {
    const id = `CreateMetaInput-${key}`;
    return (
        <WrappedInput
            id={id}
            key={key}
            className="wrappedInput"
            label={label}
            value={values[0] || ''}
            onChange={(event: SyntheticInputEvent<EventTarget>) => onChangeMetaField(event.target.value)}
            placeholder={l('Enter')}
            error={error}
        />
    );
};
const metaTextArea = ({ key, label, values, onChangeMetaField, error }: MetaInputType) => {
    const id = `CreateMetaTextArea-${key}`;
    return (
        <WrappedTextArea
            id={id}
            key={key}
            className="wrappedInput"
            label={label}
            value={values[0] || ''}
            onChange={(event: SyntheticInputEvent<EventTarget>) => onChangeMetaField(event.target.value)}
            placeholder={l('Enter')}
            error={error}
        />
    );
};
const metaDropdown = ({ key, label, values, onChangeMetaField, dropdownItemOptions, error }: MetaDropdownType) => {
    const dropdownItems = getDropdownItems({ key, dropdownItemOptions });
    const id = `CreateMetaDropdown-${key}`;
    return (
        <WrappedDropdown
            id={id}
            key={key}
            className="wrappedInput"
            label={label}
            value={values[0] || ''}
            onSelect={(value: string | number) => onChangeMetaField(value)}
            error={error}
        >
            {dropdownItems &&
                dropdownItems.map(
                    item =>
                        <Dropdown.Item
                            className="input"
                            key={ item.value }
                            value={item.value}
                        >
                            {item.label}
                        </Dropdown.Item>)}
        </WrappedDropdown>
    );
};

const inputs = {
    Input: (obj: MetaInputType) => metaInput(obj),
    TextArea: (obj: MetaInputType) => metaTextArea(obj),
    Dropdown: (obj: MetaDropdownType) => metaDropdown(obj)
};

const MetaFields = ({
    onChangeMetaFields,
    meta_fields,
    dropdownItemOptions,
    errors
}: MetaFieldsPropTypes) => {
    return (
        <div id='CreateMetaFields' className="metaFields">
            {
                meta_fields.map( (metaField, index) => {
                    const field: ({
                        label: string,
                        inputType: string
                    } | typeof undefined) = metaFieldsReference[metaField.name];

                    // Default to TextArea for custom metaFields
                    const inputType = field ? field.inputType : 'Input';
                    const label = field ? field.label : formatCustomMetaFieldName(metaField.name);
                    return inputs[inputType]({
                        key: metaField.name,
                        label: l(label),
                        values: metaField.values,
                        dropdownItemOptions,
                        onChangeMetaField: (value: string | number) => onChangeMetaFields(value, metaField.name, meta_fields),
                        error: errors[`meta_fields[${index}]`]
                    });

                })
            }
        </div>
    );
};

export { MetaFields as default, MetaFields };
