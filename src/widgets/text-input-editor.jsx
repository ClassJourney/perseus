/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, no-var, react/jsx-closing-bracket-location, react/sort-comp */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

var React = require('react');

var Changeable = require("../mixins/changeable.jsx");
var EditorJsonify = require("../mixins/editor-jsonify.jsx");
var NumberInput = require("../components/number-input.jsx");

/**
 * This is the widget's editor. This is what shows up on the left side
 * of the screen in the demo. Only the question writer sees this.
 */
var TextInputEditor = React.createClass({
    propTypes: {
        ...Changeable.propTypes,
    },

    getDefaultProps: function() {
        return {
            answer: "",
            editDistance: 0,
            gradingRegex: '',
        };
    },

    handleAnswerChange: function(event) {
        this.change({
            answer: event.target.value
        });
    },

    render: function() {
        return <div>
          <div>
            <label>
                Correct answer:
                {' '}
                <input
                    className="perseus-input-size-normal"
                    value={this.props.answer}
                    onChange={this.handleAnswerChange}
                    ref="input" />
            </label>
          </div>
          <div>
            <label>
                with
                {' '}
                <NumberInput
                    className="perseus-input-size-small"
                    value={this.props.editDistance}
                    onChange={(value) => this.change({ editDistance: value })}
                />
                {' '}
                letter tolerance
            </label>
          </div>
          <div>
            <label>
                Alternate grading regex:
                {' /'}
                <input
                    className="perseus-input-size-normal"
                    value={this.props.gradingRegex}
                    onChange={(e) => this.change({ gradingRegex: e.target.value })}
                />
                {'/'}
            </label>
          </div>
        </div>;
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    focus: function() {
        this.refs.input.focus();
        return true;
    },

    serialize() {
        return EditorJsonify.serialize.call(this);
    },
});

module.exports = TextInputEditor;
