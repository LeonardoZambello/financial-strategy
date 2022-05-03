/* istanbul ignore file */

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('stock')
export class StockSchema {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        nullable: false,
        name: 'name',
        unique: false
    })
    name: string;

    @Column({
        type: 'text',
        nullable: false,
        name: 'symbol',
        unique: true
    })
    symbol: string;

    @Column({
        type: 'decimal',
        nullable: true,
        name: 'roe',
        unique: false
    })
    roe: number;

    @Column({
        type: 'integer',
        nullable: true,
        name: 'roePosition',
        unique: false
    })
    roePosition: number;

    @Column({
        type: 'decimal',
        nullable: true,
        name: 'forwardPE',
        unique: false
    })
    forwardPE: number;

    @Column({
        type: 'integer',
        nullable: true,
        name: 'forwardPEPosition',
        unique: false
    })
    forwardPEPosition: number;

    @Column({
        type: 'integer',
        nullable: true,
        name: 'ranking',
        unique: false
    })
    ranking: number;

    @Column({
        type: 'text',
        nullable: true,
        name: 'reason',
        unique: false
    })
    reason: string;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: false,
        name: 'createdAt'
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        nullable: false,
        name: 'updatedAt'
    })
    updatedAt: Date;
}
