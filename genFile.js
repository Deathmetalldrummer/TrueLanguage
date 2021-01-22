var admin = require("firebase-admin");
var serviceAccount = require("./adminConfig.json");
var fs = require('fs');
var words;
var me;
var lang = 'eng';
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();

// push_en_settings();
// push_collection_to_firebase(1);
// generate_collection(1);

create_html();
/*
* Read 20k_en.txt & me_en.json
* generate en_collection & en_setting */
function generate_collection() {
    fs.readFile('./20k_en.txt', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var arr = data.split('\n');
        var arr2 = [];
        for (var i = 1; i <= arr.length; i++) {
            // console.log(arr[i]);
            if (arr[i]) {
                arr2.push({
                    key: i,
                    value: {
                        en: arr[i],
                        ru: '',
                        other: null,
                        html: null
                    }
                });
            }
        }
        words = arr2;
        fs.readFile('./me_en.json', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            me = JSON.parse(data.replace(/"memerise":{/g, '"additional":{')).filter(function (item) {
                return item;
            }).map(function (item, index) {
                return {
                    ...item,
                    key: index
                };
            });
            console.log(me.length);
            for (var j = 0; j < words.length; j++) {
                var itemJ = words[j];
                for (var i = 0; i < me.length; i++) {
                    var itemI = me[i];
                    if ((itemI && itemI.en.toLowerCase()) === itemJ.value.en.toLowerCase()) {
                        if (!itemJ.value.other) {
                            itemJ.value.other = itemI;
                            me.splice(i, 1);
                        } else {
                        }
                    }
                }
            }
            fs.writeFile('./en_settings.json',JSON.stringify(me),function () {});
            fs.writeFile('./en_collection.json',JSON.stringify(words),function () {});
            // for (var i = 0; i < words.length; i++) {
            //     console.log(lang[0].doc.settings.name);
            //     // admin.firestore().collection('Words').doc(lang[0].collection)
            //     //     .collection('collection').doc(words[i].key).set(words[i]).then(respond=>{
            //     //         // console.log(respond);
            //     //     }).catch(error=>{
            //     //         console.log(error);
            //     //     })
            // }
            // for (var k = 0; k < Math.ceil((words.length / 1000)); k++) {
            //     var start = 1000 * k;
            //     var end = 1000 * (k + 1);
            //     end = end > words.length ? words.length : end;
            //     // console.log(words.slice(start, end).length);
            //     // console.log(words.slice(start, end)[0].key);
            //     // console.log('>>>>>>>>');
            //
            //     // if (k < 10) {
            //     //     doc.collection('en').doc('thousand_0'+k).set({words: words.slice(start, end)});
            //     // } else {
            //     //     doc.collection('en').doc('thousand_'+k).set({words: words.slice(start, end)});
            //     // }
            // }
        });
    });
}


function push_collection_to_firebase(part) {
    fs.readFile('./en_collection.json', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var _data = JSON.parse(data);
        console.log(_data.length);

        var pattern = _data.length.toString().split('').map(x => '0');

        for (var i = 0, j = 0; i < _data.length; i++, j++) {
            var _pattern = pattern.slice(-0, (-(_data[i].key - 1).toString().length));
            var index = _pattern.concat((i).toString().split('')).join('');

            if (part === 1 && i < 10000) {
              // adminFire();
            }
            if (part === 2 && i >= 10000) {
              // adminFire();
            }

            function adminFire() {
              admin.firestore().collection('Words').doc(lang[0].collection)
                      .collection('collection').doc(`${index}`).set(_data[i].value).then(respond=>{
                          // console.log(respond);
                      // console.log(true, index);
                      }).catch(error=>{
                          console.log(error);
                      })
            }
        }
    });

}
function push_en_settings() {
    fs.readFile('./en_settings.json', 'utf8', function (err,data) {
        // admin.firestore().collection('Words').doc(lang[0].collection).update({
        //     words: ''
        // })
    });
}


function create_html() {
    fs.readFile('./20k_en.txt', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var arr = data.split('\n');
        var arr2 = [];
        var menu = [];
        for (let k = 0; k < 14; k++) {
            menu.push(`<a href='word_${k + 1}.html'>word_${k + 1}</a> `);
        }
        for (var i = 1, j = 0, count = 0; i <= arr.length; i++, j++) {
            // console.log(arr[i]);
            if (arr[i]) {
                arr2.push(`<li data-word='${arr[i]}' data-id='${i}'>${arr[i]}</li>`);
                // console.log(i, arr[i]);
                if (j === 1500 || i === 19999) {
                    j = 0;
                    count++;
                    console.log(count);
                    var res = `<nav>${menu.join(' ')}</nav><button id='button'>get JSON</button><style>li {display: inline-block;font-size: 6px;line-height: 1;} nav {border-bottom: 1px solid #ccc; padding-bottom: 1em; margin-bottom: 1em;} nav a {display: inline-block;} nav a + a {border-left: 1px solid #ccc;padding: 0.2em 0.4em;}</style>
                                <ul id='ul' data-src='word_${count}.json'>${arr2.join(' ')}</ul>
                                <script src='https://code.jquery.com/jquery-3.5.1.min.js'></script>
                                <script src='../words.js'></script>`;
                    fs.writeFile(`./words/word_${count}.html`,JSON.stringify(res),function () {});
                    arr2 = [];
                }
            }
        }
    });
}