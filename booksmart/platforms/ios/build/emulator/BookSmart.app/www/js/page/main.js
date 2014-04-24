var main_page = $$({
    model: {
        
    },
    view: {
        format: $('#main_page').html(),
        style:  '#header { position: relative; top: 0px; left: 0px; width: 100%; background-color: #665C52; box-shadow: 0 0 3px #665C52; z-index: 1000; }\
                #title { float:left; font-family: Arial; font-size: 1.8rem; color: white; padding: 20px; }\
                #options { float: right; padding: 20px; }\
                #options img { height: 2rem; margin-top: 0px; -webkit-filter: invert(100%); padding: 0px 15px 0px 15px; }\
                #search-form { margin: 0; padding: 0; }\
                #search { padding: 15px; width: 100%; background-color: #74B3A7; color: white; font-size: 1.25rem; font-family: Arial; }\
                #loading-container { display:none; z-index: 1000; background-color: #CC5B14; width: 30px; height: 30px; padding: 24px; border-radius: 4px; position: absolute; top: calc(50% - 27px); left: calc(50% - 37px); border: 1px solid white; }\
                #loading-icon { height: 100%; width: 100%; background-image: url(\'img/loading.gif\'); background-position: center; background-size: contain; background-repeat: no-repeat; }\
                #results { overflow: scroll; }\
                #right-side-page { position: absolute; top: 0px; left: -100%; height: 0px; width: 100%; background-color: white; -webkit-transition: left .4s ease-in-out; }'
    },
    controller: {
        'click #my-posts' : function() {
            if($('#right-side-page').css('left') === '0px') {
                $('#right-side-page').css('left', '-100%');
            }
            $('#loading-container').css('display', 'block');
            var succ = function(data) {
                $('#loading-container').css('display', 'none');
                $('#results').html('');
                core.post_data = data;
                for(var i = 0; i < data.length; ++i) {
                    var obj = $$(book_item, { identity : 'book-' + i, title : data[i].book.title, condition : data[i].bookCondition, price : parseFloat(data[i].price).toFixed(2) });
                    $$.document.append(obj, '#results');
                }
                if(data.length == 0) {
                    $('#results').html('<div id="no-results">No Posts Found.</div>');
                }
            };
            var err = function(data) {
                $('#loading-container').css('display', 'none');
                navigator.notification.alert('Error Retrieving Posts. Please Try Again.', function() { }, 'BookSmart Error');
            };
            core.lib.posts_user(succ, err);
        },
        'click #add' : function() {
            if($('#right-side-page').css('left') !== '0px') {
                $('#right-side-page').css('left','0px');
            }
            $('#right-side-page').html('');
            $$.document.append($$(options_page, {}), '#right-side-page');
        }
    }
});

var book_item = $$({
    model: {
        
    },
    view: {
        format: $('#book_item').html(),
        style:  '.book-item { height: auto; width: calc(100% - 20px); background-color: white; margin: 10px; border: 1px solid #E6E1CF; }\
                .book-title { background-color: #E6E1CF; font-size: 1.3rem; font-family: Arial; padding: 15px; }\
                .book-condition { padding: 10px; float:left; }\
                .book-price { padding: 10px; float:right;}'
    },
    controller: {
        'click &': function() {
                   
            var bookinfo = core.post_data[this.model.get('identity').replace('book-', '')];
            $('#right-side-page').html('');
                   var data = { price : parseFloat(bookinfo.price).toFixed(2), title : bookinfo.book.title, description : bookinfo.book.description, publisher : bookinfo.book.publisher, edition : bookinfo.book.edition, class_number : bookinfo.classNumber, semester : bookinfo.semester, school : bookinfo.school, condition : bookinfo.bookCondition, type : bookinfo.bookType, professor : bookinfo.professorName, contact : bookinfo.contact };
            $$.document.append($$(book_page, data), '#right-side-page');
            $('#right-side-page').css('left', '0px');
        }
    }
});