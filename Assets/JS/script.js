$(document).ready(function() {
    renderBook();
});

function renderBook() {
    $('#searchBook-btn').on('click', function () {
        var title =$('#myInput').val().trim();
        $('#myInput').val('');
        searchBook(title);
    })
}   
 //var mainDate = dayjs().format('[DD/MM/YYYY]');
// var mainDateEl = title.append(" " + mainDate);
//console.log(mainDate);

function searchBook(title) {
    var queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + title + "&download=epub&key=AIzaSyCafPwWf0r8BEYpspHQjofo1RSKo6lqXcU";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //console.log(response);
        for(var i=0; i<response.items.length; i++){
            //console.log(response.items[i].volumeInfo.title);
            var title = '<h5>'+  response.items[i].volumeInfo.title +'</h5>';
            var author = '<p>'+ response.items[i].volumeInfo.authors +'</p>';
            var catagory = '<p>'+ response.items[i].volumeInfo.categories + '</p>';
            //var salability = '<p>'+ response.items[i].volumeInfo.saleInfo.saleability + '</>';
            var bookImage = "<img src="+ response.items[i].volumeInfo.imageLinks.smallThumbnail +">";
            var bookDiv = $('<div>');
            bookDiv.attr('class', 'bookDiv');
            bookDiv.append(title + author + catagory + bookImage);
            $('#recordedBook').append(bookDiv);
        }
    });
}
