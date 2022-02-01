import { ConnectionOptions } from 'typeorm';
import { SymbolSchema } from '../schema/symbol.schema';

const TypeOrmConnectionOptions: ConnectionOptions = {
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE,
	entities: [
		SymbolSchema
	],
	migrationsRun: true,
	migrations: [__dirname + '/../migrations/**/*.ts'],
	cli: {
		migrationsDir: 'src/infrastructure/persistence/postgres/migrations',
	},
	synchronize: false,
};

export default TypeOrmConnectionOptions;