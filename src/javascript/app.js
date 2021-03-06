/**
* Licensed to the Symphony Software Foundation (SSF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The SSF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
**/

// Create our own local service pertaining to the application module
// We have namespaced local services with "hello:"

var helloAppService = SYMPHONY.services.register("pwmDemo:app");

var $ = require('jquery');
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}
var email = $.urlParam('email'); 

var alert = $.urlParam('alert');
console.log(alert);
if(alert=='false'){
    $(".red-badge").text("GREEN");
    $(".red-badge").removeClass("badge-danger");
    $(".red-badge").addClass("badge-success");
    $(".row-btn").text("N/A");
}


SYMPHONY.remote.hello().then(function(data) {

 
    

    // Set the theme of the app module
    var themeColor = data.themeV2.name;
    var themeSize = data.themeV2.size;
    // You must add the symphony-external-app class to the body element
    document.body.className = "symphony-external-app " + themeColor + " " + themeSize;

    SYMPHONY.application.connect("pwmDemo", ["ui"], ["pwmDemo:app"]).then(function(response) {
        // The userReferenceId is an anonymized random string that can be used for uniquely identifying users.
        // The userReferenceId persists until the application is uninstalled by the user. 
        // If the application is reinstalled, the userReferenceId will change.
        var userId = response.userReferenceId;
        
        // Subscribe to Symphony's services
        var uiService = SYMPHONY.services.subscribe("ui");

        // UI: Listen for theme change events
        uiService.listen("themeChangeV2", function() {
            SYMPHONY.remote.hello().then(function(theme) {
                themeColor = theme.themeV2.name;
                themeSize = theme.themeV2.size;
                document.body.className = "symphony-external-app " + themeColor + " " + themeSize;
            });
        });

        var linkButton = document.getElementById("link");
        linkButton.addEventListener("click", function(){
            location.href = "summary.html?email="+email;
        });



        console.log($.url().param('confirm'));
    }.bind(this))
}.bind(this));
