
requirejs.config({
    baseUrl: '../build/',
    paths: {
        build: '../build/',
        'bluebird': '../lib/bluebird/js/browser/bluebird',
        'jquery': '../lib/jquery/jquery.min',
        'eventemitter':'../lib/eventEmitter/EventEmitter',
    },
    shim: {
        jquery: {
            exports: '$'
        },
    }
});

requirejs([
    'jquery',
    'bluebird',
    './jsui'
], function ($, Promise, jsuiApp) {

    

});



