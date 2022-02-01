import { ConnectionOptions } from 'typeorm';
import { SymbolSchema } from '../schema/symbol.schema';

const TypeOrmConnectionOptions: ConnectionOptions = {
	url: process.env.DATABASE_URL,
	type: 'postgres',
	entities: [
		SymbolSchema
	],
	migrationsRun: true,
	migrations: [__dirname + '/../migrations/**/*.ts'],
	cli: {
		migrationsDir: 'src/infrastructure/persistence/postgres/migrations',
	},
	synchronize: false,
	ssl: process.env.NODE_ENV === 'development' ? false : true,
	extra: process.env.NODE_ENV === 'development' ? false : {ssl: {rejectUnauthorized: false}
	}
};

export default TypeOrmConnectionOptions;