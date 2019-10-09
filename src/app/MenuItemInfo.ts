export enum MenuItemType {
    CATEGORY = "CATEGORY",
    PRODUCT = "PRODUCT"
}

export class MenuItemInfo {
    // type: string;  /* 'category'|'product'  */
    // type: 'CATEGORY' | 'PRODUCT';
    type: MenuItemType;
    depth: number;
    name: string;
    sku: string;
    cost: number;
    path: string;
    expanded: boolean;
}
