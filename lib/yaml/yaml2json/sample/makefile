CAT = type
Y2J = ../yaml2json.exe
YAML_SRCS = test1.yaml test2.yaml test3.yaml

test.json: test.yaml
	$(Y2J) $** $@

test.yaml: $(YAML_SRCS)
	$(CAT) $** >$@

