import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1791831828044 implements MigrationInterface {
    name = 'CreateUsersTable1791831828044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\` (\`email\`)`);
    }

}
