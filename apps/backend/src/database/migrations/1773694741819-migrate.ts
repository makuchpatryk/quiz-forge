import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1773694741819 implements MigrationInterface {
  name = "Migrate1773694741819";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "provider" character varying NOT NULL DEFAULT 'local'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "providerId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "providerId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "provider"`);
  }
}
