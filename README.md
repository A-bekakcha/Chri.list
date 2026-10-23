# Grocery list (retro)

One HTML file per page:

- index.html            home, one folder per category
- vegetables.html, fruits.html, meat.html, food-stuffs.html, attar.html, cleaning-products.html, bakery.html

Shared files:

- css/style.css         all styling
- js/art.js             the drawings
- js/shared.js          shopping list, quantity box, types box, share as picture
- js/home.js, js/category.js
- data/groceries_items.json   every product comes from this file

Run it from a web server, not by double-clicking the files (the browser blocks reading the JSON from file://):

    python3 -m http.server 8000     then open http://localhost:8000

Sharing the list as a picture uses the phone's share sheet, so it needs https (or localhost).

To give a product several types (like cheese), write it as { "name": "...", "options": ["...", "..."] } inside "kinds".
