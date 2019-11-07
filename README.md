## BOS.EATS Back End API
This single page application allows users to upload their favorite Boston foodie pictures to a public gallery. Users can also view others’ uploads. The owner of the picture can update the description, replace the picture, or delete it.

### Planning, process and problem-solving strategy
To start building the back end API, we first reviewed the lessons and referred to the class code-along. Our first approach when creating the back end, was to focus on create and show images. After completing both CRUD actions, we tested them via Postman to make sure they were functioning properly. For the next steps, we tested the update and delete actions. After assuring all the CRUD actions were functional, we moved on creating the heroku application as well as added the AWS credentials. During the development process, one of the challenges we faced consisted of updating an image. To overcome those challenges we worked together as a team, looked for additional resources to help with solving any issue we encountered.

### Unsolved Problems
For future versions of the API, we want to add a limit for the file size of user uploads. We also each want to deploy our individual back end applications with our own Heroku apps and AWS credentials.

#### API Routes and Path
| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| DELETE | `/sign-out`            | `users#signout`   |
| PATCH  | `/change-password`     | `users#changepw`  |
| POST   | `/images-create`               | `images#create`    |
| GET    | `/images`               | `images#index`     |
| GET    | `/images/:id`           | `images#show`      |
| PATCH  | `/images/:id/edit`           | `images#update`    |
| DELETE | `/images/:id/`          | `images#delete`    |


### List of Technologies Used
- Express
- MongoDB
- JavaScript
- Heroku
- Mongoose
- Nodemon
- Node.js

### Links
- [BOS.EATS Deployed Link](https://ga-sei-05-yass.github.io/team-project-client/)
- [BOS.EATS Front End Repo](https://github.com/ga-sei-05-yass/team-project-client)
- [BOS.EATS Back End Repo](https://github.com/ga-sei-05-yass/team-project-api)
- [BOS.EATS Heroku Deployed](https://arcane-temple-01908.herokuapp.com/)



#### ERD
![ERD](https://i.imgur.com/k0MEUj7.png)
