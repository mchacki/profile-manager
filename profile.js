/*jslint indent: 2, nomen: true, maxlen: 100 */
/*global require, applicationContext */

////////////////////////////////////////////////////////////////////////////////
/// @brief A user profile management Foxx  written for ArangoDB and Angular JS
///
/// @file
///
/// DISCLAIMER
///
/// Copyright 2010-2012 triagens GmbH, Cologne, Germany
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// Copyright holder is triAGENS GmbH, Cologne, Germany
///
/// @author Michael Hackstein
/// @author Copyright 2011-2013, triAGENS GmbH, Cologne, Germany
////////////////////////////////////////////////////////////////////////////////

(function () {
  "use strict";
  var Foxx = require("org/arangodb/foxx"),
    ArangoError = require("org/arangodb").ArangoError,
    Profiles = require("./repositories/profiles").Repository,
    Profile = require("./models/profile").Model,
    _ = require("underscore"),
    joi = require("joi"),
    controller,
    profiles;
  controller = new Foxx.Controller(applicationContext);

  profiles = new Profiles(applicationContext.collection("profiles"), {
    model: Profile
  });

  /** Lists of all Profiles
   *
   * This function simply returns the list of all profiless.
   */
  controller.get('/user', function (req, res) {
    res.json(_.map(profiles.all(), function (p) {
      return p.forClient();
    }));
  });

  /** List a specific profiles
   *
   * This function returns detailed information of one profile.
   */
  controller.get('/user/:id', function (req, res) {
    var id = req.params("id");
    res.json(profiles.byId(id).forClient());
  }).pathParam("id", {
    description: "The id of the profile",
    type: joi.string()
  });

  /** Creates a new Profile
   *
   * Creates a new user profile. The information has to be in the
   * requestBody.
   */

  controller.post('/user', function (req, res) {
    var user = req.params("user");
    res.json(profiles.save(user));
  }).bodyParam("user", {
    description: "The profile you want to create", 
    type: Profile
  });

  /** Updates a Profile
   *
   * Changes a Profile-Item. The information has to be in the
   * requestBody.
   */

  controller.put("/user/:id", function (req, res) {
    var id = req.params("id"),
      user = req.params("user");
    res.json(profiles.replaceById(id, user));
  }).pathParam("id", {
    description: "The id of the profile",
    type: joi.string()
  }).bodyParam("user", {
    description: "The Profile you want your old one to be replaced with", 
    type: Profile
  });

  /** Removes a Profile
   *
   * Removes a Profile document.
   */

  controller.del("/user/:id", function (req, res) {
    var id = req.params("id");
    profiles.removeById(id);
    res.json({ success: true });
  }).pathParam("id", {
    description: "The ID of the profile.",
    type: joi.string()
  }).errorResponse(ArangoError, 404, "The document could not be found");
}());
