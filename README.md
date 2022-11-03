
# Team management system
Let's say there is a tournament for a game. Teams participate in the tournament.\
Players can join teams.\
There are managers who run games and look after players and teams.\
Managers approve or reject players' requests and have some functionality to manage teams and players.\
There are also administrators who approve managers' requests and also have some functionality to manage users.

1. User account functionality:
1.1 Registering the user account;\
1.2 Logging in the user account;\
1.3 Logging out of the user account;\
1.4 User password recovery(enter email to reset password);\
1.5 Changing the user password;\
1.7 Displaying the user information;\
1.6 Changing the user information.
 
2. Admin functionality:
2.1 Show list of admins/managers/players;\
2.2 Show one admin/manager/player by ID;\
2.3 Ban manager/player by ID;\
2.4 Unban manager/player by ID;\
2.5 Show list of requests managers/players;\
2.6 Show one request by ID manager/player;\
2.7 Answer to manager's/player's request;\
2.8 Show list of teams;\
2.9 Show team information by ID;\
2.10 Delete manager/player from team.

3. Manager functionality:
3.1 Show list of admins/managers/players;\
3.2 Show one admin/manager/player by ID;\
3.3 Show list of requests players;\
3.4 Show one request by player's ID;\
3.5 Create own new request;\
3.6 Cancel own request by ID;\
3.7 Show list of own requests;\
3.8 Show own request by ID;\
3.9 Answer to player's request;\
3.10 Show list of teams;\
3.11 Show team information by ID;\
3.12 Delete player from team.

4. Player functionality:
4.1 Show list of admins/managers/players;\
4.2 Show one admin/manager/player by ID;\
4.3 Create own new request;\
4.4 Cancel own request by ID;\
4.5 Show list of own requests;\
4.6 Show own request by ID;\
4.7 Show list of teams;\
4.8 Show team information by ID.


## Tech Stack

**Server:** JavaScript, Typescript, Node.js(v16.16.0), Express.js(v4.17.2), PostgreSQL, Sequelize(v6.21.3), sequelize-typescript

**Test:** Postman, Jest(v28.1.2)


## Installation

1. Clone the repo:

```bash
git clone https://github.com/DarkL0rdd/node-database-game
```

2. Go to the project directory:
```bash
cd node-database-game
```

3. Install NPM packages:
```bash
npm install
```
4. Create .env file (see .env.example or Environment Variables).

5. Start the server:
```bash
npm run dev
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:
`SERVER_PORT=`

`SERVER_PORT_DB=`

`DB_DIALECT=`

`DB_USER=`

`DB_NAME=`

`DB_PASS=`

`DB_HOST=`

`ACCESS_SECRET_KEY=`

`REFRESH_SECRET_KEY=`
## Postman usage

1. Import the file `node-game.postman_collection.json` in Postman. 
2. Change the port and localhost to yours.
## API Reference (Postman)
Some functionality can be applied to more than one role(admin/manager/player). 

For example: an administrator/manager/player can view a list of teams. 
The administrator/manager can remove a player from the team. Etc.
### 1. User account functionality:
- #### Register:
```http
  POST /user/register
```
| Parameter     | Type     | Description                         |
| :------------ | :------- | :---------------------------------- |
| `first_name`  | `string` | **Required**. User's first name.    |
| `second_name` | `string` | **Required**. User's second name.   |
| `email`       | `string` | **Required**. User's email.         |
| `password`    | `string` | **Required**. User's password.      |

- #### Login:
```http
  POST /user/login
```
| Parameter  | Type     | Description                      |
| :--------  | :------- | :------------------------------- |
| `email`    | `string` | **Required**. User's email.      |
| `password` | `string` | **Required**. User's password.   |

- #### Logout:
```http
  POST /user/logout
```
| Parameter  | Type     | Description                      |
| :--------  | :------- | :------------------------------- |

- #### Forgot pass:
```http
  POST /user/forgot-password
```
| Parameter  | Type     | Description                      |
| :--------  | :------- | :------------------------------- |
| `email`    | `string` | **Required**. User's email.      |

- #### Reset pass:
```http
  POST /user/reset-password
```
| Parameter  | Type     | Description                      |
| :--------  | :------- | :------------------------------- |
| `password` | `string` | **Required**. User's password.   |

- #### Show user-profile-info:
```http
  GET /user/profile
```

- #### Change user-profile-info:
```http
  GET /user/profile/change-info
```
| Parameter     | Type     | Description                         |
| :------------ | :------- | :---------------------------------- |
| `first_name`  | `string` | **Required**. User's first name.    |
| `second_name` | `string` | **Required**. User's second name.   |
| `email`       | `string` | **Required**. User's email.         |
| `password`    | `string` | **Required**. User's password.      |

### 2. Admin functionality:
- #### Show list of admins/managers/players:
```http
  GET /user/list-users?role=
```
| Parameter     | Type     | Description                         |
| :------------ | :------- | :---------------------------------- |
| `role`        | `string` | **Required**. Role type.            |

- #### Show one admin/manager/player by ID:
```http
  GET /user/list-users/:id
```
| Parameter     | Type     | Description                           |
| :------------ | :------- | :------------------------------------ |
| `id`          | `string` | **Required**. ID of the desired user. |

- #### Ban manager/player by ID:
```http
  POST /user/list-users/:id/ban
```
| Parameter     | Type     | Description                           |
| :------------ | :------- | :------------------------------------ |
| `id`          | `string` | **Required**. ID of the desired user. |

- #### Unban manager/player by ID:
```http
  POST /user/list-users/:id/unban
```
| Parameter     | Type     | Description                           |
| :------------ | :------- | :------------------------------------ |
| `id`          | `string` | **Required**. ID of the desired user. |

- #### Show list of requests managers/players:
```http
  GET /request/list-requests
```

- #### Show one requests by ID manager/player:
```http
  GET /request/list-requests/:id
```

- #### Answer to request:
```http
  POST /request/list-requests/answer-request/:id
```
| Parameter     | Type     | Description                                 |
| :------------ | :------- | :------------------------------------------ |
| `id`          | `string` | **Required**. ID of the desired request(!). |
| `answer`      | `string` |   |

- #### Show list of teams:
```http
  GET /teams/list-teams
```

- #### Show team information by ID:
```http
  GET /teams/list-teams/:id
```
| Parameter     | Type     | Description                                 |
| :------------ | :------- | :------------------------------------------ |
| `id`          | `string` | **Required**. ID of the desired team.       |

- #### Delete player from team:
```http
  POST /teams/list-teams/delete-from-team/:id
```
| Parameter     | Type     | Description                                 |
| :------------ | :------- | :------------------------------------------ |
| `id`          | `string` | **Required**. ID of the desired team.       |
| `player_id`   | `string` | **Required**. ID of the desired player.     |

### 3. Manager functionality:


### 4. Player functionality:
- #### Show list of admins/managers/players:
```http
  GET /user/list-users?role=
```
| Parameter     | Type     | Description                         |
| :------------ | :------- | :---------------------------------- |
| `role`        | `string` | **Required**. Role type.            |

- #### Show one admin/manager/player by ID:
```http
  GET /user/list-users/:id
```
| Parameter     | Type     | Description                           |
| :------------ | :------- | :------------------------------------ |
| `id`          | `string` | **Required**. ID of the desired user. |

- #### Create own new request:
```http
  POST /request/my-list-requests/new-request
```
| Parameter      | Type     | Description                           |
| :------------- | :------- | :------------------------------------ |
| `request_type` | `string` | **Required**. Type of request.        |
| `description`  | `string` | **Optional**. Description of request. |
| `team_name`    | `string` | **Optional**. ID of the desired user. |

- #### Cancel own request by ID:
```http
  POST /request/my-list-requests/cancel-request/:id
```

- #### Show list of own requests:
```http
  GET /request/my-list-requests
```

- #### Show own request by ID:
```http
  GET /request/my-list-requests/:id
```
| Parameter     | Type     | Description                           |
| :------------ | :------- | :------------------------------------ |
| `id`          | `string` | **Required**. ID of the desired user. |

- #### Show list of teams:
```http
  GET /teams/list-teams
```

- #### Show team information by ID:
```http
  GET /teams/list-teams/:id
```
| Parameter     | Type     | Description                                 |
| :------------ | :------- | :------------------------------------------ |
| `id`          | `string` | **Required**. ID of the desired team.       |

## Future changes
1. Create a table of reasons for blocking users.
2. Change/update routes to work correctly in Postman.
3. Change/update db migrations
4. Update "API Reference" in README. 

In the future, README file will be supplemented or rewritten as additional changes appear.