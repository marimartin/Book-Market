// FUNCTION TO RETRIEVE SEARCH ITEMS -BOOK OR TITLE- FROM LOCAL STORAGE//

$(document).ready(function () {
    console.log(localStorage.getItem("books"));
    var books = JSON.parse(localStorage.getItem("books"))
    for (var i = 0; i < books.length; i++) {
        var book = books[i];
        
        var bookTitle = book.title;
        var date = book.date;
        //APPENDING SEARCH ITEMS TO THE PAGE WITH THE DATE//

        var textContent = $("<p>").text(bookTitle);
        var dateText = $("<p>").text(date);
        var bookContentDiv = $('<div>').attr('class', 'book-history');
        bookContentDiv.append(textContent,dateText)

        $("#recordedBook").prepend(bookContentDiv);

        var authorName = $("<p>").text(authorName);
        bookContentDiv.append(authorName);

        $("#recordedBook").prepend(bookContentDiv);
    }
});
// EVENT HANDLER TO CLEAR STORED SEARCH ITEMS//
$('#clear').on('click', function () {
    if (localStorage.length !== 0) {
        var clear = confirm('Press OK to clear history!');
        if (clear) {
            $('#recordedBook').empty();
            localStorage.clear();
        }
    }

});