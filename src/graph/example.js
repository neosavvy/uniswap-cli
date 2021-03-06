const Canvas = require("../../deps/canvas");
var rawData = require("./tmp.json");
var d3 = require("d3-shape");
var d3Array = require("d3-array");
var scaleLinear = require("d3-scale");
var now = require("performance-now");
const React = require("react");
const { Text, Box, Newline } = require("ink");

var a = 0.05;
var b = 1; //play with these values to your liking
var y;
let x = 0;
let test = [];
while (x < 500) {
  test.push({ y: x * Math.random(), x });
  x++;
}

console.log(
  new Date(d3Array.min(rawData.map((d) => d.timestamp * 1000))),
  new Date(d3Array.max(rawData.map((d) => d.timestamp * 1000)))
);
var xScale = scaleLinear
  .scaleTime()
  .domain([
    new Date(d3Array.min(rawData.map((d) => d.timestamp * 1000))),
    new Date(d3Array.max(rawData.map((d) => d.timestamp * 1000))),
  ])
  .range([0, 210]);
var yScale = scaleLinear
  .scaleLinear()
  .domain([0, d3Array.max(rawData.map((d) => d.open))])
  .range([80, 0]);

const line = d3
  .line()
  .x((d) => xScale(new Date(d.timestamp * 1000)))
  .y((d) => yScale(d.open));

var canvas = new Canvas(200, 80);
const draw = (ctx) => {
  ctx.clearRect(0, 0, ctx.width, ctx.height);
  ctx.fillStyle = "red";
  ctx.beginPath();
  line.context(ctx)(rawData);
  // ctx.arc(ctx.width/2, ctx.height/2, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.fillStyle = "#000000";
  line.context(ctx)(rawData);
  // ctx.arc(ctx.width/2, ctx.height/2, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
  ctx.stroke();
  ctx.closePath();
  return ctx.toString();
};
const CanvasComponent = () => {
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    const c = canvas.getContext("2d");
    const timer = setInterval(() => {
      setContent(draw(c, 1000 / 30));
    }, 1000 / 30);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <Box borderColor="red" borderStyle="round" flexDirection={"column"}>
      <Text color={"white"}>UNI-ETH | last 7</Text>
      <Newline />
      <Text color={"green"}> {content}</Text>
    </Box>
  );
};

module.exports = CanvasComponent;
