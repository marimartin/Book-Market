var isbnNumber;
var books = [];

$(document).ready(function() {
    renderBook();
});

function renderBook() {
    $('#book-form').submit(function(e) {
        e.preventDefault();

        var title = $('#myInput').val().trim();
        var author = $('#myAuthorInput').val().trim();
        $('#myInput').val('');
        $('#myAuthorInput').val('');
        searchBook(title, author);
    })
}


//var mainDate = dayjs().format('[DD/MM/YYYY]');
// var mainDateEl = title.append(" " + mainDate);
//console.log(mainDate);



function searchBook(title, author) {
    var queryURL = '';
    if (title && title.length && author && author.length) {
        queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + title + "+intitle:" + title + "+inauthor:" + author + "&printType=books&download=epub&key=AIzaSyCafPwWf0r8BEYpspHQjofo1RSKo6lqXcU";
    } else if (title && title.length) {
        queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + title + "+intitle:" + title + "&printType=books&download=epub&key=AIzaSyCafPwWf0r8BEYpspHQjofo1RSKo6lqXcU";
    } else if (author && author.length) {
        queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + title + "+inauthor:" + author + "&printType=books&download=epub&key=AIzaSyCafPwWf0r8BEYpspHQjofo1RSKo6lqXcU";
    }

    if (queryURL == '') {
        console.log('no input provided');
        return;
    }

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        $('#recordedBook').html('');

        books = response.items.slice();

        response.items.forEach(function(item, index) {
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
            //var salability = '<p>'+ response.items[i].volumeInfo.saleInfo.saleability + '</>';
            var bookImage = "<img src=" + item.volumeInfo.imageLinks.smallThumbnail + ">";
            var bookDiv = $('<div>');
            bookDiv.attr('class', 'bookDiv');
            bookDiv.attr('data-index', index);
            bookDiv.append(bookTitle + bookAuthor + catagory + bookImage);
            $('#recordedBook').append(bookDiv);
        });



        localStorage.setItem("title", JSON.stringify(title));

        var isbnNumber = response.items[0].volumeInfo.industryIdentifiers[0].identifier;
        console.log(isbnNumber)
    });



    // }
    // var goodreadsQueryURL = "https://cors-anywhere.herokuapp.com/https://www.goodreads.com/book/review_counts.json?isbns=9781781100486key=cU7MkZMEBPNFmw5qMfbw";

    // $.ajax({
    //     url: goodreadsQueryURL,
    //     method: "GET"
    // }).then(function (nextResponse) {
    //     console.log(nextResponse)
    // })

}

$(document).on('click', '.bookDiv', function() {
    let bookIndex = $(this).data('index');
    let book = books[bookIndex];
    console.log('target boook ', book);

    let title = book.volumeInfo.title;
    let subTitle = book.volumeInfo.subtitle;
    let rating = book.volumeInfo.averageRating;
    let description = book.volumeInfo.description;
    let buyLink = book.saleInfo.buyLink;
    let image = book.volumeInfo.imageLinks.smallThumbnail;

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
    if (typeof rating !== 'undefined') {
        $('#book-rating').html('Rating: ' + rating);
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
});

$(document).on('click', '#back-to-list', function() {
    $('#recordedBookDetails').hide();
    $('#recordedBook').show();
})