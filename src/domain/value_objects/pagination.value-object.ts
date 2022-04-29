/* istanbul ignore file */

import { OrderEnum } from "../entities/order.enum";
import { SortOptionsEnum } from "../entities/sort-options.enum";

export class PaginationVO {
    page: number;
    size: number;
    sort: SortOptionsEnum;
    order: OrderEnum;
}
