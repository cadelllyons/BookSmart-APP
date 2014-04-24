
var manual_page = $$({
    model: {

    },
    view: {
        format: $('#manual_page').html(),
        style: '#manual-page { width: calc(100% - 20px); margin: 10% 10px 10px 10px; height: 60%; table-layout: fixed; }\
                table#manual-page tr td { margin: 0; padding: 0; }\
                .manual-input { height: 100%; width: calc(100% - 20px); padding: 10px; font-size: 1.5rem; font-family: Arial; background-color: #74B3A7; color: white; }\
                #manual-next { height: 100%; width: calc(100% - 20px); padding: 10px; font-size: 1.5rem; font-family: Arial; background-color: #665C52; color: white; text-align: center; }\
                #manual-title { font-size: 2rem; font-family: Arial; text-align: center; color: #665C52; padding: 20px; }'
    },
    controller: {
        'click #manual-next' : function() {
            var success = function(data) {
                     alert(JSON.stringify(data));
                $('#right-side-page').html('');
                $$.document.append($$(user_post_page, { isbn : data.isbns[0].number }), '#right-side-page');
            };
            var error = function() {
                navigator.notification.alert('Error Adding Book. Please Try Again.', function() { }, 'BookSmart Error');
            };
            core.lib.books_manual_add(success, error);
        }
    }
});