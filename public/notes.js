/*!
 * Start Bootstrap - SB Admin 2 v3.3.7+1 (http://startbootstrap.com/template-overviews/sb-admin-2)
 * Copyright 2013-2016 Start Bootstrap
 * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap/blob/gh-pages/LICENSE)
 */
$(function() {
    $('#main').hide();
    $('.loader').show();
    $('#side-menu').metisMenu();
    alternateList();

    setTimeout(function() {
        $('.loader').hide();
        $('#main').show();
    }, 1000);


    Handlebars.registerHelper("inc", function(value, options) {
        return parseInt(value) + 1;
    });
});


//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        var topOffset = 50;
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    // var element = $('ul.nav a').filter(function() {
    //     return this.href == url;
    // }).addClass('active').parent().parent().addClass('in').parent();
    var element = $('ul.nav a').filter(function() {
        return this.href == url;
    }).addClass('active').parent();

    while (true) {
        if (element.is('li')) {
            element = element.parent().addClass('in').parent();
        } else {
            break;
        }
    }
});

var notesTemplate = Handlebars.compile(`
    {{#each notes}}
        <li>
            <div class="timeline-badge"><i class="fa fa-check"></i>
            </div>
            <div class="timeline-panel">
                <div class="timeline-heading">
                <h4 class="timeline-title">{{ this.id }} {{ this.title }}</h4>
                    <p>
                        <small class="text-muted">
                            <a href="javascript:void(0);" class="delete" data-id="{{ this.id }}"><i class="fa fa-trash"></i> Delete</a> | 
                            <a href="javascript:void(0);" class="edit" data-id="{{ this.id }}"><i class="fa fa-edit"></i> Edit</a>
                        </small>
                    </p>
                </div>
                <div class="timeline-body">
                    <p>{{ this.notes }}</p>
                </div>
            </div>
        </li>
    {{/each}}
`);

function alternateList() {
    $('.timeline li:odd').addClass('timeline-inverted');
}

function clearTextArea() {
    $("textarea").val("");
    $("input[name=title]").val("");
}

function reloadData(notes) {
    $('#note-lists').empty();
    if (notes == '') {
        $('#note-lists').html(`
        <h1>No Notes Available</h1>
        <a href="#" data-toggle="modal" data-target="#createNote">Create one</a>
        `);
    } else {
        $('#note-lists').html(notesTemplate({ notes: notes }));
    }
    clearTextArea();
    alternateList();
}

$(function() {
    $("#newNote").submit(function(e) {
        e.preventDefault();
        var note = $('textarea[name=note]').val();
        var title = $(this).find('input[name=title]').val();

        axios.post('/api/notes/', {
            note: note,
            title: title

        }).then(function(response) {
            reloadData(response.data);
            $("#createNote").modal('hide');
        })
    })
})

$("#note-lists").on('click', '.edit', function() {
    var id = $(this).data('id');

    axios.get('api/notes/?id=' + id).then(function(res) {
        console.log(res);
        var modal = $("#editNote");
        modal.find(".modal-body > form").html(`
            <div class="form-group">
                <label>Title</label>
                <input type="text" class="form-control" name="title" value="${res.data.title}" required>
            </div>
            
            <div class="form-group">
                <textarea class="form-control" name="note" required>${res.data.notes}</textarea>
            </div>
                       
            <input class="btn btn-primary " id="update" data-id="${id}" type="submit" value="Update">           
            `)
        $("#editNote").modal('show');
    }).catch(function(err) {
        alert(err);
    })
});

$("#editNoteForm").submit(function(e) {
    e.preventDefault();
    var id = $(this).find('#update').data('id');
    var note = $(this).find('textarea[name=note]').val();
    var title = $(this).find('input[name=title]').val();


    axios.put('api/notes/' + id, {
            note: note,
            title: title
        }).then(function(res) {
            reloadData(res.data);
        }).then(function() {
            $("#editNote").modal('hide');
        })
        .catch(function(err) {
            alert(err);
        })
});

$("#note-lists").on('click', '.delete', function() {
    var id = $(this).data('id');

    axios.delete('api/notes/' + id).then(function(res) {
        reloadData(res.data);
    }).catch(function(err) {
        alert(err);
    })
});