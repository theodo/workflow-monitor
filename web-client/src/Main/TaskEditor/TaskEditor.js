/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import './TaskEditor.css';

const dashedBlocStyle = {
  display: 'flex',
  border: '1px solid #CACFD2',
  marginBottom: '.3rem',
  borderRadius: 4,
};

const taskFieldStyle = {
  padding: 0,
};

const addTaskButtonStyle = {
  padding: 10,
  cursor: 'pointer',
  backgroundColor: 'white',
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

class TaskField extends Component {
  state = {
    check: !!this.props.task.check,
    description: this.props.task.description,
    estimatedTimeText: this.props.task.estimatedTimeText,
    checkValue: this.props.task.check,
  };

  toggleCheck = () => {
    const { task, updateTask } = this.props;
    if (this.state.check) {
      updateTask(task.id, this.state.description, this.state.estimatedTimeText, null);
      this.setState({ check: false });
    } else {
      this.setState({ check: true });
    }
  };
  handleInputKeyPress = (event, addNewTask = false) => {
    if (event.which === 13) {
      event.preventDefault();
      // if addNewTask add a task with skipUpdate = true to avoid the concurrency with the onBlur event
      if (addNewTask) this.props.addTask(true);
      else this.estimatedTimeRef.focus();
    }
  };
  resizeDescriptionField = () => {
    this.descriptionField.style.height = '5px';
    this.descriptionField.style.height = this.descriptionField.scrollHeight + 'px';
  };

  componentDidUpdate(prevProps) {
    if (this.props.task && this.props.task.description !== prevProps.task.description) {
      this.resizeDescriptionField();
    }
  }
  componentDidMount() {
    this.resizeDescriptionField();
  }
  shouldComponentUpdate(nextProps, prevState) {
    return !(
      prevState.description === this.state.description &&
      prevState.estimatedTimeText === this.state.estimatedTimeText &&
      prevState.checkValue === this.state.checkValue &&
      prevState.check === this.state.check
    );
  }

  shouldUpdateTask = (taskId, fieldName, value) => {
    this.setState({ [fieldName]: value }, () => {
      if (this.state.description && this.state.estimatedTimeText) {
        return fieldName === 'check'
          ? this.props.updateTask(taskId, this.state.description, this.state.estimatedTimeText, this.state.check)
          : this.props.updateTask(
            taskId,
            this.state.description,
            this.state.estimatedTimeText
          );
      }
      return;
    });
  };

  render() {
    const {
      task,
      isDragging,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
      removeTask,
      isDefaultTask,
    } = this.props;
    const { check, checkValue, estimatedTimeText, description } = this.state;
    const opacity = isDragging ? 0 : 1;
    const backgroundColor = isDefaultTask ? '#f2f2f2' : 'white';

    return connectDragPreview(
      connectDropTarget(
        <div style={{ ...dashedBlocStyle, ...taskFieldStyle, opacity, backgroundColor }}>
          {connectDragSource(
            <div className="TaskField_dragPoint">
              <IconButton
                disableRipple={true}
                style={{ height: 36, width: 36, cursor: 'move' }}
                tabIndex="-1"
              >
                <DragHandleIcon />
              </IconButton>
            </div>,
          )}
          <div className="TaskField_mainContainer">
            <div className="TaskField_mainContainer_top">
              <textarea
                ref={ref => (this.descriptionField = ref)}
                autoFocus={!task.description}
                className="TaskField_input TaskField_description"
                value={description}
                placeholder="Description"
                onChange={event => this.setState({ description: event.target.value })}
                onBlur={event => this.shouldUpdateTask(task.id, 'description', event.target.value)}
                onClick={event => event.stopPropagation()}
                onMouseDown={event => event.stopPropagation()}
                onTouchStart={event => event.stopPropagation()}
                onKeyPress={this.handleInputKeyPress}
              />
              <input
                ref={ref => (this.estimatedTimeRef = ref)}
                className="TaskField_input TaskField_estimatedTime"
                type="number"
                value={estimatedTimeText}
                placeholder="Estimated time"
                onChange={event => this.setState({ estimatedTimeText: event.target.value })}
                onBlur={event =>
                  this.shouldUpdateTask(task.id, 'estimatedTimeText', event.target.value)
                }
                onKeyPress={event => this.handleInputKeyPress(event, true)}
              />
              <div className="TaskField_buttonsBloc">
                {!check && (
                  <Button onClick={() => this.toggleCheck()} tabIndex="-1">
                    <CheckBoxIcon className="TaskField_addCheckIcon" />
                  </Button>
                )}
                <Button
                  onClick={() => {
                    removeTask(task.id);
                  }}
                  tabIndex="-1"
                >
                  <DeleteForeverIcon className="TaskField_deleteIcon" />
                </Button>
              </div>
            </div>
            {check && (
              <div className="TaskField_mainContainer_bottom">
                <input
                  placeholder="Check"
                  tabIndex="-1"
                  className="TaskField_input TaskField_check"
                  type="text"
                  value={checkValue ? checkValue : ''}
                  onChange={event => this.setState({ checkValue: event.target.value })}
                  onBlur={event => this.shouldUpdateTask(task.id, 'check', event.target.value)}
                />
                <div>
                  <button onClick={() => this.toggleCheck()} tabIndex="-1">
                    Delete check
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
      ),
    );
  }
}

TaskField.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  task: PropTypes.any.isRequired,
  moveCard: PropTypes.func.isRequired,
  removeTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  addTask: PropTypes.func.isRequired,
};

const TaskFieldWrapper = DropTarget('card', cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(
  DragSource('card', cardSource, (connect, monitor) => ({
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))(TaskField),
);

class TaskEditor extends Component {
  state = {
    tasks: this.props.tasks,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ tasks: nextProps.tasks });
  }

  updateTasks = (tasks, skipUpdate) => {
    if (!skipUpdate) {
      this.props.updateTasks(tasks);
    }
    this.setState({ tasks });
  };

  moveCard = (dragIndex, hoverIndex) => {
    const { tasks } = this.state;
    const dragCard = tasks[dragIndex];
    const newTasks = [...tasks];
    newTasks.splice(dragIndex, 1);
    newTasks.splice(hoverIndex, 0, dragCard);
    this.updateTasks(newTasks);
  };

  addTask = skipUpdate => {
    this.updateTasks(
      [...this.state.tasks, { id: uuid(), description: '', problems: '', estimatedTimeText: '' }],
      skipUpdate,
    );
  };

  removeTask = taskId => {
    this.updateTasks([...this.state.tasks.filter(task => taskId !== task.id)]);
  };

  updateTask = (taskId, descriptionValue, estimatedTimeValue, checkValue?) => {
    if (checkValue === undefined) checkValue = null;
    if (
      this.state.tasks.find(task => task.id === taskId)['description'] === descriptionValue &&
      this.state.tasks.find(task => task.id === taskId)['estimatedTimeText'] ===
      estimatedTimeValue &&
      this.state.tasks.find(task => task.id === taskId)['check'] === checkValue
    ) {
      return;
    }
    const fieldsToAdd = {
      description: descriptionValue,
      estimatedTimeText: estimatedTimeValue,
      check: checkValue,
    };
    fieldsToAdd.estimatedTime =
      estimatedTimeValue && estimatedTimeValue.length > 0
        ? estimatedTimeValue * 60 * 1000
        : undefined;
    
    this.updateTasks([
        ...this.state.tasks.map(task => {
          if (task.id === taskId) return { ...task, ...fieldsToAdd };
        return task;
      }),
    ]);   
  };
render() {
  const { tasks } = this.state;
  const { isDefaultTask } = this.props;
  const taskFieldProps = {
    moveCard: this.moveCard,
    removeTask: this.removeTask,
    updateTask: this.updateTask,
    addTask: this.addTask,
    isDefaultTask,
  };          
    return (
    <div className="TaskEditor">
        <div className="DropZone">
          {tasks.map((task, i) => (
            <TaskFieldWrapper key={task.id} index={i} task={task} {...taskFieldProps} />
          ))}
        </div>
        {!isDefaultTask && (
          <div style={{ ...dashedBlocStyle, ...addTaskButtonStyle }} onClick={this.addTask}>
            Add task
          </div>
        )}
      </div>
    );
  }
}

export default TaskEditor;
