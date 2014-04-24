human = {};
human.lastname = "fukuda";
human.firstname = "akinobu";

WScript.Echo( JSON.stringify(human) );

test = JSON.parse('{"hoge":"foo"}');

WScript.Echo( test.hoge );
