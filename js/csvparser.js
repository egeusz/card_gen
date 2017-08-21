var csvparse = require('csv-parse');
//
//
function parse(csv, config, _callback) {



    csvparse(csv, {}, function(err, data) {
        if (err) {
            return _callback(err);
        }

        var cards = [];
        //step through each row and organize the card data. 
        for (var i = 0; i < data.length; i++) {


            var row = data[i];
            if (row.length != config.col_types.length) {
                var err = "Error: The number of columns in the csv do not match the number of collumn types (col_types) in the config.";
                return _callback(err);
            }


            //Get feilds
            var card = {
                type: null,
                subtype: null,
                title: null,
                rules: [],
                helps: [],
                flavors: [],
            }

            for (var j = 0; j < row.length; j++) {
                var r = row[j].trim();

                switch (config.col_types[j]) {
                    case "type":
                        card.type = r;
                        break;
                    case "subtype":
                        card.subtype = r;
                        break;
                    case "title":
                        card.title = r;
                        break;
                    case "rule":
                        if (r != '') {
                            card.rules.push(r);
                        }
                        break;
                    case "help":
                        if (r != '') {
                            card.helps.push(r);
                        }
                        break;
                    case "flavor":
                        if (r != '') {
                            card.flavors.push(r);
                        }
                        break;
                    default:

                }
            }

            //console.log(card);

            cards.push(card);
            //console.log(card);

        }
        _callback(null, cards);
    });
}


module.exports = {
    parse: parse,

}