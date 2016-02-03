Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
  Tasks.insert({title: "Test", text: "A test Text"});
  Tasks.insert({title: "Test 2", text: "A test Text 2"});
  Tasks.insert({title: "Test 3", text: "A test Text 3"});
}