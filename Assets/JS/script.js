var isbnNumber;
var books = [];

$(document).ready(function () {
    // SETTING INPUT VALUES IF LOADED FROM HISTORY PAGE
    var authorSearch = localStorage.getItem("authorSearchTerms");
    var bookSearch = localStorage.getItem("bookSearchTerms");
    if (authorSearch) {
        $('#myInput').val("");
        $('#myAuthorInput').val(authorSearch);
        searchBook("", authorSearch);
        localStorage.setItem('authorSearchTerms', "");
    }
    if (bookSearch) {
        $('#myAuthorInput').val("")
        $('#myInput').val(bookSearch);
        searchBook(bookSearch, "");
        localStorage.setItem('bookSearchTerms', "");
    }

    renderBook();
});


function renderBook() {
    $('#book-form').submit(function (e) {
        e.preventDefault();
        var title = $('#myInput').val().trim();
        var author = $('#myAuthorInput').val().trim();
        searchBook(title, author);
    })
}

//FUNCTION TO SEARCH FOR A BOOK TITLE OR AUTHOR//
function searchBook(title, author) {
    $('#myInput').val('');
    $('#myAuthorInput').val('');
    var currentDate = dayjs().format("DD/MM/YYYY");
    var userInput = title;
    var userAuthorInput = author;
    var bothInput = (title, author)

    var queryURL = '';
    if (title && title.length && author && author.length) {
        queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + title + "+intitle:" + title + "+inauthor:" + author + "&printType=books&download=epub&key=AIzaSyCafPwWf0r8BEYpspHQjofo1RSKo6lqXcU";
    } else if (title && title.length) {
        queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + title + "+intitle:" + title + "&printType=books&download=epub&key=AIzaSyCafPwWf0r8BEYpspHQjofo1RSKo6lqXcU";
    } else if (author && author.length) {
        queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + title + "+inauthor:" + author + "&printType=books&download=epub&key=AIzaSyCafPwWf0r8BEYpspHQjofo1RSKo6lqXcU";
    }

    if (queryURL == '') {
        return;
    }

    //AJAX CALL TO RETRIEVE INFORMATION FROM GOOGLE BOOKS API//

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $('#recordedBook').html('');

        books = response.items.slice();


        response.items.forEach(function (item, index) {
            if (title && title.length && author && author.length) {
                let titleOfBook = item.volumeInfo.title;
                titleOfBook = titleOfBook.toLowerCase();
                if (titleOfBook.indexOf(title) == -1) {
                    return;
                }
            }
            var bookTitle = '<h5>' + item.volumeInfo.title + '</h5>';
            var bookAuthor = '';
            if (typeof item.volumeInfo.authors !== 'undefined') {
                bookAuthor = '<p>' + item.volumeInfo.authors + '</p>';
            } else {
                bookAuthor = '<p></p>';
            }

            var catagory = '<p>' + item.volumeInfo.categories + '</p>';
            var bookImage = "<img src=" + item.volumeInfo.imageLinks.smallThumbnail + ">";

            var bookDiv = $('<div>');
            bookDiv.attr('class', 'bookDiv');
            bookDiv.attr('data-index', index);
            bookDiv.append(bookTitle + bookAuthor + catagory + bookImage);
            $('#recordedBook').append(bookDiv);

        });

        // SETTING SEARCH ITEMS TO LOCAL STORAGE//
        var storage = localStorage.getItem("books")
        if (storage) {
            var bookArr = JSON.parse(storage);
            var newBook = {};
            if (title && title.length) {
                newBook.title = userInput
                newBook.date = currentDate
            }
            else if (author && author.length) {
                newBook.author = userAuthorInput
                newBook.date = currentDate
            }
            else if (title && title.length && author && author.length) {
                newBook.title = userInput
                newBook.author = userAuthorInput
                newBook.date = currentDate
            }

        } else {
            var bookArr = [];
            var newBook = {};
            if (title && title.length) {
                newBook.title = userInput
                newBook.date = currentDate
            }
            else if (author && author.length) {
                newBook.author = userAuthorInput
                newBook.date = currentDate
            }
            else if (title && title.length && author && author.length) {
                newBook.title = userInput
                newBook.author = userAuthorInput
                newBook.date = currentDate
            }
        }
        bookArr.push(newBook)
        localStorage.setItem("books", JSON.stringify(bookArr))

    })

    if (title && title.length) {
        localStorage.setItem(currentDate, userInput);
    }
    else if (author && author.length) {
        localStorage.setItem(currentDate, userAuthorInput);
    }
    else if (title && title.length && author && author.length) {
        localStorage.setItem(currentDate, bothInput);
    }
}



$(document).on('click', '.bookDiv', function () {
    let bookIndex = $(this).data('index');
    let book = books[bookIndex];

    let title = book.volumeInfo.title;
    let subTitle = book.volumeInfo.subtitle;
    let googleRating = book.volumeInfo.averageRating;
    let description = book.volumeInfo.description;
    let buyLink = book.saleInfo.buyLink;
    let image = book.volumeInfo.imageLinks.smallThumbnail;
    let isbnNumber = book.volumeInfo.industryIdentifiers[0].identifier;
    var finalgoodreadRating

    //AJAX CALL FOR RETRIEVING RATING FROM GOODREADS API//
    var x = new XMLHttpRequest();
    x.open('GET', ("https://cors-anywhere.herokuapp.com/https://www.goodreads.com/book/review_counts.json?isbns=" + isbnNumber + "&key=cU7MkZMEBPNFmw5qMfbw"));
    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    x.onload = function () {
        var fullRatingResults = x.responseText;
        var averageRating = fullRatingResults.substring(fullRatingResults.indexOf("average_rating"))
        var goodreadsRating = (averageRating.substring(averageRating.indexOf(":") + 1))

        finalgoodreadRating = (goodreadsRating.substring(0, goodreadsRating.length - 3))

        $('#goodreads-book-rating').html('');

        $('#goodreads-book-rating').html('Goodreads Rating: ' + finalgoodreadRating + "/5");

    };
    x.send();

    $('#book-title').html('');
    $('#book-sub-title').html('');
    $('#book-description').html('');
    $('#book-rating').html('');
    $('#buy-button').attr('href', '#');
    $('#book-image').attr('src', 'https://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png');
    $('#buy-button-container').hide();
    $('#not-buy').show();

    if (typeof title !== 'undefined') {
        $('#book-title').html(title);
    }
    if (typeof subTitle !== 'undefined') {
        $('#book-sub-title').html(subTitle);
    }
    if (typeof description !== 'undefined') {
        $('#book-description').html(description);
    }
    if (typeof googleRating !== 'undefined') {
        $('#book-rating').html('Google Rating: ' + googleRating + "/5");
    }
    if (typeof buyLink !== 'undefined') {
        $('#buy-button').attr('href', buyLink);
        $('#buy-button-container').show();
        $('#not-buy').hide();
    }
    if (typeof image !== 'undefined') {
        $('#book-image').attr('src', image);
    }
    $('#recordedBookDetails').show();
    $('#recordedBook').hide();
    $('#book-form').hide();
});

$(document).on('click', '#back-to-list', function () {
    $('#recordedBookDetails').hide();
    $('#recordedBook').show();
    $('#book-form').show();
})


// PREVIOUS.HTML JS

// FUNCTION TO RETRIEVE SEARCH ITEMS -BOOK OR TITLE- FROM LOCAL STORAGE//

$(document).ready(function () {
    var books = JSON.parse(localStorage.getItem("books"));
    if (books) {
        for (var i = 0; i < books.length; i++) {
            var book = books[i];

            var bookTitle = book.title;
            var date = book.date;
            var textContent = $("<a href='find.html'>").attr('class', 'savedTitle').text(bookTitle);
            var dateText = $("<div>").attr('class', 'savedDate').text(date);
            if (bookTitle && dateText) {
                $("#recordedBookDiv").prepend(textContent, dateText);
            }

            var authorName = book.author;
            var authorContent = $("<a href='find.html'>").attr('class', 'savedAuthor').text(authorName);

            if (authorName && dateText) {

                $("#recordedAuthorDiv").prepend(authorContent, dateText);
            }
        }
    }
})


// EVENT HANDLER TO CLEAR STORED SEARCH ITEMS//
$('#clear').on('click', function () {
    if (localStorage.length !== 0) {
        $('#recordedBookDiv').empty();
        $('#recordedAuthorDiv').empty();
        localStorage.clear();
    }

});

// SETTING SEARCH TERMS FROM HISTORY TO LOCAL STORAGE
$("body").on('click', ".savedTitle", function () {
    localStorage.setItem('bookSearchTerms', $(this).text());
    $('#myInput').val('');
})

$("body").on('click', ".savedAuthor", function () {
    localStorage.setItem('authorSearchTerms', $(this).text());
    $('#myAuthorInput').val('');
})
