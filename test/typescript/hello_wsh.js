var Greeter = (function () {
    function Greeter(greeting) {
        this.greeting = greeting;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting + " world!";
    };
    return Greeter;
})();
;
var greeter = new Greeter("WSH TypeScript");
var str = greeter.greet();

WScript.Echo(str);
