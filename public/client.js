$( document ).ready(function() {
  var items = [];
  var itemsRaw = [];
  
  //***************My code for displaying the response inside the webpage ui ***************
  //submitting a new book
  $('#newBookForm').submit(function(e) {
    $.ajax({
      url: '/api/books',
      type: 'post',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        $('.status').css("display", "block");
        $('#jsonResult').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
  
  //testing the new book submit
  $('#titleTest').submit(function(e) {
    $.ajax({
      url: '/api/books',
      type: 'post',
      data: $('#titleTest').serialize(),
      success: function(data) {
        $('.status').css("display", "block");
        $('#jsonResult').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
  
  //testing the new comment submit based on a book _id
  $('#commentTest').submit(function(e) {
    $.ajax({
      url: '/api/books',
      type: 'post',
      data: $('#commentTest').serialize(),
      success: function(data) {
        $('.status').css("display", "block");
        $('#jsonResult').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
  //*****************************************************************************************
  
  
  $.getJSON('/api/books', function(data) {
    //var items = [];
    itemsRaw = data;
    $.each(data, function(i, val) {
      items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>');
      return ( i !== 14 );
    });
    if (items.length >= 15) {
      items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    }
    $('<ul/>', {
      'class': 'listWrapper',
      html: items.join('')
      }).appendTo('#display');
  });
  
  var comments = [];
  $('#display').on('click','li.bookItem',function() {
    $("#detailTitle").html('<b>'+itemsRaw[this.id].title+'</b> (id: '+itemsRaw[this.id]._id+')');
    $.getJSON('/api/books/'+itemsRaw[this.id]._id, function(data) {
      comments = [];
      $.each(data.comments, function(i, val) {
        comments.push('<li>' +val+ '</li>');
      });
      comments.push('<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
      comments.push('<br><button class="btn btn-info addComment" id="'+ data._id+'">Add Comment</button>');
      comments.push('<button class="btn btn-danger deleteBook" id="'+ data._id+'">Delete Book</button>');
      $('#detailComments').html(comments.join(''));
    });
  });
  
  $('#bookDetail').on('click','button.deleteBook',function() {
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'delete',
      success: function(data) {
        //update list
        $('#detailComments').html('<p style="color: red;">'+data+'<p><p>Refresh the page</p>');
      }
    });
  });  
  
  $('#bookDetail').on('click','button.addComment',function() {
    var newComment = $('#commentToAdd').val();
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        comments.unshift(newComment); //adds new comment to top of list
        $('#detailComments').html(comments.join(''));
      }
    });
  });
  
  $('#newBook').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
  });
  
  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
  }); 
  
});
