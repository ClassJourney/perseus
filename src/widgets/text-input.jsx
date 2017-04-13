/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, no-var, react/jsx-closing-bracket-location, react/prop-types, react/sort-comp */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/**
 * This is a simple text-entry widget
 * It is not as powerful as number-input, but has a simpler, more
 * representative structure as an example widget, and is easier to
 * test new ideas on.
 */

var React = require('react');
var Changeable = require("../mixins/changeable.jsx");
var _ = require("underscore");

var calcEditDistance = require('damerau-levenshtein');

var TextInput = React.createClass({
    render: function() {
        return <input
            ref="input"
            value={this.props.value || ""}
            onChange={this.changeValue} />;
    },

    focus: function() {
        this.refs.input.focus();
        return true;
    },

    changeValue: function(e) {
        // Translating from the js event e to the value
        // of the textbox to send to onChange
        this.props.onChange(e.target.value);
    }
});

/**
 * This is the widget's renderer. It shows up in the right column
 * in the demo, and is what is visible to users, and where
 * users enter their answeranswers.
 */
var TextInputWidget = React.createClass({
    propTypes: {
        ...Changeable.propTypes,
        value: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            value: ""
        };
    },

    /**
     * Tell our parent to update our props.
     */
    change(...args) {
        return Changeable.change.apply(this, args);
    },

    render: function() {
        return <TextInput
            ref="input"
            value={this.props.value}
            onChange={this.change("value")} />;
    },

    getUserInput: function() {
        return this.props.value;
    },

    /**
     * Widgets that are focusable should add a focus method that returns
     * true if focusing succeeded. The first such widget found will be
     * focused on page load.
     */
    focus: function() {
        this.refs.input.focus();
        return true;
    },

    /**
     * simpleValidate is called for grading. Rubric is the result of calling
     * getUserInput() on the editor that created this widget.
     *
     * Should return an object representing the grading result, such as
     * {
     *     type: "points",
     *     earned: 1,
     *     total: 1,
     *     message: null
     * }
     */
    simpleValidate: function(rubric) {
        return TextInputWidget.validate(this.getUserInput(), rubric);
    }
});


/**
 * This is the widget's grading function
 */
_.extend(TextInputWidget, {
    /**
     * simpleValidate generally defers to this function
     *
     * value is usually the result of getUserInput on the widget
     * rubric is the result of calling serialize() on the editor
     */
    validate: function(value, rubric) {
        if (value === "" || value == null) {
            return {
                type: "invalid",
                message: "It looks like you haven't answered all of the " +
                    "question yet."
            };
        }

        const editDistance = calcEditDistance(rubric.answer, value).steps;

        let correct = (editDistance <= rubric.editDistance);

        if (!correct && rubric.gradingRegex) {
            const rubricRegex = new RegExp(rubric.gradingRegex);
            correct = rubricRegex.test(value);
        }

        if (correct) {
            return {
                type: "points",
                earned: 1,
                total: 1,
                message: null
            };
        } else {
            return {
                type: "points",
                earned: 0,
                total: 1,
                message: null
            };
        }
    }
});

/**
 * For this widget to work, we must require() this file in src/all-widgets.js
 */
module.exports = {
    name: "text-input",
    displayName: "Text Input",

    // Tell the renderer what type of `display:` style we would like
    // for the component wrapping this one.
    defaultAlignment: "inline-block",

    hidden: false,   // Hides this widget from the Perseus.Editor widget select
    widget: TextInputWidget,
};
