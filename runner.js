'use strict';

var runnerdefaultLayout = {
    nodeSpacingH: 120,
    nodeSpacingV: 70,
    nodeRadius: 12.5,
    innerDotRadius: 9.3,
    placeholderRadius: 11,
    startRadius: 7.5,
    curveRadius: 12,
    connectorStrokeWidth: 3.2,
    addStrokeWidth: 1.7,
    labelOffsetV: 25,
    smallLabelOffsetV: 20,
    ypStart: 90
};

// RenderPipeline Render pipeline SVG
// Params:
// data: pipeline json data
// scale: svg scale
// nodeClickCallback: call back on click node func(node_id)
// Return: ReactElement
function RunnerRenderPipeline(data, scale, nodeClickCallback, sel_stag_index, sel_action_index) {
    return RunnerRenderOutline(RunnerRenderSvg(data, RunnerRenderLineElements(data), RunnerRenderSelection(sel_stag_index, sel_action_index), RunnerRenderNodeElements(data, nodeClickCallback)), RunnerRenderLabelElements(data), scale);
}

// Render DIV outline
// svg: input svg react element
function RunnerRenderOutline(svg, label, scale) {
    var divStyle = {
        position: 'relative',
        overflow: 'visible',
        margin: '30px auto',
        transform: "scale(" + scale.toString() + ")"
    };
    return React.createElement(
        'div',
        { className: 'pipeline-editor' },
        React.createElement(
            'div',
            { style: divStyle },
            svg,
            label
        )
    );
}

// Render Svg Element
// Input: react element array
// combine all element in svgContainer
// Return: svg element
function RunnerRenderSvg(data, HighLight, LineElements, NodeElements) {
    // +2 means : start and tail place holder
    var x_length = 0.5 * runnerdefaultLayout.nodeSpacingH + (data.length + 1) * runnerdefaultLayout.nodeSpacingH;
    var y_length = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].actions.length > y_length) {
            y_length = data[i].actions.length;
        }
    }
    y_length = runnerdefaultLayout.ypStart + y_length * runnerdefaultLayout.nodeSpacingV + 2 * runnerdefaultLayout.nodeRadius;
    return React.createElement(
        'svg',
        { className: 'editor-graph-svg', width: x_length.toString(), height: y_length.toString() },
        LineElements,
        HighLight,
        NodeElements
    );
}

function RunnerRenderSelection(stag_index, action_index) {
    if (stag_index === -1 || action_index === -1) {
        return null;
    }
    return React.createElement(
        'g',
        { className: 'pipeline-selection-highlight',
            transform: "translate(" + (30 + (stag_index + 1) * 120).toString() + " " + (60 + action_index * 70).toString() + ")" },
        React.createElement('circle', { className: 'white-highlight', r: '13', strokeWidth: '10' }),
        React.createElement('circle', { r: '15', strokeWidth: '2' })
    );
}

// return Label elements
function RunnerRenderLabelElements(data) {
    var y_length = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].actions.length > y_length) {
            y_length = data[i].actions.length;
        }
    }

    // big label bottom value
    var y_heigh = runnerdefaultLayout.ypStart + y_length * runnerdefaultLayout.nodeSpacingV + 2 * runnerdefaultLayout.nodeRadius - 68;

    var labels = data.map(function (stag, stag_index) {
        var bigLabel = RunnerRenderBigLabel(y_heigh, 30 + (stag_index + 1) * 120, stag.name, stag.actions.length != 1);
        var smallLabels = stag.actions.map(function (action, action_index) {
            return RunnerRenderSmallLabel(30 + (stag_index + 1) * 120, 60 + action_index * 70, action.name);
        });
        return React.createElement(
            React.Fragment,
            null,
            bigLabel,
            smallLabels
        );
    });

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            'div',
            { className: 'pipeline-small-label',
                style: {
                    position: "absolute",
                    width: "96px",
                    textAlign: "center",
                    marginLeft: "-48px",
                    marginTop: "20px",
                    top: "60px",
                    left: "30px"
                } },
            '\u5F00\u59CB'
        ),
        labels,
        React.createElement(
            'div',
            { className: 'pipeline-small-label',
                style: {
                    position: "absolute",
                    width: "96px",
                    textAlign: "center",
                    marginLeft: "-48px",
                    marginTop: "20px",
                    top: "60px",
                    left: (30 + (data.length + 1) * 120).toString() + "px"
                } },
            '\u7ED3\u675F'
        )
    );
}

function RunnerRenderBigLabel(y_heigh, x, title, parallel) {
    var parallelElement = null;
    if (parallel) {
        parallelElement = React.createElement(
            React.Fragment,
            null,
            React.createElement(
                'svg',
                { icon: 'NavigationMoreHoriz', focusable: 'false', className: 'svg-icon', viewBox: '0 0 24 24',
                    style: { height: "24px", width: "24px" } },
                React.createElement('path', {
                    d: 'M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' })
            ),
            React.createElement(
                'svg',
                { icon: 'NavigationMoreHoriz', focusable: 'false', className: 'svg-icon', viewBox: '0 0 24 24',
                    style: { height: "24px", width: "24px" } },
                React.createElement('path', {
                    d: 'M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' })
            )
        );
    }
    return React.createElement(
        'div',
        { className: 'pipeline-big-label top-level-parallel',
            style: {
                width: "120px",
                marginLeft: "-60px",
                marginBottom: "21px",
                bottom: y_heigh.toString() + 'px',
                left: x.toString() + 'px'
            } },
        title
    );
}

function RunnerRenderSmallLabel(x, y, title) {
    return React.createElement(
        'div',
        { className: 'pipeline-small-label',
            style: {
                position: "absolute",
                width: "96px",
                textAlign: "center",
                marginLeft: "-48px",
                marginTop: "20px ",
                top: y.toString() + 'px',
                left: x.toString() + 'px'
            } },
        title
    );
}

// return Node elements
function RunnerRenderNodeElements(data, clickCallback) {
    var stagNodes = data.map(function (stag, stag_index) {
        var nodes = stag.actions.map(function (action, action_index) {
            return RunnerRenderSingleActionNode(30 + (stag_index + 1) * 120, 60 + action_index * 70, stag_index, action_index, action.state, action.error, clickCallback);
        });
        return React.createElement(
            React.Fragment,
            null,
            nodes
        );
    });

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            'g',
            { transform: 'translate(30,60)', className: 'editor-graph-nodegroup' },
            React.createElement('circle', { r: '7.5', className: 'start-node', stroke: 'none' }),
            React.createElement('circle', { r: '18.9', cursor: 'pointer', className: 'pipeline-node-hittarget',
                fillOpacity: '0', stroke: 'none' })
        ),
        stagNodes,
        React.createElement(
            'g',
            { transform: "translate(" + (30 + (data.length + 1) * 120).toString() + ",60)",
                className: 'editor-graph-nodegroup' },
            React.createElement('circle', { r: '7.5', className: 'start-node', stroke: 'none' }),
            React.createElement('circle', { r: '18.9', cursor: 'pointer', className: 'pipeline-node-hittarget',
                fillOpacity: '0', stroke: 'none' })
        )
    );
}

function RunnerRenderSingleActionNode(x, y, stag_index, action_index, status, errors, clickCallback) {
    if (status === "ok") {
        return React.createElement(
            'g',
            { transform: "translate(" + x + "," + y + ")", className: 'pipeline-node' },
            React.createElement(
                'g',
                null,
                React.createElement('circle', { r: '13', fill: 'white' })
            ),
            React.createElement(
                'g',
                { className: 'svgResultStatus' },
                React.createElement('circle', { cx: '0', cy: '0', r: '12', className: 'circle-bg success' }),
                React.createElement(
                    'g',
                    { className: 'result-status-glyph' },
                    React.createElement('polygon', { points: '-2.00 2.80 -4.80 0.00 -5.73 0.933 -2.00 4.67 6.00 -3.33 5.07 -4.27' })
                )
            ),
            React.createElement(
                'title',
                null,
                'Passed in 0s'
            ),
            React.createElement('circle', { r: '19', className: 'pipeline-node-hittarget', fillOpacity: '0', stroke: 'none',
                onClick: function onClick() {
                    clickCallback(stag_index, action_index);
                },
                cursor: 'pointer' })
        );
    }
    if (status === "running") {
        return React.createElement(
            'g',
            { transform: "translate(" + x + "," + y + ")", className: 'pipeline-node' },
            React.createElement(
                'g',
                null,
                React.createElement('circle', { r: '13', fill: 'white' })
            ),
            React.createElement(
                'g',
                { className: 'progress-spinner running' },
                React.createElement('circle', { cx: '0', cy: '0', r: '10.25', strokeWidth: '3.5' }),
                React.createElement('circle', { className: 'inner', cx: '0', cy: '0', r: '3.4166666666666665' }),
                React.createElement('path', { className: 'running', fill: 'none', strokeWidth: '3.5',
                    d: 'M 6.276314845630185e-16 10.25 A 10.25 10.25 0 0 0 6.276314845630185e-16 -10.25' })
            ),
            React.createElement('circle', { r: '19', className: 'pipeline-node-hittarget', fillOpacity: '0', stroke: 'none', cursor: 'pointer',
                onClick: function onClick() {
                    clickCallback(stag_index, action_index);
                }
            })
        );
    }
    var errorsNode = null;
    var classAppend = " " + status + " ";
    if (errors) {
        errorsNode = React.createElement(
            'svg',
            { className: 'alerticon', width: '20px', height: '20px', viewBox: '13 9 20 20' },
            React.createElement(
                'defs',
                null,
                React.createElement('path', {
                    d: 'M8.0197096,1.74273849 C8.56110904,0.780250597 9.44018119,0.782544345 9.9802904,1.74273849 L17.0197096,14.2572615 C17.561109,15.2197494 17.1073772,16 16.0049107,16 L1.99508929,16 C0.893231902,16 0.440181194,15.2174557 0.980290398,14.2572615 L8.0197096,1.74273849 Z',
                    id: 'path-1' }),
                React.createElement(
                    'mask',
                    { id: 'mask-2', maskContentUnits: 'userSpaceOnUse', maskUnits: 'objectBoundingBox', x: '0', y: '0',
                        width: '20', height: '20' },
                    React.createElement('rect', { x: '0', y: '0', width: '20', height: '20', fill: 'white' }),
                    React.createElement('use', { xlinkHref: '#path-1', fill: 'black' })
                ),
                React.createElement('rect', { id: 'path-3', x: '8', y: '6', width: '2', height: '4' }),
                React.createElement(
                    'mask',
                    { id: 'mask-4', maskContentUnits: 'userSpaceOnUse', maskUnits: 'objectBoundingBox', x: '0', y: '0',
                        width: '2', height: '4', fill: 'white' },
                    React.createElement('use', { xlinkHref: '#path-3' })
                ),
                React.createElement('rect', { id: 'path-5', x: '8', y: '12', width: '2', height: '2' }),
                React.createElement(
                    'mask',
                    { id: 'mask-6', maskContentUnits: 'userSpaceOnUse', maskUnits: 'objectBoundingBox', x: '0', y: '0',
                        width: '2', height: '2', fill: 'white' },
                    React.createElement('use', { xlinkHref: '#path-5' })
                )
            ),
            React.createElement(
                'g',
                { id: 'Group-10', stroke: 'none', strokeWidth: '1', fill: 'none', transform: 'translate(15, 9)' },
                React.createElement(
                    'g',
                    { id: 'Triangle-2' },
                    React.createElement('use', { fill: '#CE373A', xlinkHref: '#path-1' }),
                    React.createElement('use', { stroke: '#FFFFFF', mask: 'url(#mask-2)', strokeWidth: '2', xlinkHref: '#path-1' })
                ),
                React.createElement('use', { id: 'Rectangle-17', stroke: '#FFFFFF', mask: 'url(#mask-4)', strokeWidth: '2', fill: '#D8D8D8',
                    xlinkHref: '#path-3' }),
                React.createElement('use', { id: 'Rectangle-17-Copy', stroke: '#FFFFFF', mask: 'url(#mask-6)', strokeWidth: '2', fill: '#D8D8D8',
                    xlinkHref: '#path-5' })
            )
        );
        classAppend += "errors";
    }
    return React.createElement(
        'g',
        { transform: "translate(" + x + "," + y + ")", className: "editor-graph-nodegroup" + classAppend },
        React.createElement(
            'g',
            null,
            React.createElement('circle', { className: 'editor-graph-node', r: '12.5' }),
            React.createElement('circle', { className: 'editor-graph-node-inner', r: '9.3' })
        ),
        errorsNode,
        React.createElement('circle', { r: '18.9', cursor: 'pointer', className: 'pipeline-node-hittarget', onClick: function onClick() {
                clickCallback(stag_index, action_index);
            },
            fillOpacity: '0', stroke: 'none' })
    );
}

// return Line elements
function RunnerRenderLineElements(data) {
    return React.createElement(
        React.Fragment,
        null,
        RunnerRenderStraightLineElements(data),
        RunnerRenderActionLineElements(data)
    );
}

function RunnerRenderStraightLineElements(data) {
    var lines = data.map(function (stag, index) {
        var x_end = 30 + (index + 1) * 120;
        var x_start = x_end - 120;
        return React.createElement('line', { className: 'pipeline-connector', strokeWidth: '3.2', x1: x_start.toString(), y1: '60',
            x2: x_end.toString(),
            y2: '60' });
    });
    return React.createElement(
        React.Fragment,
        null,
        lines,
        React.createElement('line', { className: 'pipeline-connector', strokeWidth: '3.2', x1: 30 + data.length * 120, y1: '60',
            x2: 30 + (data.length + 1) * 120,
            y2: '60' })
    );
}

function RunnerRenderActionLineElements(data) {
    var stagLines = data.map(function (stag, index) {
        var x_start = 30 + index * 120;
        var y_start = 60;
        var lines = stag.actions.map(function (action, action_index) {
            if (action_index == 0) {
                return;
            }
            var v_length = 46 + (action_index - 1) * 70;

            var pathDataLeft = 'M ' + x_start + ' ' + y_start + // start position
            ' l 60 0' + // first horizontal line
            ' c 12 0 12 12 12 12' + ( // turn
            ' l 0 ' + v_length) + // vertical line
            ' c 0 12 12 12 12 12' + // turn again
            ' l 36 0'; // second horizontal line

            var pathDataRight = 'M ' + (x_start + 120) + ' ' + (y_start + action_index * 70) + // start position
            ' l 36 0' + // first horizontal line
            ' c 12 0 12 -12 12 -12' + ( // turn
            ' l 0 ' + -v_length) + // vertical line
            ' c 0 -12 12 -12 12 -12' + // turn again
            ' l 60 0'; // second horizontal line
            return React.createElement(
                React.Fragment,
                null,
                React.createElement('path', { className: 'pipeline-connector', strokeWidth: '3.2',
                    d: pathDataLeft, fill: 'none' }),
                React.createElement('path', { className: 'pipeline-connector', strokeWidth: '3.2',
                    d: pathDataRight, fill: 'none' })
            );
        });
        return React.createElement(
            React.Fragment,
            null,
            lines
        );
    });

    return React.createElement(
        React.Fragment,
        null,
        stagLines
    );
}
