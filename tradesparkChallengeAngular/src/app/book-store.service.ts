import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookStoreService {

  urlApi:string = 'http://localhost:8000/bookStore/books/'

  constructor(private client: HttpClient) { }

  getBooks() {
    return this.client.get(this.urlApi)
  }

  removeCategoryFromBook(book_title:string, category_name:string) {
    return this.client.get(`${this.urlApi}remove_category/?title=${book_title}&category=${category_name}`)
  }
  
}
