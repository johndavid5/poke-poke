import { Component, OnInit } from '@angular/core';

import { ApiService, Category, Product, Order } from './api.service';

import { MenuItemInfo, MenuItemType } from './MenuItemInfo';
import { CartItemInfo } from './CartItemInfo';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public menu: Category;

    /* Flattened version of the menu tree...with expanded items shown... */
    public menuItems: Array<MenuItemInfo>;

    /* Use to sort items in cart so they are ordered the same as the menu... */
    public allMenuItems: Array<MenuItemInfo>;

    /* Items that are currently expanded... */
    public expanders: Map<string,MenuItemInfo>;

    /* The order...! */
    public order: Order;

    public static START_DEPTH(): number {
        return 2;
    }

    constructor(private apiService: ApiService) {
        this.expanders = new Map<string,MenuItemInfo>();
    }

    public bFake = true;

    ngOnInit() {

      let sWho = "AppComponent::ngOnInit()";

      let bFake = true;

      if (this.bFake){
         let inventory = this.apiService.getFakeInventory(); 

         console.log(`${sWho}(): Got from ApiService.getFakeInventory: inventory = `, inventory );

         this.menuInit( inventory );
      }
      else {

	      this.apiService.getInventory()
	      .subscribe(
	      inventory => {
	
	        let sWho = "AppComponent::ngOnInit().this.apiService.getInventory().subscribe()"
	
	        console.log(`${sWho}(): Got from ApiService: inventory = `, inventory );
	
	        this.menuInit( inventory );
	
	       }); /* subscribe */

       }

    }/* ngOnInit() */

    menuInit( leMenu ){ 

        let sWho = "AppComponent::menuInit";

        this.menu = leMenu;

        this.allMenuItems = this.flattenMenu( this.menu, AppComponent.START_DEPTH(), null )

        //console.log(`${sWho}(): this.allMenuItems = this.flattenMenu( this.menu, ... , null ) = `, this.allMenuItems );

        this.menuItems = this.flattenMenu( this.menu, AppComponent.START_DEPTH(), this.expanders )

        //console.log(`${sWho}(): this.menuItems = this.flattenMenu( this.menu ) = `, this.menuItems );

        this.order = new Order();

        this.order.customer = '';

        this.order.products = [];

        this.order.total = 0;
    }

    onPlaceOrderClick(): void {

        let sWho = "AppComponent::onPlaceOrderClick";

        this.order.customer = this.order.customer.trim();

        if( this.order.customer.length == 0 ){
            alert("Please fill in your name!");
            return;
        }

        if( this.order.total == 0 ){
            alert("Please choose some items!");
            return;
        }

        if( this.bFake ){
            console.log(`${sWho}(): Calling this.apiService.placeFakeOrder( this.order = `, this.order, ` )...`);

            let response = this.apiService.placeFakeOrder( this.order );

            console.log(`${sWho}(): Got response from ApiService.placeFakeOrder(): `, response ); 

            alert("Order Placed!  Thank you for your business, " + this.order.customer + "!");
        }
        else {
	        console.log(`${sWho}(): Calling this.apiService.placeOrder( this.order = `, this.order, ` )...`);
	
	        this.apiService.placeOrder(this.order)
	        .subscribe(
	           response => {
	  
	             let sWho = "AppComponent::onPlaceOrderClick().this.apiService.placeOrder().subscribe()"
	  
	             console.log(`${sWho}(): Got response from ApiService:`, response );
	
	             alert("Order Placed!  Thank you for your business, " + this.order.customer + "!");
	  
	        }); /* subscribe */
        }

    }/* onPlaceOrderClick() */

    /* Expands or collapses the CATEGORY, or adds the PRODUCT to the order... */
    onMenuItemClick(menuItem: MenuItemInfo): void {

        let sWho = "AppComponent::onMenuItemClick";

        //console.log(`${sWho}(): BEGIN: menuItem = `, menuItem );

        if( menuItem.type == MenuItemType.CATEGORY )
        {
            if( menuItem.expanded == false ){
                // Expand this CATEGORY...
                this.expanders.set( menuItem.path, menuItem );
            }
            else if( menuItem.expanded == true ){
                // Collapse this CATEGORY...
                this.expanders.delete( menuItem.path );
            }

            this.menuItems = this.flattenMenu( this.menu, AppComponent.START_DEPTH(), this.expanders )

            //console.log(`${sWho}(): END: this.menuItems = this.flattenMenu( this.menu ) = `, this.menuItems );
        }/* if( menuItem.type == MenuItemType.CATEGORY ) */
        else if( menuItem.type == MenuItemType.PRODUCT)
        {
           // Add this PRODUCT to the order...
           this.order.products.push( { name: menuItem.name, sku: menuItem.sku, cost: menuItem.cost } );

           // Sort products according to order they are found in the menu...
           this.order.products.sort( (productA, productB)=>{
               let comp = this.allMenuItems.findIndex(menuItem => menuItem.type == MenuItemType.PRODUCT && menuItem.name == productA.name )
                  - 
                this.allMenuItems.findIndex(menuItem => menuItem.type == MenuItemType.PRODUCT && menuItem.name == productB.name );
               return comp;
           });

           this.order.total = this.order.products.reduce( (sum,product)=>{
                return sum + product.cost;
           }, 0 );
        }/* if( menuItem.type == MenuItemType.PRODUCT) */

    }/* onMenuItemClick(menuItem: MenuItemInfo): void */

    /*
    * Flattens the menu tree into an array, displaying only 
    * items whose paths are descendants of the items in
    * the `expanders` map...or supply null for `expanders` 
    * to display all items beginning at `startDepth`.
    */
    flattenMenu(menu: Category, startDepth: number, expanders: Map<string,MenuItemInfo> ): MenuItemInfo[] {

        let sWho = "AppComponent::flattenMenu";

        //console.log(`${sWho}(): startDepth = ${startDepth}, expanders = `, expanders );

        let result: MenuItemInfo[] = [];

        function recurse(cur /* Category */, depth: number, path: string){
            let sWho = "recurse";

            path += "/" + cur.name;

            let pathBackOne = AppComponent.pathBackOne( path ) 
            let pathBackTwo = AppComponent.pathBackOne( pathBackOne ) 

            //console.log(`${sWho}(): depth = ${depth}, path = ${path}, pathBackOne = ${pathBackOne}, pathBackTwo = ${pathBackTwo}...`);
            //console.log(`${sWho}(): cur.name = ${cur.name}, cur.sku = ${cur.sku}, cur.cost = ${cur.cost}, cur.children = `, cur.children );

            if( depth == startDepth ){
              if( cur.name && cur.sku && cur.cost ){
                // Looks like a PRODUCT, Moe...
                result.push( { type: MenuItemType.PRODUCT, depth: depth, name: cur.name, sku: cur.sku, cost: cur.cost, path: path, expanded: false } );
              }
              else{
                // Looks like a CATEGORY, Moe...
                let bExpanded:boolean = false;
                if( expanders == null || expanders.has( path ) ){
                    bExpanded = true;
                }
                result.push( { type: MenuItemType.CATEGORY, depth: depth, name: cur.name, sku: "", cost: -1, path: path, expanded: bExpanded } );
              }
            }/* if( depth == startDepth ) */
            else if( depth > startDepth ){
                if( expanders == null || AppComponent.allParentsAreExpanders( expanders, path, depth, startDepth ) ){
                  if( cur.name && cur.sku && cur.cost ){ 

                    result.push( { type: MenuItemType.PRODUCT, depth: depth, name: cur.name, sku: cur.sku, cost: cur.cost, path: path, expanded: false } );
                  }
                  else {
                  
                    let bExpanded:boolean = false;
                    if( expanders == null || expanders.has( path ) ){
                      bExpanded = true;
                    }
                    result.push( { type: MenuItemType.CATEGORY, depth: depth, name: cur.name, sku: "", cost: -1, path: path, expanded: bExpanded } );
                  }
                }
            }

            if( cur.children ){
                cur.children.forEach( (child)=>{
                  recurse( child, depth+1, path )
                });
            }

        }

        recurse(menu,1,"menu");
        return result;

    }/* flattenMenu() */


    /** 
    * e.g., pathBackOne('menu/ALL/Base') = 'menu/ALL'
    */
    static pathBackOne( pathIn: string ): string {
        let iWhere:number = pathIn.lastIndexOf('/');
        if( iWhere > 0 ){
            return pathIn.substring(0, iWhere);
        }
        else{
            return pathIn;
        }
    }/* pathBackOne() */


    /* Returns true if all parent paths back to `startDepth` are in the `expanders` Map... */
    static allParentsAreExpanders( expanders: Map<string,MenuItemInfo>, path: string, depth: number, startDepth: number ): boolean {

        let sWho = "AppComponent::allParentsAreExpanders";

        //console.log( '\t' + `${sWho}(): path = ${path}, depth = ${depth}, startDepth = ${depth}, expanders = `, expanders );

        let pathBackOne = path;
        let iDepth = depth;

        while( true ){

          iDepth--;

          if( iDepth < startDepth ){
            //console.log( '\t' + '\t' + `${sWho}(): SHEMP: Moe, iDepth = ${iDepth} is less dhen dha startDepth, so exitin' dha loop, Moe...` );
            break;
          }

          pathBackOne = AppComponent.pathBackOne( pathBackOne );

          //console.log( '\t' + '\t' + `${sWho}(): SHEMP: Moe, iDepth = ${iDepth}, pathBackOne = ${pathBackOne}...`);
         

          if( ! expanders.has( pathBackOne ) ){
            //console.log( '\t' + '\t' + `${sWho}(): SHEMP: Moe, iDepth = ${iDepth}: SHEMP: Sorry, Moe, pathBackOne = ${pathBackOne} ain't in dha expanders Map, so retoynin' false...Sorry, gotta do it...!` );
            return false;
          }
          else {
            //console.log( '\t' + '\t' + `${sWho}(): SHEMP: Moe, iDepth = ${iDepth}: SHEMP: Hey, Moe, pathBackOne = ${pathBackOne} is in dha expanders Map, so we can keep goin' widh dha loop, Moe...!` );
          }
        }

        //console.log( '\t' + `${sWho}(): SHEMP: Good news, Moe, all dha pathBackOnes were expanders...retoynin' true...` );
        return true;

    }/* allParentsAreExpanders() */


    get menuString(): string {
        return JSON.stringify(this.menu, null, ' ');
    }

    get orderString(): string {
        return JSON.stringify(this.order, null, ' ');
    }
}
