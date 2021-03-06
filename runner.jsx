const runnerdefaultLayout = {
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
    return RunnerRenderOutline(
        RunnerRenderSvg(
            data,
            RunnerRenderLineElements(data),
            RunnerRenderSelection(sel_stag_index, sel_action_index),
            RunnerRenderNodeElements(data, nodeClickCallback)
        ),
        RunnerRenderLabelElements(data),
        scale
    )
}

// Render DIV outline
// svg: input svg react element
function RunnerRenderOutline(svg, label, scale) {
    const divStyle = {
        position: 'relative',
        overflow: 'visible',
        margin: '30px auto',
        transform: "scale(" + scale.toString() + ")"
    };
    return (
        <div className="pipeline-editor">
            <div style={divStyle}>
                {svg}
                {label}
            </div>
        </div>
    )
}

// Render Svg Element
// Input: react element array
// combine all element in svgContainer
// Return: svg element
function RunnerRenderSvg(data, HighLight, LineElements, NodeElements) {
    // +2 means : start and tail place holder
    let x_length = 0.5 * runnerdefaultLayout.nodeSpacingH + (data.length + 1) * runnerdefaultLayout.nodeSpacingH;
    let y_length = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].actions.length > y_length) {
            y_length = data[i].actions.length;
        }
    }
    y_length = runnerdefaultLayout.ypStart + y_length * runnerdefaultLayout.nodeSpacingV + 2 * runnerdefaultLayout.nodeRadius;
    return (
        <svg className="editor-graph-svg" width={x_length.toString()} height={y_length.toString()}>
            {LineElements}
            {HighLight}
            {NodeElements}
        </svg>
    )
}

function RunnerRenderSelection(stag_index, action_index) {
    if (stag_index === -1 || action_index === -1) {
        return null
    }
    return (
        <g className="pipeline-selection-highlight"
           transform={"translate(" + (30 + (stag_index + 1) * 120).toString() + " " + (60 + action_index * 70).toString() + ")"}>
            <circle className="white-highlight" r="13" strokeWidth="10"></circle>
            <circle r="15" strokeWidth="2"></circle>
        </g>
    )
}

// return Label elements
function RunnerRenderLabelElements(data) {
    let y_length = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].actions.length > y_length) {
            y_length = data[i].actions.length;
        }
    }

    // big label bottom value
    let y_heigh = runnerdefaultLayout.ypStart + y_length * runnerdefaultLayout.nodeSpacingV + 2 * runnerdefaultLayout.nodeRadius - 68;

    let labels = data.map(function (stag, stag_index) {
        let bigLabel = RunnerRenderBigLabel(y_heigh, 30 + (stag_index + 1) * 120, stag.name, (stag.actions.length != 1));
        let smallLabels = stag.actions.map(function (action, action_index) {
            return RunnerRenderSmallLabel(30 + (stag_index + 1) * 120, 60 + action_index * 70, action.name);
        });
        return (<React.Fragment>
            {bigLabel}
            {smallLabels}
        </React.Fragment>)
    });

    return (
        <React.Fragment>
            <div className="pipeline-small-label"
                 style={{
                     position: "absolute",
                     width: "96px",
                     textAlign: "center",
                     marginLeft: "-48px",
                     marginTop: "20px",
                     top: "60px",
                     left: "30px"
                 }}>
                开始
            </div>
            {labels}
            <div className="pipeline-small-label"
                 style={{
                     position: "absolute",
                     width: "96px",
                     textAlign: "center",
                     marginLeft: "-48px",
                     marginTop: "20px",
                     top: "60px",
                     left: (30 + (data.length + 1) * 120).toString() + "px"
                 }}>
                结束
            </div>
        </React.Fragment>)
}

function RunnerRenderBigLabel(y_heigh, x, title, parallel) {
    let parallelElement = null;
    if (parallel) {
        parallelElement = (<React.Fragment>
            <svg icon="NavigationMoreHoriz" focusable="false" className="svg-icon" viewBox="0 0 24 24"
                 style={{height: "24px", width: "24px"}}>
                <path
                    d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
            </svg>
            <svg icon="NavigationMoreHoriz" focusable="false" className="svg-icon" viewBox="0 0 24 24"
                 style={{height: "24px", width: "24px"}}>
                <path
                    d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
            </svg>
        </React.Fragment>)
    }
    return (
        <div className="pipeline-big-label top-level-parallel"
             style={{
                 width: "120px",
                 marginLeft: "-60px",
                 marginBottom: "21px",
                 bottom: `${y_heigh.toString()}px`,
                 left: `${x.toString()}px`,
             }}>
            {title}
        </div>
    )
}

function RunnerRenderSmallLabel(x, y, title) {
    return (
        <div className="pipeline-small-label"
             style={{
                 position: "absolute",
                 width: "96px",
                 textAlign: "center",
                 marginLeft: "-48px",
                 marginTop: "20px ",
                 top: `${y.toString()}px`,
                 left: `${x.toString()}px`,
             }}>
            {title}
        </div>
    )
}

// return Node elements
function RunnerRenderNodeElements(data, clickCallback) {
    let stagNodes = data.map(function (stag, stag_index) {
        let nodes = stag.actions.map(function (action, action_index) {
            return RunnerRenderSingleActionNode(30 + (stag_index + 1) * 120, 60 + action_index * 70, stag_index, action_index, action.state, action.error, clickCallback)
        });
        return (<React.Fragment>
            {nodes}
        </React.Fragment>);
    });

    return (<React.Fragment>
        {/*startNode*/}
        <g onClick={function () {
            clickCallback(-2, -2)
        }} transform="translate(30,60)" className="editor-graph-nodegroup">
            <circle r="7.5" className="start-node" stroke="none"></circle>
            <circle r="18.9" cursor="pointer" className="pipeline-node-hittarget"
                    fillOpacity="0" stroke="none"></circle>
        </g>
        {stagNodes}
        <g transform={"translate(" + (30 + (data.length + 1) * 120).toString() + ",60)"}
           className="editor-graph-nodegroup">
            <circle r="7.5" className="start-node" stroke="none"></circle>
            <circle r="18.9" cursor="pointer" className="pipeline-node-hittarget"
                    fillOpacity="0" stroke="none"></circle>
        </g>
    </React.Fragment>);
}

function RunnerRenderSingleActionNode(x, y, stag_index, action_index, status, errors, clickCallback) {
    if (status === "finish") {
        return (
            <g transform={"translate(" + x + "," + y + ")"} className="pipeline-node">
                <g>
                    <circle r="13" fill="white"></circle>
                </g>
                <g className="svgResultStatus">
                    <circle cx="0" cy="0" r="12" className="circle-bg success"></circle>
                    <g className="result-status-glyph">
                        <polygon points="-2.00 2.80 -4.80 0.00 -5.73 0.933 -2.00 4.67 6.00 -3.33 5.07 -4.27"></polygon>
                    </g>
                </g>
                <title>Passed in 0s</title>
                <circle r="19" className="pipeline-node-hittarget" fillOpacity="0" stroke="none"
                        onClick={function () {
                            clickCallback(stag_index, action_index);
                        }}
                        cursor="pointer"></circle>
            </g>
        )
    }
    if (status === "run") {
        return (
            <g transform={"translate(" + x + "," + y + ")"} className="pipeline-node">
                <g>
                    <circle r="13" fill="white"></circle>
                </g>
                <g className="progress-spinner running">
                    <circle cx="0" cy="0" r="10.25" strokeWidth="3.5"></circle>
                    <circle className="inner" cx="0" cy="0" r="3.4166666666666665"></circle>
                    <path className="running" fill="none" strokeWidth="3.5"
                          d="M 6.276314845630185e-16 10.25 A 10.25 10.25 0 0 0 6.276314845630185e-16 -10.25"></path>
                </g>
                <circle r="19" className="pipeline-node-hittarget" fillOpacity="0" stroke="none" cursor="pointer"
                        onClick={function () {
                            clickCallback(stag_index, action_index);
                        }}
                ></circle>
            </g>
        )
    }
    let errorsNode = null;
    let classAppend = " " + status + " ";
    if (status === "waiting"){
        classAppend+=" selected "
    }
    if (errors) {
        errorsNode = (
            <svg className="alerticon" width="20px" height="20px" viewBox="13 9 20 20">
                <defs>
                    <path
                        d="M8.0197096,1.74273849 C8.56110904,0.780250597 9.44018119,0.782544345 9.9802904,1.74273849 L17.0197096,14.2572615 C17.561109,15.2197494 17.1073772,16 16.0049107,16 L1.99508929,16 C0.893231902,16 0.440181194,15.2174557 0.980290398,14.2572615 L8.0197096,1.74273849 Z"
                        id="path-1"></path>
                    <mask id="mask-2" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0"
                          width="20" height="20">
                        <rect x="0" y="0" width="20" height="20" fill="white"></rect>
                        <use xlinkHref="#path-1" fill="black"></use>
                    </mask>
                    <rect id="path-3" x="8" y="6" width="2" height="4"></rect>
                    <mask id="mask-4" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0"
                          width="2" height="4" fill="white">
                        <use xlinkHref="#path-3"></use>
                    </mask>
                    <rect id="path-5" x="8" y="12" width="2" height="2"></rect>
                    <mask id="mask-6" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0"
                          width="2" height="2" fill="white">
                        <use xlinkHref="#path-5"></use>
                    </mask>
                </defs>
                <g id="Group-10" stroke="none" strokeWidth="1" fill="none" transform="translate(15, 9)">
                    <g id="Triangle-2">
                        <use fill="#CE373A" xlinkHref="#path-1"></use>
                        <use stroke="#FFFFFF" mask="url(#mask-2)" strokeWidth="2" xlinkHref="#path-1"></use>
                    </g>
                    <use id="Rectangle-17" stroke="#FFFFFF" mask="url(#mask-4)" strokeWidth="2" fill="#D8D8D8"
                         xlinkHref="#path-3"></use>
                    <use id="Rectangle-17-Copy" stroke="#FFFFFF" mask="url(#mask-6)" strokeWidth="2" fill="#D8D8D8"
                         xlinkHref="#path-5"></use>
                </g>
            </svg>
        )
        classAppend += "errors";
    }
    return (
        <g transform={"translate(" + x + "," + y + ")"} className={"editor-graph-nodegroup" + classAppend}>
            <g>
                <circle className="editor-graph-node" r="12.5"></circle>
                <circle className="editor-graph-node-inner" r="9.3"></circle>
            </g>
            {errorsNode}
            <circle r="18.9" cursor="pointer" className="pipeline-node-hittarget" onClick={function () {
                clickCallback(stag_index, action_index);
            }}
                    fillOpacity="0" stroke="none"></circle>
        </g>
    )
}

// return Line elements
function RunnerRenderLineElements(data) {
    return (
        <React.Fragment>
            {RunnerRenderStraightLineElements(data)}
            {RunnerRenderActionLineElements(data)}
        </React.Fragment>);
}

function RunnerRenderStraightLineElements(data) {
    let lines = data.map(function (stag, index) {
        let x_end = 30 + (index + 1) * 120;
        let x_start = x_end - 120;
        return (
            <line className="pipeline-connector" strokeWidth="3.2" x1={x_start.toString()} y1="60"
                  x2={x_end.toString()}
                  y2="60"></line>
        )
    });
    return (<React.Fragment>
        {lines}
        <line className="pipeline-connector" strokeWidth="3.2" x1={30 + data.length * 120} y1="60"
              x2={30 + (data.length + 1) * 120}
              y2="60"></line>
    </React.Fragment>)
}

function RunnerRenderActionLineElements(data) {
    let stagLines = data.map(function (stag, index) {
        let x_start = 30 + index * 120;
        let y_start = 60;
        let lines = stag.actions.map(function (action, action_index) {
            if (action_index == 0) {
                return
            }
            let v_length = 46 + (action_index - 1) * 70;

            const pathDataLeft =
                `M ${x_start} ${y_start}` + // start position
                ` l 60 0` + // first horizontal line
                ` c 12 0 12 12 12 12` + // turn
                ` l 0 ${v_length}` + // vertical line
                ` c 0 12 12 12 12 12` + // turn again
                ` l 36 0`; // second horizontal line

            const pathDataRight =
                `M ${x_start + 120} ${y_start + action_index * 70}` + // start position
                ` l 36 0` + // first horizontal line
                ` c 12 0 12 -12 12 -12` + // turn
                ` l 0 ${-v_length}` + // vertical line
                ` c 0 -12 12 -12 12 -12` + // turn again
                ` l 60 0`; // second horizontal line
            return (<React.Fragment>
                <path className="pipeline-connector" strokeWidth="3.2"
                      d={pathDataLeft} fill="none"></path>
                <path className="pipeline-connector" strokeWidth="3.2"
                      d={pathDataRight} fill="none"></path>
            </React.Fragment>)
        });
        return (<React.Fragment>
            {lines}
        </React.Fragment>)
    });

    return (<React.Fragment>
        {stagLines}
    </React.Fragment>)
}
