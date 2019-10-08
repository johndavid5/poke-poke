import { Component, OnInit } from '@angular/core';

import { ApiService, Category, Product } from './api.service';

import { MenuItemInfo } from './MenuItemInfo';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public menu: Category;

    public menuItems: Array<MenuItemInfo>;

    constructor(private apiService: ApiService) { }

    ngOnInit() {
      this.apiService.getInventory()
      .subscribe(
      inventory => {

        let sWho = "AppComponent::ngOnInit().this.apiService.getInventory().subscribe()"

        this.menu = inventory

        console.log(`${sWho}(): Got from ApiService: this.menu = inventory = `, this.menu );

        // Make it easy on yourself:
        //   Flatten the menu tree into an array...
        //this.menuItems = [
        //  {id: 1, description: "A", visible: true}
        //  ,{id: 2, description: "B", visible: false}
        //  ,{id: 3, description: "C", visible: true}
        //];

        //console.log(`${sWho}(): this.menuItems = `, this.menuItems );

        this.menuItems = this.flattenMenu( this.menu )

        console.log(`${sWho}(): this.menuItems = this.flattenMenu( this.menu ) = `, this.menuItems );

      });

    }/* ngOnInit() */

    /* See https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects */
    flattenMenu(menu: Category): MenuItemInfo[] {

        let result: MenuItemInfo[] = [];

        function recurse(cur,depth){
            let sWho = "recurse";

            if( cur.name && cur.sku && cur.cost ){
                result.push( { type: 'PRODUCT', depth: depth, name: cur.name, sku: cur.sku, cost: cur.cost } );
            }
            else{
                result.push( { type: 'CATEGORY', depth: depth, name: cur.name, sku: "", cost: -1 } );
            }

            if( cur.children ){
                cur.children.forEach( (child)=>{
                  recurse( child, depth+1 )
                });
            }
            //else{
                //console.log(`${sWho}(): cur.name = ${cur.name}, cur.sku = ${cur.sku}, cur.cost = ${cur.cost}, cur.children = `, cur.children );
                // Base Case: a Product...
                //result.push( { type: 'PRODUCT', depth: depth, name: cur.name, sku: cur.sku, cost: cur.cost } );
            //} 

        }

        recurse(menu,1);
        return result;
    }

    get menuString(): string {
        return JSON.stringify(this.menu, null, ' ');
    }
}
