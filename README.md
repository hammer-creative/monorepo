## Converting an mp4 file to animated gif

`ffmpeg -i input.mp4 -vf "fps=30,scale=800:-1:flags=lanczos,palettegen" palette.png`;`ffmpeg -i input.mp4 -i palette.png -filter_complex "fps=30,scale=800:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer" output.gif`

## Aspect ratios

• Hero: 2560×1440 → 16:9
• Text + Image: 980×700 → 14:10 (7:5 simplified ≈ 1.4:1)
• Full-wdith video: 1880×1060 → 47:26 (≈ 1.77:1, basically 16:9)
• 33% video: 600×1000 → 3:5
• 50% video: 940×1940 → 1:1
• Carousel slide: 680×680 → 1:1
• Impact image: 640×700 → 64:70 (≈ 0.91:1, simplified 32:35 ≈ 0.914:1)
