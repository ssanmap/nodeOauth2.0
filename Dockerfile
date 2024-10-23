# Usar la imagen base de Node.js
FROM node:16-alpine

# Crear un directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos, incluido config.js (si lo usas para las variables de entorno)
COPY . .

# Exponer el puerto en el que la app corre
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
