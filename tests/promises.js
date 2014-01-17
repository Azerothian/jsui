
requirejs.config({
    baseUrl: '../build/',
    paths: {
        build: '../build/',
        'bluebird': '../lib/bluebird/js/browser/bluebird',
        'jquery': '../lib/jquery/jquery.min',
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
    'lib/promises'
], function ($, Promise, Promises) {

    var arr = new Promises();
    for(var i = 0; i < 20; i++)
    {
        arr.push(process, this, [i]);
    }

    arr.chain().then(success, failed);
    //alert("started");

    function process(i)
    {
        return new Promise(
        function(resolve, reject) { 
            console.log(i); 
            
            var s = 0;
            for(var x = 0; x < i * 1000; x++)
            {
                s++;
            }
            return resolve(); 
        })
    }

});

function success()
{
    console.log("RESOLVED");
}
function failed() 
{
    console.log("REJECTED");
}




