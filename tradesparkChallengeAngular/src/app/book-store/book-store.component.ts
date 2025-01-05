import { Component, OnInit } from '@angular/core';
import { BookStoreService } from '../book-store.service';

@Component({
  selector: 'app-book-store',
  templateUrl: './book-store.component.html',
  styleUrls: ['./book-store.component.css']
})
export class BookStoreComponent implements OnInit {

  books: any[] = [];
  booksFiltered: any[] = [];
  textSearch: string = ''

  constructor(private bookStoreService: BookStoreService) { }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.bookStoreService.getBooks().subscribe((data: any[]) => {
      this.books = data;
      this.booksFiltered = this.books;
    })
  }

  filterBooks() {
    /*
    No veo necesario hacer el filtrado de books directammente al back para este caso,
    Podrian ser muchas consultas innecesarias..
    */
    const search = this.textSearch.toLowerCase();
    this.booksFiltered = this.books.filter((book) => {
      const titleMatch = book.title?.toLowerCase().includes(search);
      const authorMatch = book.author?.name?.toLowerCase().includes(search);
      const categoryMatch = this.categoriesToString(book.categories)
        .toLowerCase()
        .includes(search);

      return titleMatch || authorMatch || categoryMatch;
    });
  }

  categoriesToString(categories: any[]): string {
    let categoriesString = "";
    categories.forEach((category, index) => {
      categoriesString += category.name;
      if (index < categories.length - 1) {
        categoriesString += ", ";
      }
    });
    return categoriesString;
  }

  removeCategory(book:any,category:any) {
    if (book && category) {
      console.log("book",book)
      console.log("category",category)
      this.bookStoreService.removeCategoryFromBook(book.title, category.name).subscribe((data: any) => {
        console.log(data);
        const bookWithCategoryRemoved = data.book
        const booksClean = this.books.filter((b) => b.id !== book.id);
        this.books = [...booksClean, bookWithCategoryRemoved];
        this.filterBooks();
        // Si es un contexto de bookstore en el que esta mucha gente intercatuando seria necesario 
        //hacer el request de books al bakc para obtener info actualizada
        //pero para este caso alcanza con actualizar los datos que trajo inicialemente y solo obtener
        //el book actualizado (tampoco haria falta)
        //--> this.getBooks();
      })
      
    }
  }

}
