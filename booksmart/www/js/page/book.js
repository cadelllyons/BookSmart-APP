
var book_page = $$({
    model: {

    },
    view: {
        format: $('#book_page').html(),
        style: '#book-page { padding: 10px; width: calc(100% - 20px); }\
                #back-button { width: 20%; padding: 10px; font-size: 1.2rem; margin: 10px 0 10px 0; background-color: #665C52; color: white; text-align: center; }\
                #book-info-title { font-size: 1.9rem; background-color: #E6E1CF; width: calc(100% - 20px); padding: 10px; }\
                #book-info-table { padding: 4px; }\
                .book-div { font-size: 1rem; }\
                .book-info { font-size: 1rem; font-style: italic; }'
    },
    controller: {
        'create' : function() {
            if(!this.model.get('description')) {
                   this.model.set({ description : 'No Summary Found.' });
            }
            if(!this.model.get('publisher')) {
                   this.model.set({ publisher : 'No Publisher Found.' });
            }
            if(!this.model.get('edition')) {
                   this.model.set({ edition : 'No Edition Found.' });
            }
        },
        'click #back-button' : function() {
            $('#right-side-page').css('left', '-100%');
        }
    }
});