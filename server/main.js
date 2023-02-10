const { StorageNedbApi } = require("./cc-server/storage-nedb.js");
const { Core } = require("./cc-server/core.js");
const fssync = require('fs');

var options = {
    checkListPermission : (oInfo, type) => {
        if (type == "test1") {
            throw "Not allowed!"
        }
    },
};

var authStorage = new StorageNedbApi(["users", "sessions"], options)
var authPlugin = new AuthSimplePlugin(authStorage, "users", "sessions");

var core = new Core();
core.authPlugin = authPlugin;

var storage = new StorageNedbApi(["test1", "test2"], options)
core.storages.push(storage);

var mapping = [
    { hosts: [], urlprefix: "/core1", core : core },
    
    { hosts: [], exacturl: "/", staticfile : "../client/index.html"},
    { hosts: [], urlprefix: "/", staticfile : "../client"},
];

var webserverinstance1 = null;
var webserverinstance2 = null;
webserverinstance1 = core.createWebServer1('0.0.0.0', 80, null, null, null, mapping);
if (fssync.existsSync("privkey.pem") && fssync.existsSync("fullchain.pem")) {
    webserverinstance2 = core.createWebServer1('0.0.0.0', 443, "privkey.pem", "fullchain.pem", null, mapping);
}
