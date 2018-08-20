class Book {
  constructor(title, s_title, authors, publish_date, publisher, categories) {
    this.title = title
    this.s_title = s_title
    this.authors = authors
    this.publish_date = publish_date
    this.publisher = publisher
    this.categories = categories
  }

  show() {
    var show = ""
    show += this.title + " ";
    if(this.s_title){
      show += "( " + this.s_title + ")" ;
    }
    show+= ", ";
    show+= this.authors;
    show+= ", ";
    show+= this.publish_date;
    show+= ", ";
    if(this.s_title){
      show += "( " + this.s_title + ")" ;
      show+= ", ";
    }
    show+="[ "
    var aux = ""
    for (var j in this.categories) {
      aux+= this.categories[j] + ", ";


    }
      show+= aux.slice(0, -3);
      show+=" ] "
      show += "\n"

    console.log(show);
  }

  isComputer() {
    var isComputer = false;
    for (var j in this.categories) {
      if( this.categories[j]=="Computers" )
        isComputer = true;

    }
    return  isComputer;
  }
}

class AvailableBook extends Book {
  constructor (title, s_title, authors, publish_date, publisher, categories, price_amount, buy_link)  {
    super (title, s_title, authors, publish_date, publisher, categories)
    this.price_amount = price_amount
    this.buy_link = buy_link
  }

  getPrice() {
    return this.price_amount
  }

  getBuyLink() {
    return this.buy_link
  }

  show() {
    var show = ""
    show += this.title + " ";
    if(this.s_title){
      show += "( " + this.s_title + ")" ;
    }
    show+= ", ";
    show+= this.authors;
    show+= ", ";
    show+= this.publish_date;
    show+= ", ";
    if(this.s_title){
      show += "( " + this.s_title + ")" ;
      show+= ", ";
    }
    show+="[ "
    var aux = ""
    for (var j in this.categories) {
      aux+= this.categories[j] + ", ";
    }
      show+= aux.slice(0, -3);
      show+=" ] - "
      show += this.getPrice() + "$ at "
      show += this.getBuyLink();
      show += "\n"
    console.log(show);
  }

}


function showBooks(data){
  for (var j in data) {

    data[j].show();

  }

}

function sort(data){
  var index = 0;
  for ( j = 0; j < data.length; j++) {
    index = j;

        for (i = j; i < data.length; i++) {
          if(data[j].publish_date > data[i].publish_date){
            var aux = data[i];
            data[i] = data[j];
            data[j] = aux;
          }
        }

      }
    showBooks(data);
    }

function calcAverageRating(averageRating){
  var temp = 0
    for (i = 0; i < averageRating.length; i++) {
      temp = temp + averageRating[i];
    }

      result = temp / averageRating.length;
      console.log("El promedio del rating de los libros seria " + result);
    }

var http = require('http'),
        fs = require('fs');


var request = require('request');
var result = [];
var averageRating = [];
request('https://www.googleapis.com/books/v1/volumes?q=javascript', function(error, response, body) {
    var library = JSON.parse(body);
    for (var i in library.items) {
      var title = library.items[i].volumeInfo.title;
      var s_title = library.items[i].volumeInfo.subtitle;
      var all = '';
      for (var j in library.items[i].volumeInfo.authors) {

        all+= library.items[i].volumeInfo.authors[j] + ' ';

      }
      var authors = all;
      var publish_date = library.items[i].volumeInfo.publishedDate;
      var publisher = library.items[i].volumeInfo.publisher;
      var categories = library.items[i].volumeInfo.categories;

      var temp = new Book(title, s_title, authors, publish_date, publisher, categories);
      if(library.items[i].saleInfo.listPrice){
        var price_amount = library.items[i].saleInfo.listPrice.amount;
        var buy_link = library.items[i].saleInfo.buyLink;
        var temp = new AvailableBook(title, s_title, authors, publish_date, publisher, categories, price_amount, buy_link);
      }else{
        var temp = new Book(title, s_title, authors, publish_date, publisher, categories);
      }
      result.push(temp);

      // Calculando el averageRating
      if(library.items[i].volumeInfo.averageRating && temp.isComputer()){
        averageRating.push(library.items[i].volumeInfo.averageRating);
      }

    }
    console.log("Tenemos primero todos nuestros libros sobre Javascript \n\n")
    showBooks(result);
    console.log("--------------------------------------------------\n");
    console.log("Luego tenemos el arreglo ordenado por la fecha de publicacion \n\n")
    sort(result);
    console.log("--------------------------------------------------");
    console.log("Por ultimo, la valoracion promedio vale acotar que se calculo ")
    console.log("solo para aquellos que tuvieran este valor y si pertenecen a la categoria 'Computacion'\n")

    calcAverageRating(averageRating);

    http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<html>');
    res.write('<body>');
    res.write('<h1>Javascript Library</h1>');
    res.write('<ul>');
    for (var i in library.items) {
    res.write('<li>' + library.items[i].volumeInfo.title + '</li>');
  }
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
    res.end();
    res.end();
    }).listen(3000);

    console.log('Server running at port 3000');
});
