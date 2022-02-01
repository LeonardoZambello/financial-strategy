/* istanbul ignore file */

import { ConnectionOptions } from 'typeorm';
import { SymbolSchema } from '../schema/symbol.schema';

const TypeOrmConnectionOptions: ConnectionOptions = {
	url: process.env.DATABASE_URL,
	type: 'postgres',
	entities: [
		SymbolSchema
	],
	migrationsRun: false,
	migrations: [process.env.NODE_ENV === 'development' ? __dirname + '/../migrations/**/*.ts' : 'dist/infrastructure/persistence/postgres/migrations/**/*.js'],
	cli: {
		migrationsDir: 'src/infrastructure/persistence/postgres/migrations',
		entitiesDir: 'src/infrastructure/persistence/postgres/schema'
	},
	synchronize: false,
	ssl: process.env.NODE_ENV === 'development' ? false : true,
	extra: process.env.NODE_ENV === 'development' ? false : {ssl: {rejectUnauthorized: false}
	}
};

export default TypeOrmConnectionOptions;