var fs = require('fs');
var sourceViews = './src/views/';
var sourceComponent = './src/components/';
var type = process.argv[2];
var component = type === 'c' || type === 'C';
var views = type === 'v' || type === 'V';

function generateViews() {
    var args = arguments[0];
    for (var i = 3; i < args.length; i++) {
        var arg = args[i];
        var ComponentName = arg.charAt(0).toUpperCase() + arg.substring(1);
        arg = ComponentName;
        var _dir = sourceViews;
        var _file = _dir + "/" + arg + ".vue";

        var vue = `<template lang="pug">
    h1 {{message}}
</template>

<script>
     export default {
            name: '` + ComponentName + `',
            data() {
                return {
                    message: 'Слава Одину, ` + ComponentName + ` работает!'
                }
            }
        }
</script>

<style scoped lang='sass'>
</style>`;

        // fs.mkdir(_dir, {recursive: true}, cb);

        fs.writeFile(_file, vue, cb);
    }
}

function generateComponent() {
    var args = arguments[0];
    for (var i = 3; i < args.length; i++) {
        var arg = args[i];
        var ComponentName = arg.charAt(0).toUpperCase() + arg.substring(1);
        var _dir = sourceComponent;
        var _file = _dir + "/" + arg + ".vue";

        var vue = `<template lang="pug">
    h1 {{message}}
</template>

<script>
    export default {
        name: '` + ComponentName + `',
        data() {
            return {
                message: 'Слава Одину, ` + ComponentName + ` работает!'
            }
        }
    }
</script>

<style scoped lang="sass"></style>`;

        fs.writeFile(_file, vue, cb);
    }
}

function cb() {
}

if (component) {
    generateComponent(process.argv);
}
if (views) {
    generateViews(process.argv);
}
