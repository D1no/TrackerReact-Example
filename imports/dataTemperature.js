/* This code is not eagerly loaded (needs import) */

/***********************************************************************************************************************
 *
 * [Temperature] Collection & Methods
 * Instantiate Mongo Collection and declare Meteor Methods to be used on the server and the client for controlled,
 * optimistic updates.
 *
 **********************************************************************************************************************/
Temperature = new Mongo.Collection("temperature");

/* Meteor
 On fresh install, when there are no readings available, insert one fixture on the server.
 */
if (Meteor.isServer && Temperature.find().count() <= 0) {
  Temperature.insert({current: 21, created: new Date(), source: "fixture"});
}

/*
 All methods are available to the client and the server. However, within the method blocks functionality can also be
 separated.
 */
Meteor.methods({
  addMeasure (reading = 10, delay = 3) {

    delay = delay > 0 ? delay : 3;
    reading = reading <= 30 ? reading : 30;

    let measure = {
      current: reading,
      created: new Date()
    };

    /*
    On the server, we insert the "source" property as "from Server" and pretend to have a network latency defined by
     the delay argument of the method call.
     */
    if (Meteor.isServer) {
      measure.source = "from Server";
      // Only available on the server. Pause execution for delay.
      Meteor._sleepForMs(delay * 1000);
    } else {
      measure.source = "from Client";
    }

    /*
    The measure is both inserted on the server and optimistically on the client. The server is however always the
     source of truth (correcting optimistic updates; here = source "from server").
     */
    Temperature.insert(measure);
  },
  changeMeasure (amount) {
    if (Meteor.isServer) {

      // Get last result
      let reading = Temperature.findOne({}, {sort: {created: -1}});

      if (typeof reading === "undefined") return;

      const newTemp = Number(reading.current) + Number(amount);
      amount = newTemp <= 30 ? newTemp : 30;

      /*
      Based of the original document _id, the record is updated and re-propagated across all clients.
       */
      Temperature.update({_id: reading._id}, {$set: {current: amount}});

    } else {
      /*
      The client did not do any optimist update.
       */
      console.log("A reading correction was sent to the server.")
    }
  }
});
