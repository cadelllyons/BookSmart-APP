
var user_post_page = $$({
    model: {

    },
    view: {
        format: $('#user_post_page').html(),
        style: '#user-post-page { width: calc(100% - 20px); margin: 10px; table-layout: fixed; }\
                #user-post-title { font-size: 1.5rem; font-family: Arial; text-align: center; color: #665C52; padding: 20px; }\
                table#user-post-page tr td { margin: 0; padding: 0; }\
                .userpost-input { height: 100%; width: calc(100% - 20px); padding: 10px; font-size: 1.05rem; font-family: Arial; background-color: #74B3A7; color: white; }\
                #submit-post { height: 100%; width: calc(100% - 20px); padding: 10px; font-size: 1.05rem; font-family: Arial; background-color: #665C52; color: white; text-align: center; }'
    },
    controller: {
        'click #submit-post' : function() {
            $('#loading-container').css('display', 'block');
            var success = function(data) {
                $('#loading-container').css('display', 'none');
                $('#right-side-page').css('left', '-100%');
                navigator.notification.alert('Successfully Posted Book', function() { }, 'BookSmart');
            };
            var error = function() {
                $('#loading-container').css('display', 'none');
                navigator.notification.alert('Error Adding Book. Please Try Again.', function() { }, 'BookSmart Error');
            };
            core.lib.posts_add(success, error);
        }
    }
});