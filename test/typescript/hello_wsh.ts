class Greeter {
    constructor(public greeting: string) { }
    greet() {
        return "Hello, " + this.greeting + " world!";
    }
};
var greeter = new Greeter("WSH TypeScript");
var str = greeter.greet();

WScript.Echo(str);
