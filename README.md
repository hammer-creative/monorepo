## Converting an mp4 file to animated gif

`ffmpeg -i input.mp4 -vf "fps=30,scale=800:-1:flags=lanczos,palettegen" palette.png`;`ffmpeg -i input.mp4 -i palette.png -filter_complex "fps=30,scale=800:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer" output.gif`

## Aspect ratios

Case Studies Pixel Dimensions (W×H) Aspect Ratio
Case study hero image 3840 × 2160 16:9
Text + image module 1960 × 1400 7:5
Inline video poster image 3840 × 2160 16:9
Vertical video poster image 1200 × 2000 3:5
Carousel image 1360 × 1360 1:1

Homepage
Homepage hero image 3840 × 2160 16:9
Homepage teaser image 1380 × 800 5:3-ish

Services Page
Services page hero image 3840 × 2160 16:9
Services summary image 3760 × 1080 32:9-ish

Video
Video (MP4 H.264 + AAC) 3840 × 2160 16:9
