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
// push_collection_to_firebase(2);
// generate_collection();
// genEnglish();
// get_all_translate();
// create_html();
reform();
/*
* Read 20k_en.txt & me_en.json
* generate en_collection & en_setting */
function generate_collection() {
    fs.readFile('./40k_de.txt', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var arr = JSON.parse(data);
        var arr2 = [];
        for (var i = 1; i <= arr.length; i++) {
            // console.log(arr[i]);
            if (arr[i]) {
                arr2.push({
                    key: i,
                    value: {
                        de: arr[i],
                        ru: '',
                        html: null
                    }
                });
            }
        }
        words = arr2;
        fs.writeFile('./deutsche.json',JSON.stringify(words),function () {});
    });
}


function push_collection_to_firebase(part) {
    fs.readFile('deutsche.json', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var _data = JSON.parse(data).collection;
        console.log(_data.length);

        var pattern = _data.length.toString().split('').map(x => '0');

        for (var i = 0, j = 0; i < _data.length; i++, j++) {
            var _pattern = pattern.slice(-0, (-(_data[i].key - 1).toString().length));
            var index = _pattern.concat((i).toString().split('')).join('');

            if (part === 1 && i < 10000) {
              adminFire();
            }
            if (part === 2 && i >= 10000) {
              adminFire();
            }

            function adminFire() {
              admin.firestore().collection('Words').doc('AnEIKa6c15nc7b9c8vYd')
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
    fs.readFile('./deutsche.json', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var arr = JSON.parse(data);
        // arr.length = 3000;
        var arr2 = [];
        var menu = [];
        for (let k = 0; k < 20; k++) {
            menu.push(`<a href='word_${k + 1}.html'>word_${k + 1}</a> `);
        }
        var test = [];
        console.log(arr.length);
        for (var i = 0, j = 0, count = 0; i <= arr.length; i++, j++) {
            // if (arr[i] === 'constructor') {
            //     console.log(true)
            // }
                // console.log(arr[i]);
            if (arr[i]) {
                arr2.push(`<li data-word='${arr[i].value.de}' data-id='${arr[i].key}'>${arr[i].value.de}</li>`);
                // console.log(i, arr[i]);
                // if (i >= 10457 && i <= 10457) {
                //     test.push(`<li data-word='${arr[i]}' data-id='${i}'>${arr[i]}</li>`);
                // }
                if (j === 2000 || i === (arr.length - 1)) {
                    j = 0;
                    count++;
                    console.log(count);
                    var res = `<nav>${menu.join(' ')}</nav><button id='button'>get JSON</button><style>li {display: inline-block;font-size: 10px;line-height: 1;} nav {border-bottom: 1px solid #ccc; padding-bottom: 1em; margin-bottom: 1em;} nav a {display: inline-block;} nav a + a {border-left: 1px solid #ccc;padding: 0.2em 0.4em;} ul {font-size: 10px;}</style>
                                <ul id='ul' data-src='word_${count}.json'>${arr2.join(' ')}</ul>
                                <script src='https://code.jquery.com/jquery-3.5.1.min.js'></script>
                                <script src='../../words.js'></script>`;
                    fs.writeFile(`./words/de/word_${count}.html`,res.replace(/\\n/g, ''),function () {});
                    arr2 = [];
                }
            }
        }
        // fs.writeFile(`./words/word_test.html`, `<ol id='ul'>${test.join(' ')}</ol>`,function () {});
    });
}

function get_all_translate() {
    let arr = [];
    for (let i = 1; i <= 20; i++) {
        fs.readFile(`./words/de/word_${i}.json`, 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            // console.log(...JSON.parse(data))
            // console.log(typeof data, JSON.parse(data))
            // setTimeout(() => {
                arr = [...arr, ...JSON.parse(data)]
            // }, 10);
        });
    }
    setTimeout(() => {
        console.log(arr.length);
        const wrong = arr.filter(item => !item.value.ru.trim() || (item.value.de + '').toLowerCase() === item.value.ru.toLowerCase());
        console.log(wrong.length);
        arr = arr.filter(item => item.value.ru.trim() && (item.value.de + '').toLowerCase() !== item.value.ru.toLowerCase());
        console.log(arr.length);
        fs.writeFile('./de_wrong.json',JSON.stringify(wrong),function () {});
        fs.writeFile('./de_words.json',JSON.stringify(arr),function () {});

    }, 10000);
}

function reform() {
    fs.readFile(`./english.json`, 'utf8', function (err,data) {
        const _data = JSON.parse(data);
        // _data.length = 10;
        // [
        //     'collectionDescription',
        //     'collection',
        //     'settingsDescription',
        //     'settings',
        //     'wrongDescription',
        //     'wrong'
        // ]
        const collection = _data.collection.map(item => {
            const _item = {
                key: item.key,
                value: {
                    source: item.value.en,
                    target: item.value.ru,
                    html: item.value.html || null,
                    other: item.value.other && {
                        key: item.value.other.key,
                        source: item.value.other.en,
                        target: item.value.other.ru,
                        additional: item.value.other.additional && {
                            source: item.value.other.additional.en,
                            target: item.value.other.additional.ru
                        } || item.value.other.additional || null
                    } || item.value.other || null
                }
            }
            return _item;
        });
        const wrong = _data.wrong.map(item => {
            const _item = {
                key: item.key,
                value: {
                    source: item.value.en,
                    target: item.value.ru,
                }
            }
            return _item;
        });
        const settings = _data.settings.map(item => {
            const _item = {
                key: item.key,
                source: item.en,
                target: item.ru,
                additional: item.additional && {
                    source: item.additional.en,
                    target: item.additional.ru,
                } || null
            }
            return _item;
        });

        const res = {
            ..._data,
            collection,
            wrong,
            settings,
        }
        fs.writeFile('./english.json',JSON.stringify(res),function () {});

    });
}

function genEnglish() {
    const files = ['collection', 'words', 'wrong', 'settings'];
    const obj = {};
    for (let i = 0; i < files.length; i++) {
        fs.readFile(`./en_${files[i]}.json`, 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            obj[files[i]] = JSON.parse(data);
        });
    }
    setTimeout(() => {
        console.log(obj.collection.length, 'collection');
        console.log(obj.settings.length, 'settings');
        console.log(obj.wrong.length, 'wrong');
        console.log(obj.words.length, 'words');
        console.log('>>>>>>>>>');
        console.time('time');
        collectFor: for (let i = 0; i < obj.collection.length; i++) {
            const collect = obj.collection[i];
            printProgress(`${i}`);
            if (collect.key === 830) {
                collect.key = {"key":830,"value":{"en":'true',"ru":"правда"}};
            }
            if (collect.key === 2391) {
                collect.key = {"key":2391,"value":{"en":'false',"ru":"ложный"}};
            }
            if (collect.key === 2577) {
                collect.key = {"key":2577,"value":{"en":'null',"ru":"ноль"}}
            }
            wordsFor: for (let j = 0; j < obj.words.length; j++) {
                let word = obj.words[j];
                if(word) {
                    if(collect.key === word.key && collect.value.en.toLowerCase() === word.value.en.toLowerCase()) {
                        collect.value.ru = word.value.ru;
                        obj.words[j] = null;
                        continue wordsFor;
                        continue collectFor;
                        // console.log(obj.collection[i].key, obj.words[i].key)
                    }
                }
                // obj.english = [...obj.english, ]
            }
        }
        console.timeEnd('time');
        console.log('>>>>>>>>>');
        console.log(obj.collection.length, 'collection');
        console.log(obj.settings.length, 'settings');
        console.log(obj.wrong.length, 'wrong');
        console.log(obj.words.length, 'words');
        console.log('>>>>>>>>>');
        const english = {
            collectionDescription: 'Основной словарь.отправить на Firebase в коллекции.',
            collection: obj.collection.filter(item => (item.value.ru + '').trim()),
            settingsDescription: 'Остатки словаря после слияния коллекции и старого словаря на 13000 слов (memrise)',
            settings: obj.settings,
            wrongDescription: 'Ошибки перевода',
            wrong: obj.wrong
        };
        console.log(english.collection.length, 'collection');
        console.log(english.settings.length, 'settings');
        console.log(english.wrong.length, 'wrong');
        fs.writeFile('./english.json',JSON.stringify(english),function () {});
        console.log(obj.words.filter(item => item).length);
        console.log(obj.words.filter(item => item));
    }, 10000);
}
function printProgress(progress){
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(progress);
}
