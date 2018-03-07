import * as ActionTypes from '../constants/actionTypes';

let nextTodoId = 0;

export function addTodo(text) {
	return { 
		type: ActionTypes.ADD_TODO,
		id: nextTodoId++,
		text 
	};
}

export function toggleTodo(index) {
	return { 
		type: ActionTypes.TOGGLE_TODO, 
		index 
	};
}

export function setVisibilityFilter(filter) {
	return { 
		type: ActionTypes.SET_VISIBILITY_FILTER, 
		filter 
	};
}