// @flow

import React from 'react';
import { EntypoChevronLeft } from 'react-entypo-icons';

import { translate as l } from 'app/utils';
import { Link } from '@phg/stilo-toolbox/v2/component';

import type { PreviousStepPropTypes } from './types';

const PreviousStep = ({ onGoBack }: PreviousStepPropTypes) => {
    return (
        <div id='CreatePreviousStep' className='previousStep'>
            <Link id='CreateNextStepLink' className='previousStepText' disabled={false} onClick={onGoBack}>
                <EntypoChevronLeft/><span> {l('Previous step')}</span>
            </Link>
        </div>
    );
};

export default PreviousStep;
