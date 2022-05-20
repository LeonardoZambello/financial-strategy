/* istanbul ignore file */

export class Stock {
    id: string;
    symbol: string;
    name: string;
    roe: number;
    roePosition: number;
    forwardPE: number;
    forwardPEPosition: number;
    ranking: number;
    reason: string;
    blacklistedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
