
/*
 
 Each of these pages will be done with Agility.js
 
 Main Page (search bar add icon and menu button)
 Menu Bar (swipe left to right or tap the menu button)
 Add Page (swipe right to left or tap icon)
 Book Info Page
 Contact Seller Page (maybe turn this into messaging platform)
 
 */


/**
 CORE
    Binds all global event listeners
    Initializes any global variables / requests

 CORE LIBRARY
    Request content from the server
    Build Pages based on the response (agility mvc objects)
 
 **/
var core = {
    base_url: 'http://1-dot-booksmart-app.appspot.com/api',
    post_data: null,
    bind: function() {
        if(window.cordova) {
            document.addEventListener('deviceready', this.init, false);
        } else {
            $(document).ready(core.init);
        }
    },
    init: function() {
        resize();
        if(window.cordova) {
            core.lib.users_add();
        }
        $$.document.append(main_page);
        $('#header').css('padding-top', '0px');
        if(window.cordova) {
            if(device.version >= 7) {
                $('#header').css('padding-top', '20px');
            }
        }
        $('#results').css('height', 'calc(100% - ' + ($('#header').height() + $('#search-form').height()) + 'px)');
        $('#right-side-page').css('height', 'calc(100% - ' + ($('#header').height()) + 'px)');
        $('#right-side-page').css('top', $('#header').height() + 'px');
        
        
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
    search: function() {
        var val = $('#search').val();
        if(val) {
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
            core.lib.posts_search(val, succ, err);
        }
    },
    lookup_isbn: function() {
        var isbn = $('#isbn-lookup').val();
        if(isbn) {
            $('#loading-container').css('display', 'block');
            var success = function(data) {
                $('#loading-container').css('display', 'none');
                $('#right-side-page').html('');
                $$.document.append($$(user_post_page, { isbn : data.isbns[0].number }), '#right-side-page');
            };
            var error = function(error) {
                $('#loading-container').css('display', 'none');
                var callback = function(index) {
                    if(index === 2) {
                        $('#right-side-page').html('');
                        $$.document.append($$(manual_page, {}), '#right-side-page');
                    } else {
                        $('#isbn-lookup').val('');
                    }
                };
                navigator.notification.confirm('Invalid ISBN number! Please either try again or manually add the book!', callback, 'BookSmart', [ 'Try Again', 'Manually Add' ]);
            };
            core.lib.books_scan_isbn(isbn, success, error);
        }
    },
    scan_isbn: function() {
        var success = function(result) {
            if(result.text) {
                $('#loading-container').css('display', 'block');
                var succ = function(data) {
                    $('#loading-container').css('display', 'none');
                    $('#right-side-page').html('');
                    $$.document.append($$(user_post_page, { isbn : data.isbns[0].number }), '#right-side-page');
                };
                var err = function(error) {
                    $('#loading-container').css('display', 'none');
                    var callback = function(index) {
                        if(index === 2) {
                            $('#right-side-page').html('');
                            $$.document.append($$(manual_page, {}), '#right-side-page');
                        } else {
                            $('#isbn-lookup').val('');
                        }
                    };
                    navigator.notification.confirm('Invalid ISBN number! Please either try again or manually add the book!', callback, 'BookSmart', [ 'Try Again', 'Manually Add' ]);
                };
                core.lib.books_scan_isbn(result.text, succ, err);
            }
        };
        var error = function(error) {
            var callback = function(index) {
                if(index === 2) {
                    $('#right-side-page').html('');
                    $$.document.append($$(manual_page, {}), '#right-side-page');
                } else {
                    $('#isbn-lookup').val('');
                }
            };
            navigator.notification.confirm('Invalid ISBN number! Please either try again or manually add the book!', callback, 'BookSmart', [ 'Try Again', 'Manually Add' ]);
        };
        cordova.plugins.barcodeScanner.scan(success, error);
    },
    lib: {
        users_add: function() {
            var request = {
                url: '/user/add',
                data: { device_id : device.uuid, version : device.version, operating_system : device.platform }
            };
            core.lib.post(request);
        },
        books_scan_isbn: function(isbn, success, error) {
            var request = {
                url: '/book/isbn',
                data: { isbn : isbn },
                success: success,
                error: error
            };
            core.lib.get(request);
        },
        books_manual_add: function(success, error) {
            var title = $('#book-title').val();
            var description = $('#book-description').val();
            var publisher = $('#book-publisher').val();
            var edition = $('#book-edition').val();
            var isbn = $('#book-isbn').val();
            var author = $('#book-author').val();
            if(!title || !description || !publisher || !isbn || !author) {
                navigator.notification.alert('All Fields Must Be Filled In.', function() { }, 'BookSmart Error');
                return;
            }
            var request = {
                url: '/book/add',
                data: { title : title, description : description, publisher : publisher, edition : edition, isbn : isbn, author : author },
                success: success,
                error: error
            };
            core.lib.post(request);
        },
        posts_add: function(succ, err) {
            var price = $('#userpost-price').val();
            var condition = $('#userpost-condition').val();
            var type = $('#userpost-type').val();
            var semester = $('#userpost-semester').val();
            var classNumber = $('#userpost-classnumber').val();
            var professorName = $('#userpost-professor').val();
            var isbn = $('#userpost-isbn').val();
            var school = $('#userpost-school').val();
            var contact = $('#userpost-contact').val();
            if(!price || !condition || !type || !semester || !classNumber || !professorName || !isbn || !school || !contact) {
                navigator.notification.alert('All Fields Must Be Filled In.', function() { }, 'BookSmart Error');
                return;
            }
            var success = function(position) {
                var longitude;
                var latitude;
                if(position.coords) {
                    latitude = position.coords.latitude
                    longitude = position.coords.longitude
                }
                var request = {
                    url: '/user_post/post',
                data: { device_id : device.uuid, latitude : latitude, longitude : longitude, price : $('#userpost-price').val(), condition : $('#userpost-condition').val(), type : $('#userpost-type').val(), semester : $('#userpost-semester').val(), class_number : $('#userpost-classnumber').val(), professor_name : $('#userpost-professor').val(), isbn : $('#userpost-isbn').val(), school : $('#userpost-school').val(), contact : $('#userpost-contact').val() },
                    success: succ,
                    error: err
                };
                core.lib.post(request);
            };
            navigator.geolocation.getCurrentPosition(success, success);
        },
        posts_user: function(succ, err) {
            var request = {
                url: '/user_post/user',
                data: { device_id : device.uuid },
                success: succ,
                error: err
            };
            core.lib.get(request);
        },
        posts_search: function(val, succ, err) {
            var request = {
                url: '/user_post/search/default',
                data: { search_term : val },
                success: succ,
                error: err
            };
            core.lib.get(request);
        },
        get: function(req) {
            req.type ='GET';
            core.lib.ajax(req);
        },
        post: function(req) {
            req.type = 'POST';
            core.lib.ajax(req);
        },
        ajax: function(req) {
            var request = {
                type: req.type,
                url: core.base_url + req.url,
                data: req.data,
                dataType: 'JSON',
                success: function(data, status, xhr) {
                    if(req.success) {
                        req.success($.parseJSON(data), status, xhr);
                    }
                },
                error: function(xhr, errorType, err) {
                    if(req.error) {
                        req.error(xhr, errorType, err);
                    }
                }
            };
            $.ajax(request);
        }
    }
};