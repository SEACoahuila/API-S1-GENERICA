import mongoose from 'mongoose';
import debug from 'debug';
import config from '../../config';

const { host, user, pass, port, database, authSource } = config.oauth_mongodb;
const log: debug.IDebugger = debug('app:mongoose-service');

class MongooseService {
    private count = 0;
    private url = `mongodb://${user}:${pass}@${host}:${port}/${database}?authMechanism=DEFAULT&authSource=${authSource}`;
    // private url = `mongodb+srv://${user}:${pass}@${host}/${database}`
    private mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        autoIndex: false, // Don't build indexes        
    };

    constructor() {
        this.connectWithRetry();
    }

    getMongoose() {
        return mongoose;
    }

    connectWithRetry = async () => {
        console.log('Intentando conectar con MongoDB (se reintentará de ser necesario)');
        mongoose
            .connect(this.url, this.mongooseOptions)
            .then(() => {
                console.log('conectado a MongoDB');
            })
            .catch((err) => {
                const retrySeconds = 5;
                console.log(`Conexión a MongoDB no satisfactoria (reintento #${++this.count} despues ${retrySeconds} segundos):`, err);
                console.log(this.url)
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };
}
export default new MongooseService();