# MovieHub

## Introduction
   MovieHub is a web application built with Django that allows users to explore a wide variety of movies and manage information about movies, actors, producers, and genres. MovieHub also lets users save their favourite movies. 

The website allows different types of users with different permissions. We can also navigate the website without an account, and temporarily save our favourite movies.

# Important Notes

The css isn't done by component because we reused the first's project css, therefore it's all located in one file as before.

## Funcionality through UI

- Add/Edit/Delete Movie
- Add/Edit/Delete Actor
- Add/Edit/Delete Producer
- Add/Delete Genre
- Create new Users
- Delete Users
- See other users' favourites
- Favourite movies (logged or not, using Django sessions)

## How to run and acess the App

### Deployed at:

The app is deployed at [MovieHub](https://movieshubapp.pythonanywhere.com/)

### For running locally:

```bash
# Skip if django and pillow
# are installed alredy
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Then simple run:
./run
```

Note: the ./run executes the migrations and runserver, so no need to do it manually

## Created Users

`username:password`

- admin:admin (has all permissions)
- user:user (has no permissions, can only view)
- crew_manager:crew_manager (Movie/Genre permissions)
- movie_manager:movie_manager (Actor/Producer permissions)


## Entities

- Actor
- Movie
- Producer
- Genre

## What we used?

From the pratical classes:

- [x] Authentication
- [x] Django Forms (with Meta Class)
- [x] Django Groups and Permissions
- [x] Session
- [x] Other normal functions like the templates, etc...

From our own learning:

- [x] Image upload using Pillow library
- [x] Using Django Messages to display alerts (ex: Movie added!)
- [x] We created a personalized decorator that allowed us to redirect users if they did not have a certain permission

## Conclusion
   In developing MovieHub, we used Django's framework to create a functional movie platform, and along the way, we put into practice all of the key concepts from our practical classes.
   
   We worked with Django Forms, Groups, Permissions, Authentication and user Sessions, which really deepened our learning experience. We also added some more advanced features like custom decorators, file uploads with Pillow, and Django messages all to make the platform more user-friendly and intuitive.
   
   Overall, MovieHub reflects both our technical skills and our grasp of web development fundamentals. 
   
   
   
## Team Members
| Nmec   | Name              | Github                                                |
| ------ | ----------------- | ----------------------------------------------------- |
| 113780 | João Varela       | [varela](https://github.com/joaovarela14)                      |
| 114137 | Diogo Fernandes   | [diogux](https://github.com/diogux)                   |
| 114622 | António Alberto   | [antonio](https://github.com/antoniocsh)              |

