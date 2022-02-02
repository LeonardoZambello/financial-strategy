import {MigrationInterface, QueryRunner} from "typeorm";

export class IncludeFieldsReasonCreatedAtAndUpdatedAt1643757389704 implements MigrationInterface {
    name = 'IncludeFieldsReasonCreatedAtAndUpdatedAt1643757389704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "symbol" ADD "reason" text`);
        await queryRunner.query(`ALTER TABLE "symbol" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "symbol" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "symbol" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "symbol" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "symbol" DROP COLUMN "reason"`);
    }

}
