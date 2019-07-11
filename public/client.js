$( document ).ready(function() {
  var items = [];
  var itemsRaw = [];
  
  //*************** My code for displaying the response inside the webpage ui ***************
  //submitting a new book
  $('#newBookForm').submit(function(e) {
    $.ajax({
      url: '/api/books',
      type: 'post',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        $('.status').css("display", "block");
        if(JSON.stringify(data) == '"*required fields missing"') {
          $('#jsonResult').text(JSON.stringify(data));
          setTimeout(() => location.reload(), 1000); //update list
        } else {
          $('#jsonResult').text('Adding book entry ' + JSON.stringify(data) + ' to the library.' );
          setTimeout(() => location.reload(), 2000); //update list
        }
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
    setTimeout(() => location.reload(), 1000); //update list
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
    setTimeout(() => location.reload(), 1000); //update list
    e.preventDefault();
  });
  
  //deleting all entries in the library
  $('#deleteForm').submit(function(e) {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      data: $('#deleteForm').serialize(),
      success: function(data) {
        $('.status').css("display", "block");
        $('#jsonResult').text(JSON.stringify(data));
      }
    });
    setTimeout(() => location.reload(), 1000); //update list
    e.preventDefault();
  }); 
  //*****************************************************************************************
  
  
  $.getJSON('/api/books', function(data) {
    //var items = [];
    itemsRaw = data;
    $.each(data, function(i, val) {
      items.push('<a class="bookLink"><li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li></a>');
      //return ( i !== 14 ); //return first 14 book entries
      return i; //return all book entries
    });
    items.length < 1 ? items.push('<li class="bookItem" style="color: #fc7c7c">None</li>') : null; //placeholder for the Library entries list when empty
    $('<ul/>', {
      'class': 'listWrapper',
      html: items.join('')
      }).appendTo('#display');
  });
  
  var comments = [];
  $('#display').on('click', 'li.bookItem', function() {
    $('#detailTitle').html('<b>' + itemsRaw[this.id].title + '</b> (id: ' + itemsRaw[this.id]._id + ')');
    $('#detailTitle').attr("data-id", itemsRaw[this.id]._id);
    const bookTitle = document.querySelector('#detailTitle');
    $.getJSON('/api/books/' + itemsRaw[this.id]._id, function(data) {      
      comments = [];
      $('#detailComments').css("display", "block");
      $.each(data.comments, function(i, val) {
        comments.push('<li>' + val + '</li>');
      });
      comments.push('<form id="newCommentForm"><input type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment">');
      comments.push('<br><input type="submit" class="addComment" value="ADD COMMENT" id="' + data._id + '">');
      comments.push('<input type="button" class="deleteBook" value="DELETE BOOK" id="' + data._id + '"></form>');
      $('#detailComments').html(comments.join(''));
    });
  });
  
  $('#bookDetail').on('click', '.deleteBook', function(e) {
    $.ajax({
      url: '/api/books/' + this.id,
      type: 'delete',
      success: function(data) {
        //update list
        $('.status').css("display", "block");
        $('#jsonResult').text(JSON.stringify(data));
        //$('#detailComments').html('<p style="color: red;">' + data + '<p><p>Refresh the page</p>');
      }
    });
    setTimeout(() => location.reload(), 1000); //update list
    e.preventDefault();
  });  
  
  $('#bookDetail').on('click','.addComment',function(e) {
    const newComment = $('#commentToAdd').val();
    $.ajax({
      url: '/api/books/' + this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        comments.unshift(newComment); //adds new comment to top of list
        $('.status').css("display", "block");
        $('#jsonResult').html('Adding new comment: <b style="color: #f8f8f8; background: rgba(0, 0, 0, .7)"> &#xa0;' + newComment + '&#xa0;</b> to ' + JSON.stringify(data.title));
        //$('#detailComments').html(comments.join(''));
      }
    });
    setTimeout(() => location.reload(), 2000); //update list
    e.preventDefault();
  });
  
  /*$('#newBook').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
  });*/
  
  /*$('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
  }); */
  
});
