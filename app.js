import { Point } from "./voronoi/point.js"

const canvas = document.querySelector("canvas")
canvas.width = window.innerWidth / 2
canvas.height = window.innerHeight / 2

window.addEventListener("resize", function() {
    canvas.width = window.innerWidth / 2
    canvas.height = window.innerHeight / 2
    init()
})

var mouse = {
    x: undefined,
    y: undefined
}
window.addEventListener("mousemove", function(event) {
    mouse.x = event.x
    mouse.y = event.y
})

function init() {
    let points = []
    for (let i = 0; i < 10; i++) {
        let radius = 3;
        let x = (Math.random() * (canvas.width - 2*radius)) + radius
        let y = (Math.random() * (canvas.height - (2*radius))) + radius
        points.push(new Point(x, y, radius).draw(c))
    }
}

let c = canvas.getContext("2d")
let points = init();
