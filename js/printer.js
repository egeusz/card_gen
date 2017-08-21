PDFDocument = require('pdfkit');


function printCards(cards, config, _callback) {

    //set up doc    
    var doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(config.output_name));

    var inchToUnit = 72;

    var page_width = config.pdf_page_width * inchToUnit;
    var page_height = config.pdf_page_height * inchToUnit;
    var margin = config.pdf_margin * inchToUnit;

    var card_width = config.card_width * inchToUnit;
    var card_height = config.card_height * inchToUnit;
    var card_gap = config.card_gap * inchToUnit;

    //calculate setup
    //where the upper left corner of the card is. 
    var pos = {
        x: margin,
        y: margin,
    }

    var num_cards_x = Math.floor((page_width - (margin * 2)) / (card_width + (card_gap * 2)));
    var num_cards_y = Math.floor((page_height - (margin * 2)) / (card_height + (card_gap * 2)));

    var num_pages = Math.ceil(cards.length / (num_cards_x * num_cards_y));

    console.log("num of cards:", cards.length);
    console.log("num of pages:", num_pages);
    console.log("cards per page:", num_cards_x * num_cards_y);
    console.log("row:", num_cards_x, "col:", num_cards_y);



    //======================================================================


    //doc.font('fonts/neuropol/NEUROPOL.ttf').fontSize(12);

    //doc.addPage();
    var row_count = 0;
    var col_count = 0;
    var page_count = 0;
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];


        //doc.text(card[0], pos.x * 50, pos.y * 50);
        drawCard(doc, card, pos, card_width, card_height, config)


        col_count++;
        if (col_count >= num_cards_x) {
            col_count = 0;
            row_count++;
            if (row_count >= num_cards_y) {
                row_count = 0;
                page_count++;
                doc.addPage();
            }
        }


        pos.y = margin + row_count * (card_height + card_gap);
        pos.x = margin + col_count * (card_width + card_gap);

        //console.log(pos);

    }

    doc.end();
    _callback();
}

//======================================================================
//Draw a card

function drawCard(doc, card, pos, width, height, config) {
    //console.log(width, height);
    console.log(".....", card.title);

    doc.rect(pos.x, pos.y, width, height);
    doc.stroke();

    //-------- TITLE
    doc.font(config.style_title.font);

    doc.fillColor(config.style_title.color);

    var title_length = config.style_title.size * card.title.length;
    var title_width = width - config.style_title.padding_x * 72 * 2;

    var title_pos_y = config.style_title.padding_y * 72;
    var title_pos_x = config.style_title.padding_x * 72;


    //scale font to avoid linewraps
    var title_font_size = config.style_title.size;

    if (title_length > title_width) {
        title_font_size = (title_width / card.title.length);
        if (title_font_size < config.style_title.min_siz) {
            title_font_size = config.style_title.min_siz;
        }
        //float title down a bit to make it look better
        title_pos_y += config.style_title.size - title_font_size;
    }
    doc.fontSize(title_font_size);
    doc.text(card.title,
        pos.x + title_pos_x,
        pos.y + title_pos_y, {
            width: title_width,
            //height: config.style_title.size * 4,
            //underline: true,
            align: 'center',
        });

    //-------- RULE TEXT
    var r_pos = {
        x: pos.x,
        y: (pos.y + config.style_title.box_height * 72)
    };
    for (var i = 0; i < card.rules.length; i++) {
        r_pos = drawText(doc, card.rules[i], r_pos, config.style_rule, width, height, config);
    }

    //-------- HELP TEXT  
    var h_pos = r_pos;
    for (var i = 0; i < card.helps.length; i++) {
        h_pos = drawText(doc, card.helps[i], h_pos, config.style_help, width, height, config);
    }

    //-------- FLAVOR TEXT
    var f_pos = h_pos;
    for (var i = 0; i < card.flavors.length; i++) {
        f_pos = drawText(doc, card.flavors[i], f_pos, config.style_flavor, width, height, config);
    }
    //pos.x + (config.style_title.padding_x * 72), pos.y + (config.style_title.padding_x * 72)

    return doc;
}


function drawText(doc, text, pos, style, width, height, config) {
    if (text == "" || !text) {
        return pos;
    }
    var text_width = width - style.padding_x * 72 * 2;
    var text_pos_x = style.padding_x * 72;
    var text_pos_y = style.padding_y * 72;

    //------------------------------------
    //trim around new lines. 
    text = trimLines(text);
    //------------------------------------
    //compile text chunks

    var chunkstyles = config.icons;
    chunkstyles.push({
        font: style.font,
        color: style.color,
        size: style.size,
    })


    var chunks = spitText(text, chunkstyles, 0);

    for (var i = 0; i < chunks.length; i++) {
        var chunk = chunks[i];

        //doc.font(config.style_rule.font);
        doc.font(chunk.font);
        //doc.fillColor(config.style_rule.color);
        doc.fillColor(chunk.color);
        //doc.fontSize(config.style_rule.size);
        doc.fontSize(chunk.size);

        var settings = {}

        if (i == 0) {
            settings.width = text_width;
            settings.align = style.align;
            settings.lineGap = style.linegap;
            if (chunks.length > 1) {
                settings.continued = true;
            }

            doc.text(chunk.text, pos.x + text_pos_x, pos.y + text_pos_y, settings);
        } else {
            if (i < chunks.length - 1) {
                settings.continued = true;
            } else {
                settings.continued = false;
            }
            doc.text(chunk.text, settings);
        }

    }

    pos.y = doc.y + style.padding_y * 72;
    return pos;
}

function trimLines(_text) {
    if (!_text) {
        return "";
    }
    var texts = _text.split("\n");
    var text = "";
    for (var i = 0; i < texts.length; i++) {
        text += texts[i].trim();
        text += "\n";
    }

    return text;
}



function spitText(_text, styles, index) {
    var style = styles[index];

    if (!_text) {
        return [];
    } else if (index == styles.length - 1) { //this is the last chunk to check
        //the last chunk is always just the default. No splitting nessisary 
        return [{
            text: _text,
            font: style.font,
            color: style.color,
            size: style.size,
        }];

    } else {

        var chunks = [];

        var texts = _text.split(style.text);

        for (var i = 0; i < texts.length; i++) {

            //posibly trim?
            var text = texts[i];
            if (style.trim) {
                text = text.trim();
            }

            //search text for the other styles
            chunks = chunks.concat(spitText(text, styles, index + 1));

            if (i < texts.length - 1) {
                chunks.push(style);
            }
        }
        return chunks;
    }
}


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

module.exports = {
    printCards: printCards,
}