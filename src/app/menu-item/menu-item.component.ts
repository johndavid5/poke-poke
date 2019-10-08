import { Component, OnInit, Input } from '@angular/core';
import { MenuItemInfo } from '../MenuItemInfo.js' 

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {

  // Add an @Input decorated `menuItemInfo` property...
  // (you imported Input from @angular/core above)
  // ...so in the template you can one-way
  // bind to the `menuItemInfo` property like this:
  // <app-menu-item [menuItemInfo]="menuItem"></app-menu-item>
  @Input() menuItemInfo: MenuItemInfo;

  constructor() { }

  ngOnInit() {
  }

}
