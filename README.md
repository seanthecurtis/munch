# Munch Task Manager API - Interview assessment

## Prerequisites
- Node.js
- NPM
- Docker
- Docker Compose

## Application folder structure

├── __tests__/
│  ├── __mocks__/
│  │  ├── controllers/
│  │  │ ├── helpers.ts         # Mocks for middleware   
│  │  │ ├── services.ts        # Mocks for services
│  ├── database/               
│  │  ├── sequelize.ts         # Functions to help with test database connection
│  ├── helpers/                # Functions to help with test setup
│  │  ├── config.ts            # Load test config env variables
│  ├── postman/                # Postman collection files
│  ├── tests/                  # Unit tests
│  │  ├── handlers/            # Handler units tests(work in progress)
│  │  │ ├── auth.ts            
│  │  │ ├── task.ts            
│  │  ├── services/             
│  │  │ ├── testdb.ts          # Tests all services against a test db connection
├── src/
│  ├── database/               
│  │  ├── sequelize.ts         # Functions to help with test database connection
│  ├── handlers/               # Business logic
│  │  ├── authHandler.ts        
│  │  ├── taskHandler.ts        
│  │  ├── userHandler.ts        
│  ├── helpers/                # Middleware functions
│  │  ├── auth.ts              # Auth related middleware
│  │  ├── config.ts            # Load env variables
│  │  ├── errorHandler.ts      # Custom error handling functions
│  ├── models/                 # Database models
│  │  ├── labels.ts             
│  │  ├── task.ts               
│  │  ├── taskLabels.ts         
│  │  ├── user.ts               
│  ├── routes/                 # API routes definitions
│  │  ├── authRoutes.ts             
│  │  ├── router.ts            # Sets up all routes  
│  │  ├── taskRoutes.ts         
│  │  ├── userRoutes.ts               
│  ├── schemas/                
│  │  ├──schema.ts             # Schemas for payload validation
│  ├── services/               # Service layer functions to do database interaction
│  │  ├── authService.ts             
│  │  ├── labelService.ts             
│  │  ├── taskLabelService.ts             
│  │  ├── taskService.ts             
│  │  ├── userService.ts             
│  ├── types/                  # Custom types and interfaces for typescript
│  │  ├── default.d.ts          
│  │  ├── interfaces.d.ts        
│  ├── index.ts                # Main application file
├── swagger/
│  ├── swagger.yaml            # Swagger docs defintion (work in progress)
├── .dockerignore              
├── .env                       # Dev env variables
├── .env.test                  # Env variables for jest tests
├── .eslintrc.json             # Lint configuration
├── .gitignore                 
├── docker-compose.yml         
├── Dockerfile                 
├── jest.config.json           # Jest test setup
├── package.json               
├── README.md                  
└── tsconfig.json              # Typescript setup

### Installation

1. Set up local env
  `npm run setup`
2. Start the server
  a. Using nodemon
    `npm run start:dev`
  b. Using docker
    `npm run start:docker`
3. Run unit tests
  `npm run test`
4. Bring down the docker containers
  a. With removing data 
    `docker-compose down -v`
  b. Keep database data
    `docker-compose down`

## Notes

ERD diagram provided in the notes folder as well as a list of resources I came across to aid in the development of the api.

## Enhancements

1. Keep an audit trail of events that happen to a task, example assigning to another user, store the user assigned from and too. Return the history of events with a task to provide more context of the tasks movements.
2. Move all secret keys to a secure store to be injected on deployment. Rather than in the repo.
3. Add more tests to cover more of the codebase. I have added "collectCoverage: true" to the jest config to show the coverage of the codebase.
4. Write a script to generate the swagger docs from the code. Very tedious task to create, so I asked our wonderful neighbourhood chatgpt to generate it for me :D
5. Set up partitioning for tables that will grow indefinitely, like the tasks table
6. Archive data like tasks that are in a certain state for a certain time period - no longer of use. And eventually put into long storage of required, for tasks its probably not required. 
7. Move authentication out to its own service so it can be reused by other applications - I originally wanted to do this and build the other apis to integrate with it as well but decided to leave that for a later date.