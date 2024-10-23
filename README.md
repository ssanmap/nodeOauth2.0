# Node.js OAuth2 + PostgreSQL Project

Este proyecto es una aplicación Node.js con autenticación mediante Google OAuth2, usando JWT para proteger rutas y PostgreSQL para almacenar la información de los usuarios. La aplicación está contenida dentro de Docker para facilitar su despliegue y escalabilidad.

## Características

- Autenticación con **Google OAuth2**.
- Manejo de **tokens JWT** para rutas protegidas.
- Almacenamiento de usuarios en **PostgreSQL**.
- Despliegue de la aplicación usando **Docker**.
- Frontend con **React** para interactuar con el backend.

## Requisitos previos

Asegúrate de tener los siguientes requisitos instalados en tu entorno local:

- **Docker**: Para ejecutar contenedores de la aplicación y la base de datos.
- **Docker Compose**: Para orquestar múltiples contenedores.
- **Node.js**: Aunque usamos Docker, es recomendable tenerlo instalado para pruebas locales.
- **Git**: Para gestionar el repositorio.

## Configuración del proyecto

### 1. Clonar el repositorio

Clona el repositorio del proyecto desde GitHub:

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo


Configurar el archivo .env
Crea un archivo .env en la raíz del proyecto y agrega las variables de entorno necesarias para configurar la base de datos, Google OAuth y JWT.

bash
Copiar código
DB_USERNAME=xxx
DB_PASSWORD=xx
DB_NAME=x
DB_HOST=x

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback

JWT_SECRET=your_jwt_secret


Construir y levantar los contenedores con Docker
Ejecuta el siguiente comando para construir la imagen de Docker y levantar la aplicación y la base de datos PostgreSQL.

bash
Copiar código
docker-compose up --build -d
4. Ejecutar las migraciones de la base de datos
Para que Sequelize cree las tablas en la base de datos, ejecuta las migraciones dentro del contenedor de la aplicación.

bash
Copiar código
docker-compose exec app npx sequelize-cli db:migrate
5. Acceder a la aplicación
Una vez que los contenedores estén corriendo y las migraciones aplicadas, accede a la aplicación en tu navegador:

Backend: http://localhost:4000
Frontend: (si tienes un frontend): http://localhost:3000
6. Autenticación con Google OAuth2
Visita http://localhost:4000/auth/google para iniciar el flujo de autenticación con Google. Una vez autenticado, serás redirigido de vuelta a la aplicación con el token JWT en la URL.

7. Acceder a rutas protegidas
Con el token JWT que obtuviste al autenticarte, puedes acceder a rutas protegidas en el backend, como /protected. Asegúrate de pasar el token en el encabezado Authorization como Bearer <TOKEN>.

bash
Copiar código
curl -H "Authorization: Bearer <TOKEN>" http://localhost:4000/protected
Estructura del proyecto
bash
Copiar código
.
├── config/                # Configuraciones de Sequelize para la base de datos
│   └── config.js
├── controllers/           # Controladores del backend
├── models/                # Modelos de Sequelize
├── migrations/            # Migraciones de la base de datos
├── public/                # Archivos estáticos (si los hay)
├── routes/                # Rutas de la aplicación
├── Dockerfile             # Archivo Docker para la aplicación Node.js
├── docker-compose.yml     # Orquestación de Docker para la app y PostgreSQL
├── server.js              # Archivo principal de la aplicación Node.js
├── package.json           # Dependencias de Node.js
└── .env                   # Variables de entorno (no se sube al repositorio)
Dependencias principales
Express: Framework de Node.js para manejar las rutas y lógica del servidor.
Sequelize: ORM para interactuar con PostgreSQL.
Passport.js: Middleware para autenticación (en este caso, Google OAuth2).
JWT: Manejo de tokens para autenticar rutas protegidas.
Comandos útiles
Ver los logs de los servicios
Puedes ver los logs de la base de datos PostgreSQL o de la aplicación ejecutando:

bash
Copiar código
# Logs del contenedor de la app
docker-compose logs -f app

# Logs del contenedor de la base de datos
docker-compose logs -f db
Detener los contenedores
Para detener los contenedores de la aplicación y la base de datos:

bash
Copiar código
docker-compose down
Reconstruir la imagen
Si haces cambios en el código o en las configuraciones, reconstruye la imagen con:

bash
Copiar código
docker-compose up --build -d