import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1643721026355 implements MigrationInterface {
    name = 'InitialMigration1643721026355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "symbol" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "roe" numeric, "roePosition" integer, "forwardPE" numeric, "forwardPEPosition" integer, "ranking" integer, CONSTRAINT "UQ_3bb4dc32218eb1501b1582ab36c" UNIQUE ("name"), CONSTRAINT "PK_d1373cd631624b100a81a545dee" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "symbol"`);
    }

}
