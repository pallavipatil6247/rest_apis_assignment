const restify = require('restify');
const Config = require('./config');
const HomeRouter = require('./app/routes/homeRoute');

const server = restify.createServer({
	name: Config.name,
	version: Config.version,
	url: Config.hostname,
});
process.setMaxListeners(0);
const corsMiddleware = require("restify-cors-middleware");

var cors = corsMiddleware({
	origins: ["*"],
	allowHeaders: ["Authorization"],
	exposeHeaders: ["Authorization"]
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.jsonBodyParser());
server.use(restify.plugins.urlEncodedBodyParser({ mapParams: false }));


HomeRouter(server);

const appPort = Config.port;
server.listen(appPort, (error) => {
	if (error) {
		console.log(error);
	} else {
		console.log(`server is running on port http://${Config.hostname}:${Config.port}`);
	}
});