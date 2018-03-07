import { connect } from 'react-redux';
import { toggleTodo } from '../actions';
import TodoList from '../components/todoList';
import * as VisibilityFilters from '../constants/visibilityFilters';

const getVisibleTodos = (todos, filter) => {
	switch (filter) {
		case VisibilityFilters.SHOW_ALL:
			return todos;
		case VisibilityFilters.SHOW_COMPLETED:
			return todos.filter(t => t.completed);
		case VisibilityFilters.SHOW_ACTIVE:
			return todos.filter(t => !t.completed);
	}
};

const mapStateToProps = state => {
	return {
		todos: getVisibleTodos(state.todos, state.visibilityFilter)
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onTodoClick: id => {
			dispatch(toggleTodo(id));
		}
	};
};

const VisibleTodoList = connect(
	mapStateToProps,
	mapDispatchToProps
)(TodoList);

export default VisibleTodoList;