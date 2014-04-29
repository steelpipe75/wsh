human = {};
human.lastname = "fukuda";
human.firstname = "akinobu";

WScript.Echo( WSH_YAML.stringify(human) );

test = WSH_YAML.parse('{hoge:"foo"}');

WScript.Echo( test.hoge );
