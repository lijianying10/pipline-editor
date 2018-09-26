// RenderPipeline Render pipeline SVG
// Params:
// data: pipeline json data
// scale: svg scale
// nodeClickCallback: call back on click node func(node_id)
// Return: ReactElement
function RenderPipeline(data, scale, nodeClickCallback) {
    return RenderOutline(
        RenderSvg(
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
    let strScale = "scale(" + scale.toString() + ")";
    const divStyle = {position: 'relative', overflow: 'visible', margin: '30px auto', transform: strScale};
    return (
        <div style={divStyle}>
            {svg}
            {label}
        </div>
    )
}

// Render Svg Element
// Input: react element array
// combine all element in svgContainer
// Return: svg element
function RenderSvg(LineElements, NodeElements, LabelElements) {
    if (!Array.isArray(LineElements) || !Array.isArray(NodeElements) || !Array.isArray(LabelElements)) {
        return null
    }
    return (
        LineElements.concat(NodeElements).concat(LabelElements)
    )
}


// return Label elements
function RenderLabelElements(data) {
    let res = new Array();
    res.push(
        <div className="pipeline-big-label top-level-parallel" data-stagename="abcde"
             style={{width: "120px", marginLeft: "-60px", marginBottom: "21px", bottom: "265px", left: "150px"}}>
            abcde
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
        </div>
    );
    res.push(
        <div className="pipeline-big-label selected" data-stagename="2aaa"
             style={{width: "120px", marginLeft: "-60px", marginBottom: "21px", bottom: "265px", left: "270px"}}>
            2aaa
        </div>
    );
    res.push(
        <div className="pipeline-small-label"
             style={{position: "absolute", width: "96px", textAlign: "center", marginLeft: "-48px", marginTop: "20px", top: "60px", left: "30px"}}>
            Start
        </div>
    );
    res.push(
        <div className="pipeline-small-label"
             style={{position: "absolute", width: "96px", textAlign: "center", marginLeft: "-48px", marginTop: "20px", top: "60px", left: "150px"}}>
            abcde
        </div>
    );
    res.push(
        <div className="pipeline-small-label"
             style={{position: "absolute", width: "96px", textAlign: "center", marginLeft: "-48px", marginTop: "20px ",top: "130px", left: "150px"}}>
            small-label
        </div>
    );
    return res;
}

// return Node elements
function RenderNodeElements(data, clickCallback) {
    let res = new Array();
    res.push(
        <g transform="translate(30,60)" class="editor-graph-nodegroup">
            <circle r="7.5" class="start-node" stroke="none"></circle>
            <circle r="18.9" cursor="pointer" class="pipeline-node-hittarget" id="pipeline-node-hittarget-1-start"
                    fill-opacity="0" stroke="none"></circle>
        </g>
    );
    res.push(
        <g transform="translate(150,200)" class="editor-graph-nodegroup">
            <g>
                <circle class="editor-add-node-placeholder" r="11" stroke-width="1.7"></circle>
                <g class="result-status-glyph" transform="rotate(45)">
                    <polygon
                        points="4.67 -3.73 3.73 -4.67 0 -0.94 -3.73 -4.67 -4.67 -3.73 -0.94 0 -4.67 3.73 -3.73 4.67 0 0.94 3.73 4.67 4.67 3.73 0.94 0"></polygon>
                </g>
            </g>
            <circle onclick='console.log("click here")' r="18.9" cursor="pointer" class="pipeline-node-hittarget"
                    id="pipeline-node-hittarget-2-add" fill-opacity="0" stroke="none"></circle>
        </g>
    );
    res.push(
        <g transform="translate(150,270)" class="editor-graph-nodegroup">
            <g>
                <circle class="editor-add-node-placeholder" r="11" stroke-width="1.7"></circle>
                <g class="result-status-glyph" transform="rotate(45)">
                    <polygon
                        points="4.67 -3.73 3.73 -4.67 0 -0.94 -3.73 -4.67 -4.67 -3.73 -0.94 0 -4.67 3.73 -3.73 4.67 0 0.94 3.73 4.67 4.67 3.73 0.94 0"></polygon>
                </g>
            </g>
            <circle r="18.9" cursor="pointer" class="pipeline-node-hittarget" id="pipeline-node-hittarget-2-add"
                    fill-opacity="0" stroke="none"></circle>
        </g>
    );
    res.push(
        <g transform="translate(150,60)" class="editor-graph-nodegroup errors">
            <g>
                <circle class="editor-graph-node" r="12.5"></circle>
                <circle class="editor-graph-node-inner" r="9.3"></circle>
            </g>
            <circle r="18.9" cursor="pointer" class="pipeline-node-hittarget" id="pipeline-node-hittarget-4"
                    fill-opacity="0" stroke="none"></circle>
        </g>
    );
    res.push(
        <g transform="translate(150,130)" class="editor-graph-nodegroup">
            <g>
                <circle class="editor-graph-node" r="12.5"></circle>
                <circle class="editor-graph-node-inner" r="9.3"></circle>
            </g>
            <circle r="18.9" cursor="pointer" class="pipeline-node-hittarget" id="pipeline-node-hittarget-3"
                    fill-opacity="0" stroke="none"></circle>
        </g>
    );
    res.push(
        <g transform="translate(270,130)" class="editor-graph-nodegroup">
            <g>
                <circle class="editor-add-node-placeholder" r="11" stroke-width="1.7"></circle>
                <g class="result-status-glyph" transform="rotate(45)">
                    <polygon
                        points="4.67 -3.73 3.73 -4.67 0 -0.94 -3.73 -4.67 -4.67 -3.73 -0.94 0 -4.67 3.73 -3.73 4.67 0 0.94 3.73 4.67 4.67 3.73 0.94 0"></polygon>
                </g>
            </g>
            <circle r="18.9" cursor="pointer" class="pipeline-node-hittarget" id="pipeline-node-hittarget-3-add"
                    fill-opacity="0" stroke="none"></circle>
        </g>
    );
    res.push(
        <g transform="translate(270,60)" class="editor-graph-nodegroup selected">
            <g>
                <circle class="editor-graph-node" r="12.5"></circle>
                <circle class="editor-graph-node-inner" r="9.3"></circle>
            </g>
            <circle r="18.9" cursor="pointer" class="pipeline-node-hittarget" id="pipeline-node-hittarget-6"
                    fill-opacity="0" stroke="none"></circle>
        </g>
    );
    res.push(
        <g transform="translate(390,60)" class="editor-graph-nodegroup">
            <g>
                <circle class="editor-add-node-placeholder" r="11" stroke-width="1.7"></circle>
                <g class="result-status-glyph" transform="rotate(45)">
                    <polygon
                        points="4.67 -3.73 3.73 -4.67 0 -0.94 -3.73 -4.67 -4.67 -3.73 -0.94 0 -4.67 3.73 -3.73 4.67 0 0.94 3.73 4.67 4.67 3.73 0.94 0"></polygon>
                </g>
            </g>
            <circle r="18.9" cursor="pointer" class="pipeline-node-hittarget" id="pipeline-node-hittarget-4-add"
                    fill-opacity="0" stroke="none"></circle>
        </g>
    );
    return res;
}

// return Line elements
function RenderLineElements(data) {
    let res = new Array();
    res.push(
        <path class="pipeline-connector placeholder" stroke-width="3.2"
              d="M 30 60
           l 60 0
           c 12 0 12 12 12 12
           l 0 116
           c 0 12 12 12 12 12
           l 36 0" fill="none"></path>
    );
    res.push(
        <path class="pipeline-connector placeholder" stroke-width="3.2"
              d="M 30 60
           l 60 0
           c 12 0 12 12 12 12
           l 0 186
           c 0 12 12 12 12 12
           l 36 0" fill="none"></path>
    );
    res.push(
        <line class="pipeline-connector" stroke-width="3.2" x1="30" y1="60" x2="150" y2="60"></line>
    );
    res.push(
        <path class="pipeline-connector" stroke-width="3.2"
              d="M 30 60
           l 60 0
           c 12 0 12 12 12 12
           l 0 46
           c 0 12 12 12 12 12
           l 36 0" fill="none"></path>
    );
    res.push(
        <path class="pipeline-connector placeholder" stroke-width="3.2"
              d="M 150 60
           l 60 0
           c 12 0 12 12 12 12
           l 0 46
           c 0 12 12 12 12 12
           l 36 0" fill="none"></path>
    );
    res.push(
        <line class="pipeline-connector" stroke-width="3.2" x1="150" y1="60" x2="270" y2="60"></line>
    );
    res.push(
        <path class="pipeline-connector" stroke-width="3.2"
              d="M 150 130 l 36 0 c 12 0 12 -12 12 -12 l 0 -46 c 0 -12 12 -12 12 -12 l 60 0" fill="none"></path>
    );
    res.push(
        <line class="pipeline-connector placeholder" stroke-width="3.2" x1="270" y1="60" x2="390" y2="60"></line>
    );

    return res;
}
