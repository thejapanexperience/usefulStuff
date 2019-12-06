// @flow

import React from 'react';
import { translate as l } from 'app/utils';
import { Button, Link } from '@phg/stilo-toolbox/v2/component';

import type { NextStepPropTypes } from './types';

const NextStep = ({
    onClick,
    onCancel,
    buttonText,
    disabled
}: NextStepPropTypes) => {
    return (
        <div id='CreateNextStep' className="nextStep">
            <Link disabled={false} onClick={onCancel}>
                {l('Cancel')}
            </Link>

            <Button
                id='CreateNextStepButton'
                className="button"
                kind="main"
                onClick={onClick}
                disabled={disabled}
            >
                {l(buttonText)}
            </Button>
        </div>
    );
};

export default NextStep;
