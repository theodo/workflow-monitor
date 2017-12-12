import { UPDATE_TASKS, UPDATE_TITLE } from './constants'

const PlanningPanelReducers = (state = {  tasks: [], title: "" }, action) => {
    switch (action.type) {
        case UPDATE_TASKS:
            return {
                ...state,
                tasks: action.tasks
            }
        case UPDATE_TITLE:
            return {
                ...state,
                title: action.title
            }
        default:
            return state;
    }
}

export default PlanningPanelReducers;
