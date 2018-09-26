'use strict';

var defaultLayout = {
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
function RenderPipeline(data, scale, nodeClickCallback) {
    return RenderOutline(RenderSvg(data, RenderLineElements(data), RenderNodeElements(data, nodeClickCallback)), RenderLabelElements(data), scale);
}

// Render DIV outline
// svg: input svg react element
function RenderOutline(svg, label, scale) {
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
function RenderSvg(data, LineElements, NodeElements) {
    // +2 means : start and tail place holder
    var x_length = 0.5 * defaultLayout.nodeSpacingH + (data.length + 1) * defaultLayout.nodeSpacingH;
    var y_length = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].actions.length > y_length) {
            y_length = data[i].actions.length;
        }
    }
    y_length = defaultLayout.ypStart + y_length * defaultLayout.nodeSpacingV + 2 * defaultLayout.nodeRadius;
    return React.createElement(
        'svg',
        { className: 'editor-graph-svg', width: x_length.toString(), height: y_length.toString() },
        LineElements,
        NodeElements
    );
}

// return Label elements
function RenderLabelElements(data) {
    var y_length = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].actions.length > y_length) {
            y_length = data[i].actions.length;
        }
    }

    // big label bottom value
    var y_heigh = defaultLayout.ypStart + y_length * defaultLayout.nodeSpacingV + 2 * defaultLayout.nodeRadius - 68;

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            'div',
            { className: 'pipeline-big-label top-level-parallel', 'data-stagename': 'abcde',
                style: {
                    width: "120px",
                    marginLeft: "-60px",
                    marginBottom: "21px",
                    bottom: y_heigh.toString() + 'px',
                    left: "150px"
                } },
            'abcde',
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
        ),
        React.createElement(
            'div',
            { className: 'pipeline-big-label selected', 'data-stagename': '2aaa',
                style: {
                    width: "120px",
                    marginLeft: "-60px",
                    marginBottom: "21px",
                    bottom: y_heigh.toString() + 'px',
                    left: "270px"
                } },
            '2aaa'
        ),
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
            'Start'
        ),
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
                    left: "150px"
                } },
            'abcde'
        ),
        React.createElement(
            'div',
            { className: 'pipeline-small-label',
                style: {
                    position: "absolute",
                    width: "96px",
                    textAlign: "center",
                    marginLeft: "-48px",
                    marginTop: "20px ",
                    top: "130px",
                    left: "150px"
                } },
            'small-label'
        )
    );
}

// return Node elements
function RenderNodeElements(data, clickCallback) {
    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            'g',
            { transform: 'translate(30,60)', 'class': 'editor-graph-nodegroup' },
            React.createElement('circle', { r: '7.5', 'class': 'start-node', stroke: 'none' }),
            React.createElement('circle', { r: '18.9', cursor: 'pointer', 'class': 'pipeline-node-hittarget', id: 'pipeline-node-hittarget-1-start',
                'fill-opacity': '0', stroke: 'none' })
        ),
        React.createElement(
            'g',
            { transform: 'translate(150,200)', 'class': 'editor-graph-nodegroup' },
            React.createElement(
                'g',
                null,
                React.createElement('circle', { 'class': 'editor-add-node-placeholder', r: '11', 'stroke-width': '1.7' }),
                React.createElement(
                    'g',
                    { 'class': 'result-status-glyph', transform: 'rotate(45)' },
                    React.createElement('polygon', {
                        points: '4.67 -3.73 3.73 -4.67 0 -0.94 -3.73 -4.67 -4.67 -3.73 -0.94 0 -4.67 3.73 -3.73 4.67 0 0.94 3.73 4.67 4.67 3.73 0.94 0' })
                )
            ),
            React.createElement('circle', { onclick: 'console.log("click here")', r: '18.9', cursor: 'pointer', 'class': 'pipeline-node-hittarget',
                id: 'pipeline-node-hittarget-2-add', 'fill-opacity': '0', stroke: 'none' })
        ),
        React.createElement(
            'g',
            { transform: 'translate(150,270)', 'class': 'editor-graph-nodegroup' },
            React.createElement(
                'g',
                null,
                React.createElement('circle', { 'class': 'editor-add-node-placeholder', r: '11', 'stroke-width': '1.7' }),
                React.createElement(
                    'g',
                    { 'class': 'result-status-glyph', transform: 'rotate(45)' },
                    React.createElement('polygon', {
                        points: '4.67 -3.73 3.73 -4.67 0 -0.94 -3.73 -4.67 -4.67 -3.73 -0.94 0 -4.67 3.73 -3.73 4.67 0 0.94 3.73 4.67 4.67 3.73 0.94 0' })
                )
            ),
            React.createElement('circle', { r: '18.9', cursor: 'pointer', 'class': 'pipeline-node-hittarget', id: 'pipeline-node-hittarget-2-add',
                'fill-opacity': '0', stroke: 'none' })
        ),
        React.createElement(
            'g',
            { transform: 'translate(150,60)', 'class': 'editor-graph-nodegroup errors' },
            React.createElement(
                'g',
                null,
                React.createElement('circle', { 'class': 'editor-graph-node', r: '12.5' }),
                React.createElement('circle', { 'class': 'editor-graph-node-inner', r: '9.3' })
            ),
            React.createElement('circle', { r: '18.9', cursor: 'pointer', 'class': 'pipeline-node-hittarget', id: 'pipeline-node-hittarget-4',
                'fill-opacity': '0', stroke: 'none' })
        ),
        React.createElement(
            'g',
            { transform: 'translate(150,130)', 'class': 'editor-graph-nodegroup' },
            React.createElement(
                'g',
                null,
                React.createElement('circle', { 'class': 'editor-graph-node', r: '12.5' }),
                React.createElement('circle', { 'class': 'editor-graph-node-inner', r: '9.3' })
            ),
            React.createElement('circle', { r: '18.9', cursor: 'pointer', 'class': 'pipeline-node-hittarget', id: 'pipeline-node-hittarget-3',
                'fill-opacity': '0', stroke: 'none' })
        ),
        React.createElement(
            'g',
            { transform: 'translate(270,130)', 'class': 'editor-graph-nodegroup' },
            React.createElement(
                'g',
                null,
                React.createElement('circle', { 'class': 'editor-add-node-placeholder', r: '11', 'stroke-width': '1.7' }),
                React.createElement(
                    'g',
                    { 'class': 'result-status-glyph', transform: 'rotate(45)' },
                    React.createElement('polygon', {
                        points: '4.67 -3.73 3.73 -4.67 0 -0.94 -3.73 -4.67 -4.67 -3.73 -0.94 0 -4.67 3.73 -3.73 4.67 0 0.94 3.73 4.67 4.67 3.73 0.94 0' })
                )
            ),
            React.createElement('circle', { r: '18.9', cursor: 'pointer', 'class': 'pipeline-node-hittarget', id: 'pipeline-node-hittarget-3-add',
                'fill-opacity': '0', stroke: 'none' })
        ),
        React.createElement(
            'g',
            { transform: 'translate(270,60)', 'class': 'editor-graph-nodegroup selected' },
            React.createElement(
                'g',
                null,
                React.createElement('circle', { 'class': 'editor-graph-node', r: '12.5' }),
                React.createElement('circle', { 'class': 'editor-graph-node-inner', r: '9.3' })
            ),
            React.createElement('circle', { r: '18.9', cursor: 'pointer', 'class': 'pipeline-node-hittarget', id: 'pipeline-node-hittarget-6',
                'fill-opacity': '0', stroke: 'none' })
        ),
        React.createElement(
            'g',
            { transform: 'translate(390,60)', 'class': 'editor-graph-nodegroup' },
            React.createElement(
                'g',
                null,
                React.createElement('circle', { 'class': 'editor-add-node-placeholder', r: '11', 'stroke-width': '1.7' }),
                React.createElement(
                    'g',
                    { 'class': 'result-status-glyph', transform: 'rotate(45)' },
                    React.createElement('polygon', {
                        points: '4.67 -3.73 3.73 -4.67 0 -0.94 -3.73 -4.67 -4.67 -3.73 -0.94 0 -4.67 3.73 -3.73 4.67 0 0.94 3.73 4.67 4.67 3.73 0.94 0' })
                )
            ),
            React.createElement('circle', { r: '18.9', cursor: 'pointer', 'class': 'pipeline-node-hittarget', id: 'pipeline-node-hittarget-4-add',
                'fill-opacity': '0', stroke: 'none' })
        )
    );
}

// return Line elements
function RenderLineElements(data) {
    return React.createElement(
        React.Fragment,
        null,
        RenderPlaceHolderLineElements(data),
        RenderStraightLineElements(data),
        RenderActionLineElements(data)
    );
    return React.createElement(
        React.Fragment,
        null,
        React.createElement('path', { 'class': 'pipeline-connector placeholder', 'stroke-width': '3.2',
            d: 'M 30 60 l 60 0 c 12 0 12 12 12 12 l 0 116 c 0 12 12 12 12 12 l 36 0', fill: 'none' }),
        React.createElement('path', { 'class': 'pipeline-connector placeholder', 'stroke-width': '3.2',
            d: 'M 30 60 l 60 0 c 12 0 12 12 12 12 l 0 186 c 0 12 12 12 12 12 l 36 0', fill: 'none' }),
        React.createElement('line', { 'class': 'pipeline-connector', 'stroke-width': '3.2', x1: '30', y1: '60', x2: '150', y2: '60' }),
        React.createElement('path', { 'class': 'pipeline-connector', 'stroke-width': '3.2',
            d: 'M 30 60 l 60 0 c 12 0 12 12 12 12 l 0 46 c 0 12 12 12 12 12 l 36 0', fill: 'none' }),
        React.createElement('path', { 'class': 'pipeline-connector placeholder', 'stroke-width': '3.2',
            d: 'M 150 60 l 60 0 c 12 0 12 12 12 12 l 0 46 c 0 12 12 12 12 12 l 36 0', fill: 'none' }),
        React.createElement('line', { 'class': 'pipeline-connector', 'stroke-width': '3.2', x1: '150', y1: '60', x2: '270', y2: '60' }),
        React.createElement('path', { 'class': 'pipeline-connector', 'stroke-width': '3.2',
            d: 'M 150 130 l 36 0 c 12 0 12 -12 12 -12 l 0 -46 c 0 -12 12 -12 12 -12 l 60 0', fill: 'none' }),
        React.createElement('line', { 'class': 'pipeline-connector placeholder', 'stroke-width': '3.2', x1: '270', y1: '60', x2: '390', y2: '60' })
    );
}

function RenderStraightLineElements(data) {
    var lines = data.map(function (stag, index) {
        var x_end = 30 + (index + 1) * 120;
        var x_start = x_end - 120;
        console.log(index, stag, x_start, x_end);
        return React.createElement('line', { className: 'pipeline-connector', 'stroke-width': '3.2', x1: x_start.toString(), y1: '60',
            x2: x_end.toString(),
            y2: '60' });
    });
    return React.createElement(
        React.Fragment,
        null,
        lines,
        React.createElement('line', { className: 'pipeline-connector placeholder', 'stroke-width': '3.2', x1: 30 + data.length * 120, y1: '60',
            x2: 30 + (data.length + 1) * 120,
            y2: '60' })
    );
}

function RenderPlaceHolderLineElements(data) {
    var placeHolders = data.map(function (stag, index) {
        var x_start = 30 + index * 120;
        var y_start = 60;
        var v_length = 46 + (stag.actions.length - 1) * 70;
        console.log("debug place holder: ", index, stag, x_start, y_start, v_length);

        var pathData = 'M ' + x_start + ' ' + y_start + // start position
        ' l 60 0' + // first horizontal line
        ' c 12 0 12 12 12 12' + ( // turn
        ' l 0 ' + v_length) + // vertical line
        ' c 0 12 12 12 12 12' + // turn again
        ' l 36 0'; // second horizontal line
        return React.createElement('path', { className: 'pipeline-connector placeholder', 'stroke-width': '3.2',
            d: pathData, fill: 'none' });
    });

    return React.createElement(
        React.Fragment,
        null,
        placeHolders
    );
}

function RenderActionLineElements(data) {
    var stagLines = data.map(function (stag, index) {
        var x_start = 30 + index * 120;
        var y_start = 60;
        var lines = stag.actions.map(function (action, action_index) {
            if (action_index == stag.actions.length - 1) {
                return;
            }
            var v_length = 46 + action_index * 70;
            console.log("debug place holder: ", index, stag, x_start, y_start, v_length);

            var pathData = 'M ' + x_start + ' ' + y_start + // start position
            ' l 60 0' + // first horizontal line
            ' c 12 0 12 12 12 12' + ( // turn
            ' l 0 ' + v_length) + // vertical line
            ' c 0 12 12 12 12 12' + // turn again
            ' l 36 0'; // second horizontal line
            return React.createElement('path', { className: 'pipeline-connector', 'stroke-width': '3.2',
                d: pathData, fill: 'none' });
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
