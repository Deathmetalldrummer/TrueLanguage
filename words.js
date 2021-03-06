$('#button').on('click', (event) => {
    const file = $('#ul').attr('data-src');
    const list = $('#ul li');
    const arr = [];
    list.each((i, item) => {
        arr.push({
            key: $(item).data('id'),
            value: {
                de: $(item).data('word'),
                ru: $(item).text()
            }
        });
    });
    console.log(arr);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:5000/words',
        data: {
                file: file,
                content: JSON.stringify(arr)
            },
        success: function(msg){
            console.log( "Прибыли данные: ", msg );
        }, error: (error) => {
            console.log(error)
        }
    });
    // console.log($('#ul').text());
})
