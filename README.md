## Converting an mp4 file to animated gif

`ffmpeg -i input.mp4 -vf "fps=30,scale=800:-1:flags=lanczos,palettegen" palette.png`;`ffmpeg -i input.mp4 -i palette.png -filter_complex "fps=30,scale=800:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer" output.gif`
