(function () {
    const svgContainer = document.getElementById('svg-container');
    const tSlider = document.getElementById('t-slider');
    const namespace = 'http://www.w3.org/2000/svg';

    const createSVGElement = document.createElementNS.bind(document, namespace);

    function createCircleAt(x, y, className) {
        const circle = createSVGElement('circle');
        circle.cx.baseVal.value = x;
        circle.cy.baseVal.value = y;
        circle.r.baseVal.value = 2.5;

        circle.className.baseVal = className;

        // circle.style.fill = "rgb(200,20,20)";

        return circle;
    }

    function createPolyline(className, ...points) {
        if (points[0] instanceof Array)
            points = points[0];

        const polyline = createSVGElement('polyline');
        console.log(polyline);
        for (point of points) {
            const svgPoint = svgContainer.createSVGPoint();
            svgPoint.x = point.x;
            svgPoint.y = point.y;

            polyline.points.appendItem(svgPoint);
        }

        polyline.style.fill = "none";
        polyline.style.stroke = "black";

        return polyline;
    }

    function createLine(className, a, b) {
        const line = createSVGElement('line');

        line.x1.baseVal.value = a.x;
        line.y1.baseVal.value = a.y;

        line.x2.baseVal.value = b.x;
        line.y2.baseVal.value = b.y;

        line.className.baseVal = className;
        line.style.stroke = 'black';

        return line;
    }

    // const c1 = createCircleAt(0, 0);
    // const c2 = createCircleAt(300, 200);


    function drawBezier(className, step, holdingPoints) {
        const bezier = new(Function.prototype.bind.apply(Bezier, [undefined].concat(holdingPoints)));

        for (holdingPoint of holdingPoints) {
            svgContainer.appendChild(createCircleAt(holdingPoint.x, holdingPoint.y, 'holding-point ' + className));
        }

        svgContainer.appendChild(createPolyline('holding', holdingPoints));

        for (let t = 0; t <= 1; t += step) {
            const point = bezier.at(t);
            svgContainer.appendChild(createCircleAt(point.x, point.y, 'intermidiate ' + className));
        }
    }

    function interactiveBezier(className, step, holdingPoints) {
        const bezier = new(Function.prototype.bind.apply(Bezier, [undefined].concat(holdingPoints)));

        for (holdingPoint of holdingPoints) {
            svgContainer.appendChild(createCircleAt(holdingPoint.x, holdingPoint.y, 'holding-point ' + className));
        }

        svgContainer.appendChild(createPolyline('holding', holdingPoints));

        let circle;
        let dots = [];
        let interDotLines = [];

        interDotLines

        function setPointAt(t) {
            let points = bezier.atWithIntermidiate(t);

            if (!circle) {
                circle = createCircleAt(points.point.x, points.point.y, 'intermidiate ' + className);
                svgContainer.appendChild(circle);
            } else {
                circle.cx.baseVal.value = points.point.x;
                circle.cy.baseVal.value = points.point.y;
            }


            for (let i = 0; i < intermediatesPoints.length; i++) {
                let intermidiateLevel = calcLevel(i, bezier.grade);

                if (!dots[i]) {
                    dots[i] = createCircleAt(intermediatesPoints[i].x, intermediatesPoints[i].y, 'intermidiate-' + intermidiateLevel + ' ' + className);
                    dots[i].id = 'intermidiate-' + i;
                    svgContainer.appendChild(dots[i]);
                } else {
                    dots[i].cx.baseVal.value = intermediatesPoints[i].x;
                    dots[i].cy.baseVal.value = intermediatesPoints[i].y;
                }


                if ((intermidiateLevel == calcLevel(i + 1, bezier.grade)) && !isNaN(calcLevel(i + 1, bezier.grade))) {
                    // console.log('using', i, i + 1)
                    if (!interDotLines[i]) {
                        interDotLines[i] = createLine('intermidiate-line-' + intermidiateLevel + ' ' + className, intermediatesPoints[i], intermediatesPoints[i + 1]);
                        svgContainer.appendChild(interDotLines[i]);
                    } else {
                        interDotLines[i].x1.baseVal.value = intermediatesPoints[i].x;
                        interDotLines[i].y1.baseVal.value = intermediatesPoints[i].y;
                        interDotLines[i].x2.baseVal.value = intermediatesPoints[i + 1].x;
                        interDotLines[i].y2.baseVal.value = intermediatesPoints[i + 1].y;
                    }
                }
                // else console.log(i, 'and', i + 1, 'do nate have the same level of ', calcLevel(i, bezier.grade), 'and', calcLevel(i + 1, bezier.grade))

            }
        }

        setPointAt(0.5);

        return {
            setPointAt: setPointAt
        }
    }
    /*
        drawBezier('bez-1', 0.05, [{
                x: 30,
                y: 30
            },
            {
                x: 70,
                y: 30
            }, {
                x: 250,
                y: 180
            },
            {
                x: 290,
                y: 180
            }
        ])
    */
    const interactive = interactiveBezier('bez-1', 0.05, [{
            x: 30,
            y: 30
        },
        {
            x: 130,
            y: 30
        }, {
            x: 190,
            y: 180
        },
        {
            x: 290,
            y: 180
        }
    ]);

    tSlider.addEventListener('input', function (ev) {
        const t = parseFloat(ev.target.value);
        interactive.setPointAt(t);

    })

})()