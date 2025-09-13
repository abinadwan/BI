Place your local TTF fonts here to embed into PDFs without any CDN:

- Almarai-Regular.ttf
- Almarai-Bold.ttf
- Inter-Regular.ttf (or any Latin font)
- Inter-Bold.ttf

The app will attempt to load these at runtime via fetch('fonts/<name>.ttf').
If a font is missing, it will fall back to built-in Helvetica.

