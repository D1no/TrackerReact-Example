Temperature = new Mongo.Collection("temperature");

if(Temperature.find().count() <= 0) {
  Temperature.insert({current: 21, created: new Date(), source: "fixture"});
}

Meteor.methods({
  addMeasure (reading = 10, delay = 3) {

    delay = delay > 0 ? delay : 3;

    let measure = {
      current: reading,
      created: new Date()
    };

    if (Meteor.isServer) {
      measure.source = "from Server";
      // Wait for amount of delay
      Meteor._sleepForMs(delay * 1000);
    } else {
      measure.source = "from Client";
    }

    Temperature.insert(measure);
  },
  changeMeasure (amount) {

    if (Meteor.isServer) {

      let reading = Temperature.findOne({}, {sort: {created: -1}});

      if(typeof reading === "undefined") return;

      amount = Number(reading.current) + Number(amount);

      Temperature.update({_id: reading._id}, {$set: {current: amount}});

    } else {
      console.log("Correction of last result on the way to the server.")
    }
  }
});
