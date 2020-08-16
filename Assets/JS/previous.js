// FUNCTION TO RETRIEVE SEARCH ITEMS -BOOK OR TITLE- FROM LOCAL STORAGE//

$(document).ready(function () {
    console.log(localStorage.getItem("books"));
    var books = JSON.parse(localStorage.getItem("books"))
    for (var i = 0; i < books.length; i++) {
        var book = books[i];

        var bookTitle = book.title;
        var date = book.date;
        var textContent = $("<div>").text(bookTitle);
        var dateText = $("<div>").text(date);
        if (bookTitle && dateText) {
            $("#recordedBook").append(textContent, dateText);
        }

        var authorName = book.author;
        var authorContent = $("<div>").text(authorName);

        if (authorName && dateText){

            $("#recordedAuthor").append(authorName, dateText);
    }
    }})


// EVENT HANDLER TO CLEAR STORED SEARCH ITEMS//
$('#clear').on('click', function () {
    if (localStorage.length !== 0) {
        var clear = confirm('Press OK to clear history!');
        if (clear) {
            $('#recordedBook').empty();
            $('#recordedAuthor').empty();
            localStorage.clear();
        }
    }

});