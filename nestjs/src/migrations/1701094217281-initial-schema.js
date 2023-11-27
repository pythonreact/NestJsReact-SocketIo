const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class InitialSchema1701094217281 {
    name = 'InitialSchema1701094217281'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "itinerary" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "departure" varchar NOT NULL, "stops" varchar NOT NULL, "arrival" varchar NOT NULL, "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "admin" boolean NOT NULL DEFAULT (1), "email" varchar NOT NULL, "password" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_itinerary" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "departure" varchar NOT NULL, "stops" varchar NOT NULL, "arrival" varchar NOT NULL, "userId" integer, CONSTRAINT "FK_fe8aa2e64e4676c7dd623eb6349" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_itinerary"("id", "name", "departure", "stops", "arrival", "userId") SELECT "id", "name", "departure", "stops", "arrival", "userId" FROM "itinerary"`);
        await queryRunner.query(`DROP TABLE "itinerary"`);
        await queryRunner.query(`ALTER TABLE "temporary_itinerary" RENAME TO "itinerary"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "itinerary" RENAME TO "temporary_itinerary"`);
        await queryRunner.query(`CREATE TABLE "itinerary" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "departure" varchar NOT NULL, "stops" varchar NOT NULL, "arrival" varchar NOT NULL, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "itinerary"("id", "name", "departure", "stops", "arrival", "userId") SELECT "id", "name", "departure", "stops", "arrival", "userId" FROM "temporary_itinerary"`);
        await queryRunner.query(`DROP TABLE "temporary_itinerary"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "itinerary"`);
    }
}
