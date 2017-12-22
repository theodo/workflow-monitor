import { UPDATE_TASKS, UPDATE_TITLE } from './constants'

export function changeTasks(tasks) {
    return {
        type: UPDATE_TASKS,
        tasks
    }
}

export function changeTitle(title) {
    return {
        type: UPDATE_TITLE,
        title: title
    }
}
