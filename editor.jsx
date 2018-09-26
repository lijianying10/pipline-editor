const defaultLayout = {
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
    return RenderOutline(
        RenderSvg(
            data,
            RenderLineElements(data),
            RenderNodeElements(data, nodeClickCallback),
        ),
        RenderLabelElements(data),
        scale
    )
}

// Render DIV outline
// svg: input svg react element
function RenderOutline(svg, label, scale) {
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
function RenderSvg(data, LineElements, NodeElements) {
    // +2 means : start and tail place holder
    let x_length = 0.5 * defaultLayout.nodeSpacingH + (data.length + 1) * defaultLayout.nodeSpacingH;
    let y_length = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].actions.length > y_length) {
            y_length = data[i].actions.length;
        }
    }
    y_length = defaultLayout.ypStart + y_length * defaultLayout.nodeSpacingV + 2 * defaultLayout.nodeRadius;
    return (
        <svg className="editor-graph-svg" width={x_length.toString()} height={y_length.toString()}>
            {LineElements}
            {NodeElements}
        </svg>
    )
}


// return Label elements
function RenderLabelElements(data) {
    let y_length = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].actions.length > y_length) {
            y_length = data[i].actions.length;
        }
    }

    // big label bottom value
    let y_heigh = defaultLayout.ypStart + y_length * defaultLayout.nodeSpacingV + 2 * defaultLayout.nodeRadius - 68;

    let labels = data.map(function (stag, stag_index) {
        let bigLabel = RenderBigLabel(y_heigh, 30 + (stag_index + 1) * 120, stag.name, (stag.actions.length != 1));
        let smallLabels = stag.actions.map(function (action, action_index) {
            return RenderSmallLabel(30 + (stag_index + 1) * 120, 60 + action_index * 70, action.name);
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
                Start
            </div>
            {labels}
        </React.Fragment>)
}

function RenderBigLabel(y_heigh, x, title, parallel) {
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
            {parallelElement}
        </div>
    )
}

function RenderSmallLabel(x, y, title) {
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
function RenderNodeElements(data, clickCallback) {
    let stagNodes = data.map(function (stag, stag_index) {
        let nodes = stag.actions.map(function (action, action_index) {
            return RenderSingleActionNode(30 + (stag_index + 1) * 120, 60 + action_index * 70, action.state, action.error)
        });
        console.log("Place holder button", "translate(" + (30 + (stag_index + 1) * 120).toString() + "," + (60 + stag.actions.length * 70).toString() + ")");
        return (<React.Fragment>
            {nodes}

            {/*PlaceHolder Node*/}
            <g transform={"translate(" + (30 + (stag_index + 1) * 120).toString() + "," + (60 + stag.actions.length * 70).toString() + ")"}
               className="editor-graph-nodegroup">
                <g>
                    <circle className="editor-add-node-placeholder" r="11" strokeWidth="1.7"></circle>
                    <g className="result-status-glyph" transform="rotate(45)">
                        <polygon
                            points="4.67 -3.73 3.73 -4.67 0 -0.94 -3.73 -4.67 -4.67 -3.73 -0.94 0 -4.67 3.73 -3.73 4.67 0 0.94 3.73 4.67 4.67 3.73 0.94 0"></polygon>
                    </g>
                </g>
                <circle r="18.9" cursor="pointer" className="pipeline-node-hittarget" id="pipeline-node-hittarget-2-add"
                        fillOpacity="0" stroke="none"></circle>
            </g>
        </React.Fragment>);
    });

    return (<React.Fragment>
        {/*startNode*/}
        <g transform="translate(30,60)" className="editor-graph-nodegroup">
            <circle r="7.5" className="start-node" stroke="none"></circle>
            <circle r="18.9" cursor="pointer" className="pipeline-node-hittarget" id="pipeline-node-hittarget-1-start"
                    fillOpacity="0" stroke="none"></circle>
        </g>
        {stagNodes}
    </React.Fragment>);
}

function RenderSingleActionNode(x, y, status, errors) {
    let errorsNode = null;
    let classAppend = " " + status + " ";
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
            <circle r="18.9" cursor="pointer" className="pipeline-node-hittarget" id="pipeline-node-hittarget-6"
                    fillOpacity="0" stroke="none"></circle>
        </g>
    )
}

// return Line elements
function RenderLineElements(data) {
    return (
        <React.Fragment>
            {RenderPlaceHolderLineElements(data)}
            {RenderStraightLineElements(data)}
            {RenderActionLineElements(data)}
        </React.Fragment>);
}

function RenderStraightLineElements(data) {
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
        <line className="pipeline-connector placeholder" strokeWidth="3.2" x1={30 + data.length * 120} y1="60"
              x2={30 + (data.length + 1) * 120}
              y2="60"></line>
    </React.Fragment>)
}

function RenderPlaceHolderLineElements(data) {
    let placeHolders = data.map(function (stag, index) {
        let x_start = 30 + index * 120;
        let y_start = 60;
        let v_length = 46 + (stag.actions.length - 1) * 70;

        const pathData =
            `M ${x_start} ${y_start}` + // start position
            ` l 60 0` + // first horizontal line
            ` c 12 0 12 12 12 12` + // turn
            ` l 0 ${v_length}` + // vertical line
            ` c 0 12 12 12 12 12` + // turn again
            ` l 36 0`; // second horizontal line
        return (
            <path className="pipeline-connector placeholder" strokeWidth="3.2"
                  d={pathData} fill="none"></path>
        )
    });

    return (<React.Fragment>
        {placeHolders}
    </React.Fragment>)
}

function RenderActionLineElements(data) {
    let stagLines = data.map(function (stag, index) {
        let x_start = 30 + index * 120;
        let y_start = 60;
        let lines = stag.actions.map(function (action, action_index) {
            if (action_index == 0) {
                return
            }
            let v_length = 46 + (action_index - 1) * 70;
            console.log("debug action line: ", index, action_index, stag, x_start, y_start, v_length);

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
