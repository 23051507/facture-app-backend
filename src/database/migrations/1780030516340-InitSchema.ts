import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1780030516340 implements MigrationInterface {
    name = 'InitSchema1780030516340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "config_entreprise" ALTER COLUMN "taux_tva_defaut" SET DEFAULT '19.25'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "config_entreprise" ALTER COLUMN "taux_tva_defaut" SET DEFAULT 19.25`);
    }

}
