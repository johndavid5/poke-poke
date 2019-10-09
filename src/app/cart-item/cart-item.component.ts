import { Component, OnInit, Input } from '@angular/core';
import { CartItemInfo } from '../CartItemInfo.js' 

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {

  // Add an @Input decorated `cartItemInfo` property...
  // (you imported Input from @angular/core above)
  // ...so in the template you can one-way
  // bind to the `cartItemInfo` property like this:
  // <app-cart-item [cartItemInfo]="cartItem"></app-cart-item>
  @Input() cartItemInfo: CartItemInfo;

  constructor() { }

  ngOnInit() {
  }

}
