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
  backgroundColor: 'white',
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
  constructor(props){
    super(props);
    this.state= {check: props.task.check !== undefined};
    this.toggleCheck = this.toggleCheck.bind(this);
    this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
    this.resizeDescriptionField = this.resizeDescriptionField.bind(this);
  }
  toggleCheck() {
    const {
      task,
      updateTask,
    } = this.props;
    if (this.state.check) {
      updateTask(task.id, 'check', undefined);
      this.setState({check: false});
    } else {
      this.setState({check: true});
    }
  }
  handleInputKeyPress(event, addNewTask = false){
    if (event.which === 13) {
      event.preventDefault();
      if (addNewTask) this.props.addNewTask();
      else this.estimatedTimeRef.focus();
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.task && this.props.task.label !== prevProps.task.label) {
      this.resizeDescriptionField();
    }
  }
  componentDidMount(){
    this.resizeDescriptionField();
  }
  shouldComponentUpdate(nextProps, prevState) {
    if (nextProps.task.label === this.props.task.label
        && nextProps.task.estimatedTimeText === this.props.task.estimatedTimeText
        && prevState.check === this.state.check)
      return false;
    return true;
  }
  resizeDescriptionField(){
    this.descriptionField.style.height = '5px';
    this.descriptionField.style.height = (this.descriptionField.scrollHeight)+'px';
  }
  render() {
    const {
      task,
      isDragging,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
      removeTask,
      updateTask,
    } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragPreview(connectDropTarget(
      <div style={{ ...dashedBlocStyle, ...taskFieldStyle, opacity }}>
        {connectDragSource(
          <div className="TaskField_dragPoint">
            <IconButton disableRipple={true} style={{height: 36, width: 36, cursor: 'move'}} tabIndex="-1">
              <DragHandleIcon />
            </IconButton>
          </div>
        )}
        <div className="TaskField_mainContainer">
          <div className="TaskField_mainContainer_top">
            <textarea
              ref={(ref) => this.descriptionField = ref}
              autoFocus={!task.label}
              className="TaskField_input TaskField_description"
              type="text"
              value={task.label}
              placeholder="Description"
              onChange={(event) => updateTask(task.id, 'label', event.target.value)}
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              onKeyPress={this.handleInputKeyPress}
            />
            <input
              ref={(ref) => this.estimatedTimeRef = ref}
              className="TaskField_input TaskField_estimatedTime"
              type="number"
              value={task.estimatedTimeText}
              placeholder="Estimated time"
              onChange={(event) => updateTask(task.id, 'estimatedTimeText', event.target.value)}
              onKeyPress={(event) => this.handleInputKeyPress(event, true)}
            />
            <div className="TaskField_buttonsBloc">
              {
                !this.state.check &&
                  <Button onClick={() => this.toggleCheck()} tabIndex="-1">
                    <CheckBoxIcon className="TaskField_addCheckIcon" />
                  </Button>
              }
              <Button onClick={() => removeTask(task.id)} tabIndex="-1">
                <DeleteForeverIcon className="TaskField_deleteIcon" />
              </Button>
            </div>
          </div>
          {
            this.state.check &&
              <div className="TaskField_mainContainer_bottom">
                <input
                  placeholder="Check"
                  tabIndex="-1"
                  className="TaskField_input TaskField_check"
                  type="text"
                  value={task.check}
                  onChange={(event) => updateTask(task.id, 'check', event.target.value)} />
                <div>
                  <button onClick={() => this.toggleCheck()} tabIndex="-1">Delete check</button>
                </div>
              </div>
          }
        </div>
      </div>
    ));
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
  addNewTask: PropTypes.func.isRequired,
};


const TaskFieldWrapper = DropTarget('card', cardTarget, connect => ({connectDropTarget: connect.dropTarget()}))(
  DragSource('card', cardSource, (connect, monitor) => ({connectDragPreview: connect.dragPreview(),connectDragSource: connect.dragSource(),isDragging: monitor.isDragging()}))(TaskField)
);

class TaskEditor extends Component {
  constructor(props){
    super(props);
    this.updateTasks = this.updateTasks.bind(this);
    this.moveCard = this.moveCard.bind(this);
    this.addTask = this.addTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
  }
  updateTasks(tasks){
    this.props.updateTasks(tasks);
  }
  moveCard(dragIndex, hoverIndex) {
    const { tasks } = this.props;
    const dragCard = tasks[dragIndex];
    const newTasks = [...tasks];
    newTasks.splice(dragIndex, 1);
    newTasks.splice(hoverIndex, 0, dragCard);
    this.updateTasks(newTasks);
  }
  addTask() {
    this.updateTasks([...this.props.tasks, {id:uuid(), label:'', problems: '', estimatedTimeText: '', checks:['mon check']}]);
  }
  removeTask(taskId) {
    this.updateTasks([...this.props.tasks.filter((task) => taskId !== task.id)]);
  }
  updateTask(taskId, fieldName, value) {
    const fieldsToAdd = {[fieldName]: value };
    if(fieldName === 'estimatedTimeText')
      fieldsToAdd.estimatedTime = value && value.length > 0 ? value * 60 * 1000 : undefined;

    this.updateTasks([...this.props.tasks.map((task)=> {
      if (task.id===taskId) return { ...task, ...fieldsToAdd };
      return task;
    })]);
  }
  render() {
    return (
      <div className="TaskEditor">
        <div className="DropZone">
          {this.props.tasks.map((task, i) => (
            <TaskFieldWrapper
              key={task.id}
              index={i}
              task={task}
              moveCard={this.moveCard}
              removeTask={this.removeTask}
              updateTask={this.updateTask}
              addNewTask={this.addTask}
            />
          ))}
        </div>
        <div style={{ ...dashedBlocStyle, ...addTaskButtonStyle }} onClick={this.addTask}>Add task</div>
      </div>
    );
  }
}

export default TaskEditor;
