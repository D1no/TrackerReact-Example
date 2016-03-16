/* This code only runs on the CLIENT */

/***********************************************************************************************************************
 *
 * [Set-Up]
 * Import latest npm modules for react and a js style file.
 *
 **********************************************************************************************************************/
import React from 'react';
import ReactDOM from 'react-dom';
import style from './styles';


/***********************************************************************************************************************
 *
 * [Main]
 * This component is rendered to the DOM and encapsulates two React Components: MethodShowcase and
 * CollectionShowcase
 *
 **********************************************************************************************************************/
class Main extends React.Component {

  /* React
   Static methods are a good way to keep the render function clean (as opposed to variable declarations), while
   being able to share static html snippets across instances and other components, without camelcase pollution.
   */
  static header(heading, claim, repo, packageInstall) {
    return (
      <div>
        <h1 style={style.heading}>{heading}</h1>
        <h2 style={style.subHeading}>{claim}</h2>
        <div style={style.install}>
          <a style={style.install.repo} href={repo} target="_blank">GitHub</a> | <span
          style={style.install.bash}>{packageInstall}</span>
        </div>
      </div>
    )
  }

  constructor() {
    super();
    this.state = {
      showCollectionShowcase: true,
      showMethodShowcase: true
    };
  }

  showMethodShowcase() {
    this.setState({showMethodShowcase: !this.state.showMethodShowcase});
  }

  showCollectionShowcase() {
    this.setState({showCollectionShowcase: !this.state.showCollectionShowcase});
  }

  render() {
    return (
      <div className="container">
        {Main.header(
          "TrackerReact",
          "No-Config reactive React Components with Meteor",
          "https://github.com/ultimatejs/tracker-react",
          "meteor add ultimatejs:tracker-react")}
        <div className="wrapper" style={style.content}>
          {this.state.showMethodShowcase ? <MethodShowcase /> : null}
          {this.state.showCollectionShowcase ? <CollectionShowcase /> : null}
        </div>
        <div className="footer">
          <button style={style.button.inverted()} onClick={this.showMethodShowcase.bind(this)} type="button">
            {this.state.showMethodShowcase ? "Unmount" : "Mount"} Method Showcase
          </button>
          <button style={style.button.inverted()} onClick={this.showCollectionShowcase.bind(this)} type="button">
            {this.state.showCollectionShowcase ? "Unmount" : "Mount"} Collection Showcase
          </button>
        </div>
      </div>
    )
  }
}

/* React
 Render into main.html, target the div with id="root". React can live next to other elements inside the main html
 document, i.e. legacy templates/engines.
 */
Meteor.startup(function () {
  ReactDOM.render(<Main/>, document.getElementById('root'));
});


/***********************************************************************************************************************
 *
 * [CollectionShowcase]
 * This component uses TrackerReact to provide real-time data from the "tasks" Meteor Collection.
 * Make sure collections are also instantiated on the server, published and subscribed on the client.
 *
 **********************************************************************************************************************/

/* Meteor
 Install TrackerReact via "meteor add ultimatejs:tracker-react" and import the default composition helper
 "TrackerReact" via Meteors module system (meteor/author:package-name).
 */
import TrackerReact from 'meteor/ultimatejs:tracker-react';

/* Meteor
 Initialise the "tasks" collection on the client. The same is done on the server. See
 "/server/dataPublications.js".
 */
Tasks = new Mongo.Collection("tasks");

/* Meteor, React -> TrackerReact
 In order to have react re-render on data invalidation and update our component, we need to compose it with
 TrackerReact. If we would not do so, everything would still work fine but updates are only shown on page/component
 re-load. -> "TrackerReact(React.Component)"

 Profiler: Set {profiler: false} to turn profile logs off. If not used, this second argument can be omitted.
 */
class CollectionShowcase extends TrackerReact(React.Component) {

  /* Meteor, React
   In this example, the Meteor data is only used inside this react component. Therefore, no active data subscription
   exists up on rendering this component. To make sure we have all the necessary data up on rendering, we subscribe
   to our data when the component is about to render.

   The "constructor()" method is called before rendering and therefore a good place to start our subscription. We
   could also subscribe outside of the react life cycle, i.e., simply at the beginning of the page.
   */
  constructor() {
    super();
    /* React
     Data subscription(s) define our state (availability of data), so it should also be assigned to it (return object).
     */
    this.state = {
      subscription: {
        tasks: Meteor.subscribe('tasks')
      }
    }
  }

  /* Meteor, React
   Since we are not planning to use this data anywhere else, we will stop the subscription when the component unmounts.
   */
  //noinspection JSUnusedGlobalSymbols
  componentWillUnmount() {
    this.state.subscription.tasks.stop();
  }

  /* Meteor, React
   As mentioned before, data subscriptions define state. Therefore we can toggle subscriptions and assign new ones.
   This method could also be made static'aly available and passed around for generic subscription management. However,
   within the same component tree, a state-handler should be passed around instead.
   */
  toggleSubscription(publication) {
    let subscription = this.state.subscription[publication];

    if (subscription.ready()) {
      subscription.stop()
    } else {
      this.setState({subscription: {tasks: Meteor.subscribe(publication)}})
    }
  }

  /* Meteor, React
   An object array is simply returned from our collection. With TrackerReact, any changes to the underlying will lead
   to an automatic component re-render with a new return value -> virtual dom diffing -> dom update.
   */
  //noinspection JSMethodCanBeStatic
  tasks() {
    return Tasks.find().fetch().reverse();
  }

  handleTasksInsert(e) {
    e.preventDefault();

    /* Meteor
     Client-side inserts - due to our allowed auth settings - will propagate from the client, to the server
     and to other clients automatically.
     */
    Tasks.insert({
      title: this.refs["todoTitle"].value || "No Title",
      text: this.refs["todoText"].value || "No Message Text"
    });
  }

  render() {
    return (
      <div className="right collection">
        <div className="intro">
          <h3 style={style.content.heading}>Reactive Data</h3>
          <p style={style.content.intro}>Subscribe to <span style={{fontStyle: "italic"}}>Meteor Collections</span> and
            see real-time updates. Open this
            page in another browser window and save a new todo message to the "todos" collection.</p>
        </div>
        <form action="" onSubmit={this.handleTasksInsert.bind(this)}>
          <input style={style.input} ref="todoTitle" type="text" placeholder="Title"/>
          <input style={style.input} ref="todoText" type="text" placeholder="Message"/>
          <button style={style.button} type="submit">Save to Collection</button>
          <button style={style.button.last()} onClick={this.toggleSubscription.bind(this, "tasks")} type="button">
            {this.state.subscription.tasks.ready() ? "Stop Subscription" : "Start Subscription"}
          </button>
        </form>
        <ol reversed style={style.collection.olList}>
          {this.tasks().map((task) => {
            return <Task key={task._id} task={task}/>
          })}
        </ol>
      </div>
    )
  }
}

/* React
 A generic react component can be simply used within a TrackerReact component.
 */
class Task extends React.Component {
  render() {
    return (
      <li style={style.todo}>
        <div style={style.todo.title}>{this.props.task.title} </div>
        <div style={style.todo.text}>{this.props.task.text} </div>
      </li>
    )
  }
}


/***********************************************************************************************************************
 *
 * [MethodShowcase]
 * This component uses Meteor Methods to invoke collection changes on the server side. Changes are
 * optimistically applied on the client until the server either confirms or discards the change (i.e. due to missing
 * authentication). Here for, the method needs to be both defined on the server and the client (stub simulation).
 *
 **********************************************************************************************************************/

/* Meteor
 The relevant Methods and the "temperature" collection is defined in this file. It is in an external file, so that it
 can be easily imported on the server as well. See "/server/dataPublications.js".
 */
import "/imports/dataTemperature";

/* React
 We use a simple react component from npm to illustrate reactivity and optimistic updates.
 Source: https://www.npmjs.com/package/react-thermometer
 */
import Thermometer from "react-thermometer";

/* Meteor, React -> TrackerReact
 Here the mixin method is used (scroll to the end of the file). Real-time data-invalidation due to optimistic updates.
 -> "ReactMixin(MethodShowcase.prototype, TrackerReactMixin);"
 */
import ReactMixin from 'react-mixin';
import {TrackerReactMixin} from 'meteor/ultimatejs:tracker-react';

class MethodShowcase extends React.Component {

  /* Meteor, React
   Same reasoning as before. See above [CollectionShowcase].
   */
  constructor() {
    super();

    this.state = {
      subscription: {
        temperature: Meteor.subscribe('temperature')
      }
    }
  }

  /* Meteor, React
   Same reasoning as before. See above [CollectionShowcase].
   */
  //noinspection JSUnusedGlobalSymbols
  componentWillUnmount() {
    this.state.subscription.temperature.stop();
  }

  /* Meteor
   FindOne returns the last document object added to the "temperature" collection. Note that we are returning a
   loading stub for when the data is not loaded yet. With TrackerReact, loading indicators can be implicit to data
   availability and is not limited to whole subscriptions.
   */
  //noinspection JSMethodCanBeStatic
  temperature() {
    return Temperature.findOne({}, {sort: {created: -1}}) || {current: 0, source: "loading"};
  }

  /* Meteor
   Before we inserted data directly into a client side collection which propagated itself to the server. Here, a
   Meteor Method is "called" to trigger an insert on the server. But the method is also available on the client,
   allowing for an optimistic update of data.

   In the end, the data inserted on the server slightly diverts with a different "source" property. As soon the
   server caught up, the optimistic data of the client is corrected by the data on the server (source changed from
   client to server). Despite any network latency.

   See "/server/dataPublications.js".
   */
  handleTemperatureReading(e) {
    e.preventDefault();

    let reading = this.refs["reading"].value;
    let delay = this.refs["delay"].value;

    if (reading >= 0 && reading <= 30) {
      Meteor.call("addMeasure", reading, delay);
    }
  }

  /* Meteor
   A Meteor Method that only runs on the server, without optimistic updates, changing the last reading
   on the server's mongo collection.

   See "/server/dataPublications.js".
   */
  //noinspection JSMethodCanBeStatic
  changeTemperature(amount) {
    Meteor.call("changeMeasure", amount);
  }

  render() {
    return (
      <div className="left method">
        <div className="intro">
          <h3 style={style.content.heading}>Optimistic Updates</h3>
          <p style={style.content.intro}>Make use of <span style={{fontStyle: "italic"}}>Meteor Methods</span>. Simulate
            different network latencies below and observe how
            data changes are first applied client side, than confirmed server side.</p>
        </div>
        <form action="" onSubmit={this.handleTemperatureReading.bind(this)}>
          <input style={style.input} ref="reading" type="number" placeholder="Set Temperature (min 0, max 30)"/>
          <input style={style.input} ref="delay" type="number" placeholder="Network Latency in Seconds (Default 3)"/>
          <button style={style.button} type="submit">Trigger Method</button>
          <button style={style.button} onClick={this.changeTemperature.bind(null, -1)} type="button">-1</button>
          <button style={style.button.last()} onClick={this.changeTemperature.bind(null, 1)} type="button">+1</button>
        </form>
        <div className="thermometer" style={style.method.thermometer}>
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
    )
  }
}

ReactMixin(MethodShowcase.prototype, TrackerReactMixin);
