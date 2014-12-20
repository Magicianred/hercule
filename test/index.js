// Generated by CoffeeScript 1.8.0
(function() {
  var assert, hercule;

  assert = require('assert');

  hercule = require('../lib/transclude');

  describe('hercule', function() {
    describe('scan', function() {
      it('should detect whitespace on the first line of a file', function() {
        var document;
        document = "\t{{test}}";
        return hercule.scan(document, "", null, function(err, placeholders, dependencies) {
          return assert.equal(dependencies.test.whitespace, "\t");
        });
      });
      return it('should detect different types of leading whitespace', function() {
        var document, scenario, whitespace, whitespaceScenarios;
        document = "# Heading 1\n";
        whitespaceScenarios = {
          tab: "\t",
          two: " ",
          mixed: "  \t "
        };
        for (scenario in whitespaceScenarios) {
          whitespace = whitespaceScenarios[scenario];
          document += "" + whitespace + "{{" + scenario + "}}\n";
        }
        return hercule.scan(document, "", null, function(err, placeholders, dependencies) {
          var _results;
          _results = [];
          for (scenario in whitespaceScenarios) {
            whitespace = whitespaceScenarios[scenario];
            _results.push(assert.equal(dependencies[scenario].whitespace, "" + whitespace));
          }
          return _results;
        });
      });
    });
    describe('parse', function() {
      it('should parse references', function() {
        var expectedParameters, parameterScenario;
        parameterScenario = ["placeholder:filename.md"];
        expectedParameters = {
          placeholder: "filename.md"
        };
        return hercule.parse(parameterScenario, "", null, function(err, parsedParameters) {
          return assert.deepEqual(parsedParameters, expectedParameters);
        });
      });
      it('should parse multiple references', function() {
        var expectedParameters, parameterScenario;
        parameterScenario = ["placeholder:filename.md", "legal:legal/common.md"];
        expectedParameters = {
          placeholder: "filename.md",
          legal: "legal/common.md"
        };
        return hercule.parse(parameterScenario, "", null, function(err, parsedParameters) {
          return assert.deepEqual(parsedParameters, expectedParameters);
        });
      });
      return it('should parse references relative to the parent', function() {
        var documendDirectory, expectedParameters, parameterScenario;
        parameterScenario = ["fruit:apple.md", "footer:../common/footer.md"];
        documendDirectory = "customer/farmers-market";
        expectedParameters = {
          placeholder: "apple.md",
          footer: "common/footer.md"
        };
        return hercule.parse(parameterScenario, "", null, function(err, parsedParameters) {
          return assert.deepEqual(parsedParameters, expectedParameters);
        });
      });
    });
    return describe('circularReferences', function() {
      it('should not be found when there are no references', function() {
        return hercule.circularReferences("file.md", null, null, function(err) {
          return assert.equal(err, null);
        });
      });
      it('should detect circular references', function() {
        var parents;
        parents = ["document.md", "contents.md", "file.md"];
        return hercule.circularReferences("file.md", parents, null, function(err) {
          return assert.notEqual(err, null);
        });
      });
      return it('should prevent circular parameterised references', function() {
        var parameters, parents;
        parents = ["contents.md"];
        parameters = {
          header: "header.md",
          footer: "footer.md",
          extend: "file.md"
        };
        return hercule.circularReferences("file.md", parents, parameters, function(err) {
          return assert.notEqual(err, null);
        });
      });
    });
  });

}).call(this);
