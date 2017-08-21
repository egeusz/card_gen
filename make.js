fs = require('fs');
//Create a document

config = require('./config');
csvparser = require('./js/csvparser');
printer = require('./js/printer');


//>>>>LOAD CARD DATA<<<<<<<
var carddata_path = './' + config.input_csv;
//check if the card data actually exists
if (!fs.existsSync(carddata_path)) {
    //File does not exist
    console.error("Error: Could not find csv of card data at:\n    \"" + __dirname + "\\" + carddata_path + "\"\nMake sure that the name is correct in config.js and that it is in the correct folder.")
    process.exit(1);
}
var csv = fs.readFileSync(carddata_path, 'utf8');
var cards = csvparser.parse(csv, config, (err, cards) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    printer.printCards(cards, config, () => {
        console.log("...done");
    });

});




/*

doc = new PDFDocument();
// # Pipe its output somewhere, like to a file or HTTP response
// # See below
// for browser usage
doc.pipe(fs.createWriteStream('output.pdf'))

// # Embed a font, set the font size, and render some text
doc.font('fonts/neuropol/NEUROPOL.ttf')
    .fontSize(25)
    .text('Some text with an embedded font! POOOOP!', 100, 100)

// # Add another page
doc.addPage()
    .fontSize(25)
    .text('Here is some vector graphics...', 100, 100)

// # Draw a triangle
doc.save()
    .moveTo(100, 150)
    .lineTo(100, 250)
    .lineTo(200, 250)
    .fill("#FF3300")

//# Apply some transforms and render an SVG path with the 'even-odd' fill rule
doc.scale(0.6)
    .translate(470, -380)
    .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
    .fill('red', 'even-odd')
    .restore()

//# Add some text with annotations
doc.addPage()
    .fillColor("blue")
    .text('Here is a link!', 100, 100)
    .underline(100, 100, 160, 27, "#0000FF")
    .link(100, 100, 160, 27, 'http://google.com/')

//# Finalize PDF file
doc.end()
*/