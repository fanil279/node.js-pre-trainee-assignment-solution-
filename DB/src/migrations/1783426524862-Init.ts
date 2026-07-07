import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1783426524862 implements MigrationInterface {
    name = 'Init1783426524862';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todos\` DROP FOREIGN KEY \`fk_todos_user\``);
        await queryRunner.query(`DROP INDEX \`idx_status\` ON \`todos\``);
        await queryRunner.query(`DROP INDEX \`email\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`todos\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`created_at\``);
        await queryRunner.query(
            `ALTER TABLE \`todos\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`todos\` CHANGE \`description\` \`description\` varchar(200) NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`todos\` CHANGE \`status\` \`status\` enum ('active', 'completed') NOT NULL DEFAULT 'active'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`todos\` ADD CONSTRAINT \`FK_53511787e1f412d746c4bf223ff\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`todos\` DROP FOREIGN KEY \`FK_53511787e1f412d746c4bf223ff\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`users\` DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`todos\` CHANGE \`status\` \`status\` enum ('active', 'completed') NULL DEFAULT 'active'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`todos\` CHANGE \`description\` \`description\` varchar(200) NULL`,
        );
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`todos\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP`,
        );
        await queryRunner.query(
            `ALTER TABLE \`todos\` ADD \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX \`email\` ON \`users\` (\`email\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_status\` ON \`todos\` (\`status\`)`);
        await queryRunner.query(
            `ALTER TABLE \`todos\` ADD CONSTRAINT \`fk_todos_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }
}
