// @flow

import React from 'react';
import { translate as l } from 'app/utils';

import { Toggle } from '@phg/stilo-toolbox/v2/component';
import withFieldWrapper from '@phg/stilo-toolbox/v2/hoc/withFieldWrapper';

import MetaFields from './MetaFields';

const WrappedToggle = withFieldWrapper(Toggle);

import type { PageTwoPropTypes } from './types';

const PageTwo = ({
    className,
    metaFieldsToggle,

    onChange,
    onChangeMetaFields,

    meta_fields,

    countries,
    verticals,
    conversionTypes,
    customerTypes,

    errors
}: PageTwoPropTypes ) => {

    return (
        <div id='CreatePageTwo' className={className}>
            <WrappedToggle
                id='CreatePageTwoMetaToggle'
                className="wrappedToggle"
                label={l('Apply to')}
                buttons={[{ kind: 'main', text: l('All conversions') } , { kind: 'main', text: l('Filter conversions') }]}
                indexOfActiveButton={metaFieldsToggle}
                onClick={ (value: string | number ) => onChange(value, 'MetaFieldsToggle')}
            />

            {
                metaFieldsToggle === 1 &&
                <MetaFields
                    meta_fields={meta_fields}
                    onChangeMetaFields={onChangeMetaFields}
                    dropdownItemOptions={{
                        countries,
                        verticals,
                        conversionTypes: conversionTypes.filter( ct => ct.conversion_type_id == '1' || ct.conversion_type_id == '10' ),
                        customerTypes
                    }}
                    errors={errors}
                />
            }
        </div>
    );
};

export { PageTwo as default, PageTwo };
