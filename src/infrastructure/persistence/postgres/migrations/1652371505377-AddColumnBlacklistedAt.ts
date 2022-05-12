/* istanbul ignore file */

import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnBlacklistedAt1652371505377 implements MigrationInterface {
    name = 'AddColumnBlacklistedAt1652371505377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock" ADD "blacklistedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock" DROP COLUMN "blacklistedAt"`);
    }

}
