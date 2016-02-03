// Vanilla React from npm. Check package.json for more details
import React from 'react';
import ReactMixin from 'react-mixin';
import ReactDOM from 'react-dom';

// TrackerReact is importated with new module system
import TrackerReact from 'meteor/ultimatejs:tracker-react';

// Get the Collection
Tasks = new Mongo.Collection("tasks");

// Task Item
class Task extends React.Component {
  render(){
    return(
      <li>
        <span>{this.props.task.title + " - " + this.props.task.text} </span>
      </li>
    )
  }
}

// Main To-Do List
class Main extends React.Component {

  // Don't need subscription etc. because auto-publish and insecure are included
  tasks() {
    return Tasks.find().fetch();
  }

  render(){
    return(
      <div>
        <h1>Hello World</h1>
        <ul>
          {this.tasks().map((task) => {
            return <Task key={task._id} task={task}/>
          })}
        </ul>
      </div>
    )
  }
}
// Using ReactMixin because ES7 decorators are not available in meteor, ecmascript
ReactMixin(Main.prototype, TrackerReact);

// Render to HTML
Meteor.startup(function(){
  // Render app into root div
  ReactDOM.render(<Main/>, document.getElementById('root'));
});