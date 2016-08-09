#!/usr/bin/env node

const fs  = require("fs");

const Png = require("pngjs").PNG;
const program = require("commander");

const canvas  = require(`${__dirname}/lib/canvas.js`);
const palettes = require(`${__dirname}/lib/palettes.js`);

/* Command line arguments */
program
.version("0.0.1")
.usage("[options]")
.option("-o, --out <filename>", "Output file")
.option("-r, --radius <n>", "Circle radius", parseInt)
.option("-w, --width <n>",  "Image width",   parseInt)
.option("-l, --length <n>", "Image height",  parseInt)
.option("-m, --margin <n>", "Space between circles", parseInt)
.option("-f, --filter <n>", "Png filtering method [0-4]", parseInt)
.option("-p, --palette <name>", "Color palette name", (p) => { 
    if (p in palettes) return p;
    else throw new Error("Palette not found!");
}).parse(process.argv);

/* Default arguments */
const outf   = program.out || "out.png";
const filter = program.filter || 4;
const width  = program.width  || 512;
const height = program.length || 512;
const radius = program.radius  || 20;
const margin   = program.margin  || Math.floor(radius / 8);
const palette  = program.palette || "rainbow";

/* Calculate proportions from input dimensions */
const diameter = radius * 2;
const col_max = Math.floor(width  / (diameter + margin));
const row_max = Math.floor(height / (diameter + margin));
const col_sz  = col_max % 2 === 0 ? col_max - 1 : col_max;
const row_sz  = row_max % 2 === 0 ? row_max - 1 : row_max;

const start_x  = Math.floor((width  - (diameter + margin) * col_sz) / 2) + radius;
const start_y  = Math.floor((height - (diameter + margin) * row_sz) / 2) + radius;

const c = canvas(new Png({filter, width, height}));
const chunks = fs.readFileSync(`${__dirname}/../data/digits.txt`, "utf8")
                 .match(new RegExp(`.{${col_sz}}`, "g"))
                 .slice(0, row_sz);

/* Image generation */
c.fill(0x000000ff);
for (const [ci, chunk] of chunks.entries())
for (const [di, digit] of [...chunk].entries()) {
        c.circle(start_x + (diameter + margin) * di, 
                 start_y + (diameter + margin) * ci,
                 radius, palettes[palette][digit]);
}

c.get_image().pack().pipe(fs.createWriteStream(outf));
