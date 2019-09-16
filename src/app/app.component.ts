import { Component, OnInit } from '@angular/core';

import { ApiService, Category } from './api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public menu: Category;

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.apiService.getInventory().subscribe(i => this.menu = i);
    }

    get menuString(): string {
        return JSON.stringify(this.menu);
    }
}
