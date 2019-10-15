import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { menu } from '../../data/menu.js' 

const host = 'http://fuse-interview.appspot.com';

export class Category {
    name: string
    children: (Category | Product)[]
}

export class Product {
    name: string
    sku: string;
    cost: number;
}

export class Order {
    customer: string;
    products: Product[] = [];
    total: number;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(
        private http: HttpClient,
    ) { }

    getInventory(): Observable<Category> {
        return this.http.get<Category>(host + '/inventory', { responseType: 'json' });
    }

    getFakeInventory(){
        return menu;
    }

    placeOrder(o: Order): Observable<Order> {
        return this.http.post<Order>(host + '/place_order', o, { responseType: 'json' });
    }
}
