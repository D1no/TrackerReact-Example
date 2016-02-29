/* This code only runs on the SERVER */

/***********************************************************************************************************************
 *
 * [Tasks] Collection
 * Instantiate Mongo Collection and publish it to the clients.
 *
 **********************************************************************************************************************/
Tasks = new Mongo.Collection("tasks");

/* Meteor
 The client needs to subscribe to this publication.
 */
Meteor.publish('tasks', function () {
  return Tasks.find({});
});

/* Meteor
 We allow all clients to make changes directly to the collection. But only the server can remove documents.
 Still, any user can update any document. Here are no further auth checks = bad for production. Read up on it online.
 */
Tasks.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return false;
  }
});

/***********************************************************************************************************************
 *
 * [Temperature] Collection
 * Import Meteor Methods incl. instantiating the Mongo Collection and publish it to the clients.
 *
 **********************************************************************************************************************/
import "/imports/dataTemperature";

/* Meteor
 The client needs to subscribe to this publication.
 */
Meteor.publish('temperature', function () {
  return Temperature.find({});
});

/* Meteor
 We allow all clients to make changes directly to the collection. But only the server can remove documents.
 Still, any user can update any document. Here are no further auth checks = bad for production. Read up on it online.
 */
Temperature.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return false;
  }
});