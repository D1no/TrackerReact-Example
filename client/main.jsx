// Vanilla React from npm. Check package.json for more details
import React from 'react';
//import ReactMixin from 'react-mixin';
import ReactDOM from 'react-dom';
import style from './styles';
import Thermometer from "react-thermometer";

// TrackerReact is imported with new module system
import TrackerReact from 'meteor/ultimatejs:tracker-react';

// Get the Tasks Collection
Tasks = new Mongo.Collection("tasks");

// Get the Temperature Collections
import "/imports/dataTemperature";

// Task Item
class Task extends React.Component {
  render(){
    return(
      <li style={style.todo}>
        <div style={style.todo.title}>{this.props.task.title} </div>
        <div style={style.todo.text}>{this.props.task.text} </div>
      </li>
    )
  }
}

// Main To-Do List
class Main extends TrackerReact(React.Component){

  // Don't need subscription etc. because auto-publish and insecure are included
  tasks() {
    return Tasks.find().fetch().reverse();
  }

  handleTasksInsert(e) {
    e.preventDefault();

    Tasks.insert({
      title: this.refs["todoTitle"].value,
      text: this.refs["todoText"].value
    });
  }

  temperature() {
    return Temperature.findOne({}, {sort: {created: -1}});
  }

  handleTemperatureReading(e) {
    e.preventDefault();

    let reading = this.refs["reading"].value;
    let delay = this.refs["delay"].value;

    if(reading > 0 || reading >= 30 ) {
      Meteor.call("addMeasure", reading, delay);
    }
  }

  changeTemperature(amount) {
    Meteor.call("changeMeasure", amount);
  }

  render(){
    return(
      <div style={style.container}>
        <h1 style={style.heading}>TrackerReact Example</h1>
        <div style={style.content}>
          <div style={style.method}>
            <form action="" onSubmit={this.handleTemperatureReading.bind(this)}>
              <input style={style.input} ref="reading" type="number" placeholder="Set Temperature (min 1, max 30)"/>
              <input style={style.input} ref="delay" type="number"    placeholder="Network Latency in Seconds (Default 3)"/>
              <button style={style.button} type="submit">Trigger Method</button>
              <button style={style.button} onClick={this.changeTemperature.bind(null, -1)} type="button">-1</button>
              <button style={style.button} onClick={this.changeTemperature.bind(null, 1)} type="button">+1</button>
            </form>
            <div style={style.method.thermometer}>
              <Thermometer
                min={0}
                max={30}
                width={20}
                height={300}
                backgroundColor={'#CCC'}
                fillColor={'#CA1919'}
                current={this.temperature().current}
              />
            </div>
            <div style={style.method.label}>{this.temperature().current + "° Celsius"}</div>
            <div style={style.method.subLabel}>{"( " + this.temperature().source + " )"}</div>
          </div>
          <div style={style.collection}>
            <form action="" onSubmit={this.handleTasksInsert.bind(this)}>
              <input style={style.input} ref="todoTitle" type="text" placeholder="Title"/>
              <input style={style.input} ref="todoText" type="text" placeholder="Message"/>
              <button style={style.button} type="submit">Save to Collection</button>
            </form>
            <ol reversed style={style.collection.olList}>
              {this.tasks().map((task) => {
                return <Task key={task._id} task={task}/>
              })}
            </ol>
          </div>
        </div>
      </div>
    )
  }
}
// Using ReactMixin because ES7 decorators are not available in meteor, ecmascript
// ReactMixin(Main.prototype, TrackerReactMixin);

// Render to HTML
Meteor.startup(function(){
  // Render app into root div
  ReactDOM.render(<Main/>, document.getElementById('root'));
});