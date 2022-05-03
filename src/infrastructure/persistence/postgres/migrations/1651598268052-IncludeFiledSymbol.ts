/* istanbul ignore file */

import {MigrationInterface, QueryRunner} from "typeorm";

export class IncludeFiledSymbol1651598268052 implements MigrationInterface {
    name = 'IncludeFiledSymbol1651598268052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stock" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "symbol" text NOT NULL, "roe" numeric, "roePosition" integer, "forwardPE" numeric, "forwardPEPosition" integer, "ranking" integer, "reason" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8216f0ad859c53c0706e1e1f05f" UNIQUE ("symbol"), CONSTRAINT "PK_092bc1fc7d860426a1dec5aa8e9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "stock"`);
    }

}
