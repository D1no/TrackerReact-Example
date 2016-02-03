'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import invariant from 'invariant';

import createMemoryHistory from './createMemoryHistory';
import createTransitionManager from './createTransitionManager';
import { createRoutes } from './RouteUtils';
import { createRouterObject, createRoutingHistory } from './RouterUtils';

/**
 * A high-level API to be used for server-side rendering.
 *
 * This function matches a location to a set of routes and calls
 * callback(error, redirectLocation, renderProps) when finished.
 *
 * Note: You probably don't want to use this in a browser. Use
 * the history.listen API instead.
 */
function match(_ref, callback) {
  var history = _ref.history;
  var routes = _ref.routes;
  var location = _ref.location;

  var options = _objectWithoutProperties(_ref, ['history', 'routes', 'location']);

  !location ? process.env.NODE_ENV !== 'production' ? invariant(false, 'match needs a location') : invariant(false) : undefined;

  history = history ? history : createMemoryHistory(options);
  var transitionManager = createTransitionManager(history, createRoutes(routes));

  // Allow match({ location: '/the/path', ... })
  if (typeof location === 'string') location = history.createLocation(location);

  var router = createRouterObject(history, transitionManager);
  history = createRoutingHistory(history, transitionManager);

  transitionManager.match(location, function (error, redirectLocation, nextState) {
    callback(error, redirectLocation, nextState && _extends({}, nextState, { history: history, router: router }));
  });
}

export default match;