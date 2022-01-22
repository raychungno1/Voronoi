import { Point } from "./voronoi/point.js";
import { VoronoiDiagram } from "./voronoi/vor.js";

const canvas = document.querySelector("canvas");
const canvasContainer = document.getElementById("canvas")
canvas.width = canvasContainer.getBoundingClientRect().width;
canvas.height = window.innerHeight / 2;

window.addEventListener("resize", function() {
    canvas.width = canvasContainer.getBoundingClientRect().width;
    canvas.height = window.innerHeight / 2;

    vor = init(c, canvas.width, canvas.height);
})

let mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

canvas.addEventListener("click", () => {
    let canvasRect = canvas.getBoundingClientRect();
    let x = mouse.x - canvasRect.left;
    let y = mouse.y - canvasRect.top;
    if (x > 3 && x < canvas.width - 3 &&
        y > 3 && y < canvas.height - 3) {
            // points.push(new Point(x, y, width, height));
            vor.point_list.push(new Point(x, y, canvas.width, canvas.height))
        }
});

function init(c, width, height) {
    
    let radius = 3;
    let points = []; // Generate points
    for (let i = 0; i < 10; i++) {
        let x = (Math.random() * (width - 2*radius)) + radius;
        let y = (Math.random() * (height - (2*radius))) + radius;
        points.push(new Point(x, y, width, height));
    }

    // Generate voronoi diagram
    let vor = new VoronoiDiagram(points, width, height); 
    vor.update();
    points.forEach(point => point.draw(c));
    vor.edges.forEach(edge => { if (edge) edge.draw(c) });
    return vor;
}

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, innerWidth, innerHeight)

    vor.point_list.forEach(point => point.update());
    vor.update();
    vor.point_list.forEach(point => point.draw(c));
    vor.edges.forEach(edge => { if (edge) edge.draw(c) });
}

let c = canvas.getContext("2d");
let vor = init(c, canvas.width, canvas.height);
animate();