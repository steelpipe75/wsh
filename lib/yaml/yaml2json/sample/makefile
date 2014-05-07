CAT = cat
Y2J = ../yaml2json.exe
YAML_SRCS = test.yaml.1 test.yaml.2 test.yaml.3

test.json: test.yaml
	$(Y2J) $< $@

test.yaml: $(YAML_SRCS)
	$(CAT) $^ >$@

