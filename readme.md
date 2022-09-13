# Meetup-api-microserveces

To start application you will need docker

Firstly build docker image by command

```
$ docker-compose build
```

Secondly start container (you need minimum 10gb RAM)

```
$ docker-compose up
```

Now we need to signup. To do this you will need send request to this url:

```
http://localhost:3000/auth/registration
```

with this fields in body

-   name: string
-   surname
-   email
-   password
-   telephone
-   avatar (base64 encode) - optional field

```
{
    "name": "Klrushka",
    "surname": "Klrushkovich",
    "email": "momeji1272@iunicus.com",
    "password": "12345",
    "telephone": "+375293567481",
    "avatar": "/9j/4AAQSkZJRgABAQEAYABgAAD/4RDkRXhpZgAAT..."
}
```

By response you will get message:

```
{
    "message": "check your email and verify it"
}
```

![](images/mailVerification1.jpg)
![](images/mailVerification2.jpg)
![](images/mailVerification3.jpg)

After signup we need to signin. Todo this you will need send request to this url:

```
http://localhost:3000/auth/login/
```

with this fields in body:

- email
- password

```
{
    "email": "momeji1272@iunicus.com",
    "password" : "12345"
}
```
By response you will get message:

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMWY1NTU1ODU4NTUzNjM4NWVjMzgyNCIsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNjYyOTk4NzU5LCJleHAiOjE2NjMwODUxNTl9.L59792IkWsLTryhZlpnzi4hSBD4IhJUJJe34Xs_K7KQ"
}
```
![](images/login.jpg)

You can enter to the system with google. Todo this you will need send request to this url:
```
http://localhost:3000/auth/google
```
and choose account, after that you will get token

![](images/googleLogin.jpg)

Okay, It's all about authentification.

# Meetups

### GET requests

```
http://localhost:3001/meetups
```
Get all meetups
![](images/getAllMeetups.jpg)
<hr>

```
http://localhost:3001/meetups?
```