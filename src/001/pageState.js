import { makeActionTypes, actionFrom } from 'app/utils';


const mountPoint = 'page/reporting/fraud';
const initialState = {
    selectedIncident: null
};

// Actions ----------------------------------
const actionTypeNames = [
    'SET_SELECTED_INCIDENT'
];

const actionTypes = makeActionTypes(mountPoint, actionTypeNames);
const setSelectedIncident = actionFrom(actionTypes.SET_SELECTED_INCIDENT);

// Selectors ---------------------------------
const selectorFrom = prop => globalState =>  globalState[mountPoint][prop];
const selectSelectedIncident = selectorFrom('selectedIncident');

const page = {
    mountPoint,
    selectors: {
        selectSelectedIncident
    },
    actionTypes,
    actionCreators: {
        setSelectedIncident
    },
    reducer(state = initialState, action) {
        switch (action.type) {
            case actionTypes.SET_SELECTED_INCIDENT:
                return {
                    ...state,
                    selectedIncident: action.payload
                };
            default:
                return state;
        }
    }
};

export { page as default, page, initialState };




