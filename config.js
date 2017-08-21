module.exports = {
    //name of the input csv exported from google docs
    input_csv: "cards/carddata.csv",
    //name of the output pdf file
    output_name: "cards/output.pdf",

    //CARD SIZE
    card_width: 2.5, //in
    card_height: 3.25, //in
    card_gap: 0.05, //in

    //PAGE SIZE
    pdf_page_width: 8.5, //in
    pdf_page_height: 11, //in
    pdf_margin: 0.25, //in

    //FONTS
    font_rule: "",
    font_default_size: "", //font size will scale to try and fit all text.
    font_default_color: "#000",

    //the types of each collumn in the csv. IN ORDER
    //these must match the collumns 
    col_types: [
        "type", //<-item or action
        "subtype", //<-combat, movement, etc
        "title", //<-title of the card, The case of the string will be auto corrected to propper case (ie: pizza plANET -> Pizza Planet)
        "rule", //<- rule text
        "rule", //<- rule text
        "rule", //<- rule text
        "help", //<-help text 
        "flavor", //<- flavor text
    ],

    style_title: {
        //font: "./fonts/infinium_guardian/Infinium Guardian.ttf",
        font: "./fonts/nulshock/nulshock bd.ttf",
        size: 10,
        min_siz: 8, //long titles will be shrunk in an attempt to make them fit. min_size is the smallest they can be shrunk
        color: "#000099",
        padding_x: 0.075, //in
        padding_y: 0.075, //in

        box_height: 0.4, //in. The max height of the title's box
        align: 'center',
    },

    style_rule: {
        font: "./fonts/Saira_Semi_Condensed/SairaSemiCondensed-Regular.ttf",
        //font: "./fonts/arial/arial.ttf",
        size: 10,
        min_siz: 6,
        linegap: -4, //Some fonts have stupid built in line gap. It might be nessary to use a negative number here to make it look right. 
        color: "#000000",
        padding_x: 0.075, //in
        padding_y: 0.075, //in
        align: 'left',
    },

    style_help: {
        font: "./fonts/Saira_Semi_Condensed/SairaSemiCondensed-Thin.ttf",
        //font: "./fonts/arial/arial.ttf",
        size: 8,
        min_siz: 6,
        linegap: -2, //Some fonts have stupid built in line gap. It might be nessary to use a negative number here to make it look right. 
        color: "#444444",
        padding_x: 0.075, //in
        padding_y: 0.075, //in
        align: 'left',
    },

    style_flavor: {
        font: "./fonts/arial/ariali.ttf",
        //font: "./fonts/arial/arial.ttf",
        size: 8,
        min_siz: 6,
        linegap: 0, //Some fonts have stupid built in line gap. It might be nessary to use a negative number here to make it look right. 
        color: "#000000",
        padding_x: 0.075, //in
        padding_y: 0.075, //in
        align: 'center',
    },

    //These are special icons that will get special formatting when found in the text. 
    icons: [{
        text: "●", //plasma
        font: "./fonts/arial/arial.ttf", //a very standard font hast to be used, since most custom fonts dont cover the full extended character set
        color: "#2233FF",
        size: 14,
    }, {
        text: "♦", //crystals
        font: "./fonts/arial/arial.ttf",
        color: "#FF00CC",
        size: 14,
    }, {
        text: "▲", //credits
        font: "./fonts/arial/arial.ttf",
        color: "#009922",
        size: 12,
    }]
}