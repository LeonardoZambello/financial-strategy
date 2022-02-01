/* istanbul ignore file */

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('symbol')
export class SymbolSchema {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        nullable: false,
        name: 'name',
        unique: true
    })
    name: string;

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
}
