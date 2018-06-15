(function () {
    const svgContainer = document.getElementById('svg-container');
    const tSlider = document.getElementById('t-slider');


    // function drawBezier(className, step, holdingPoints) {
    //     const bezier = new(Function.prototype.bind.apply(Bezier, [undefined].concat(holdingPoints)));

    //     for (holdingPoint of holdingPoints) {
    //         svgContainer.appendChild(createCircleAt(holdingPoint.x, holdingPoint.y, 'holding-point ' + className));
    //     }

    //     svgContainer.appendChild(createPolyline('holding', holdingPoints));

    //     for (let t = 0; t <= 1; t += step) {
    //         const point = bezier.at(t);
    //         svgContainer.appendChild(createCircleAt(point.x, point.y, 'intermidiate ' + className));
    //     }
    // }

    function interactiveBezier(simpleSVG, className, holdingPoints) {
        console.log('simpleSVG', simpleSVG);
        const bezier = new(Function.prototype.bind.apply(Bezier, [undefined].concat(holdingPoints)));

        let interDots = [];
        let interDotLines = [];

        const c = {
            x: 0,
            y: 0
        };

        const dotsAmount = util.sum(holdingPoints.length);
        const linesAmount = util.sum(holdingPoints.length - 1);


        for (let i = 0; i < linesAmount; i++) {
            const level = util.level(bezier.grade - 1, i);
            const itemClassString = 'line ' + className + ' ' + ((level == 0 || i == dotsAmount - 1) ? (level == 0 ? 'holding' : 'final') : 'intermidiate intermidiate-' + level);
            interDotLines[i] = simpleSVG.createLine(itemClassString, c, c);
        }

        for (let i = 0; i < dotsAmount; i++) {
            const level = util.level(bezier.grade, i);
            const itemClassString = 'point ' + className + ' ' + ((level == 0 || i == dotsAmount - 1) ? (level == 0 ? 'holding' : 'final') : 'intermidiate intermidiate-' + level) + ' pointname-' + String.fromCharCode(65 + i);
            interDots[i] = simpleSVG.createCircleAt(0, 0, itemClassString);
        }

        function setPointAt(t) {
            let points = bezier.atWithIntermidiate(t);

            let interDotLineCounter = 0;
            for (let i = 0; i < points.length; i++) {

                interDots[i].cx.baseVal.value = points[i].x;
                interDots[i].cy.baseVal.value = points[i].y;

                if (util.level(bezier.grade, i) == util.level(bezier.grade, i + 1)) {
                    interDotLines[interDotLineCounter].x1.baseVal.value = points[i].x;
                    interDotLines[interDotLineCounter].y1.baseVal.value = points[i].y;
                    interDotLines[interDotLineCounter].x2.baseVal.value = points[i + 1].x;
                    interDotLines[interDotLineCounter].y2.baseVal.value = points[i + 1].y;

                    interDotLineCounter++;
                }
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

    const interactives = []
    interactives[interactives.length] = interactiveBezier(new SimpleSVG(document.getElementById('svg-container-a')), 'bez-1', [{
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

    interactives[interactives.length] = interactiveBezier(new SimpleSVG(document.getElementById('svg-container-b')), 'bez-2', [{
            x: 20,
            y: 80
        },
        {
            x: 40,
            y: 40
        }, {
            x: 60,
            y: 20
        },
        {
            x: 100,
            y: 20
        },
        {
            x: 120,
            y: 40
        },
        {
            x: 140,
            y: 80
        }
    ]);

    tSlider.addEventListener('input', function (ev) {
        const t = parseFloat(ev.target.value);
        // interactive.setPointAt(t);
        for (let int of interactives)
            int.setPointAt(t);
    })

})()