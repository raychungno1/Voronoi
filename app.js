import { Circle } from "./canvas/circle.js";
import { Line } from "./canvas/line.js";
import { Point } from "./voronoi/point.js";
import { VoronoiDiagram } from "./voronoi/vor.js";

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 2;

window.addEventListener("resize", function() {
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;
    vor = init(points, canvas.width, canvas.height);
})

let mouse = {
    x: undefined,
    y: undefined
}
window.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

// function init(c, circles, edges) {
//     for (let i = 0; i < 10; i++) {
//         let radius = 3;
//         let x = (Math.random() * (canvas.width - 2*radius)) + radius;
//         let y = (Math.random() * (canvas.height - (2*radius))) + radius;
//         circles.push(new Circle(x, y, radius));//.draw(c));
//         if (i) edges.push(new Line(circles[circles.length - 2], circles[circles.length - 1], radius));//.draw(c));
//     }
//     Line.drawLines(c, ...edges);
//     Circle.drawCircles(c, ...circles);
// }

function init(points, width, height) {
    let radius = 3;
    for (let i = 0; i < 10; i++) {
        let x = (Math.random() * (width - 2*radius)) + radius;
        let y = (Math.random() * (height - (2*radius))) + radius;
        points.push(new Point(x, y));
    }

    // Generate voronoi diagram
    let vor = new VoronoiDiagram(points, width, height); 
    vor.update();
    
    // Edges of the Voronoi diagram
    let e = vor.edges;
    // Vertices of the Voronoi diagram
    let v = vor.voronoi_vertex;

    points.forEach(point => new Circle(point.x, point.y, 3).draw(c));
    e.forEach(edge => {
        if (edge) new Line(new Circle(edge.start.x, edge.start.y), new Circle(edge.end.x, edge.end.y), 3).draw(c)
    });
}

let c = canvas.getContext("2d");
let points = [];
let vor = init(points, canvas.width, canvas.height);
