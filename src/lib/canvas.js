module.exports = (img)  => {
    return {
        get_image:  () => img,
        get_height: () => img.height,
        get_width:  () => img.width,

        fill (color) {
            for (let y=0; y<img.height; y++)
            for (let x=0; x<img.width; x++)
                this.put_pixel(x, y, color);
        },

        circle (center_x, center_y, radius, color) {
            for(let y=-radius; y<=radius; y++)
            for(let x=-radius; x<=radius; x++)
                if(x * x + y * y <= radius * radius)
                    this.put_pixel(center_x + x, center_y + y, color);
        },

        put_pixel (x, y, color) {
            const idx = (img.width * y + x) << 2;
            img.data[idx] = color >> 24;
            img.data[idx + 1] = color >> 16 & 0xFF;
            img.data[idx + 2] = color >>  8 & 0xFF;
            img.data[idx + 3] = color & 0xFF;
        }
    }
}