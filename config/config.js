module.exports = {
	server: {
		puerto: process.env.PORT || 8080,
		corsOrigins: process.env.corsOrigins || '*'
	},
	parametros: {
		mongodb: 'mongodb+srv://luisenriquez:luisudea1@nodejs.truyg.mongodb.net/node-3rd-Ed?retryWrites=true&w=majority',
		secret: 'secret-dev',
		expiresIn: '240h'
	}
};