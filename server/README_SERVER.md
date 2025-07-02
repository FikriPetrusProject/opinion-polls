# {O}pinion Backend Documentation

## Endpoints

### List of available endpoints.

Public Endpoints

- `POST /register`
- `POST /login`

Endpoints that require Authentication

- `GET /polls`
- `POST /polls/manual`
- `POST /polls/ai`
- `POST /polls/:id/vote`
- `POST /polls/:id/detail`

## Responses

### `POST /register`

#### Body

```json
{
  "name": "alfikri",
  "email": "alfikri@mail.com",
  "password": "alfikri"
}
```

#### Responses

- Success - 201 Created

```json
{
  "message": "Successfully registered"
}
```

- Error

```json
{
    "message": "Email cannot be empty"
}
OR
{
    "message": "Password cannot be empty"
}
OR
{
    "message": "Invalid Email format"
}
OR
{
    "message": "Email has been taken"
}
```

### `POST /login`

#### Body

```json
{
  "email": "alfikri@example.com",
  "password": "12345"
}
```

#### Responses

- Success - 200 OK

```json
{
  "access_token": "eyJhbGciOiJIUzI1Ni.."
}
```

- Error

```json
{
  "message": "Invalid email or password"
}
```

### `GET /polls`

#### Response

```json
[
  {
    "id": 13,
    "question": "What is your opinion on American defense contractors?",
    "User_Id": 3,
    "createdAt": "2025-07-02T15:52:07.364Z",
    "updatedAt": "2025-07-02T15:52:07.364Z",
    "Options": [
      {
        "id": 45,
        "Poll_Id": 13,
        "text": "Patriotic",
        "createdAt": "2025-07-02T15:52:07.371Z",
        "updatedAt": "2025-07-02T15:52:07.371Z"
      }
    ]
  }
]
```

### `POST /polls/manual`

#### Body

```json
{
  "question": "What's is your favourite NBA team",
  "options": ["Lakers", "Pistons", "Thunders", "Pacers"]
}
```

#### Response

- Success - 201 Created

```json
{
  "message": "Poll created by user",
  "pollId": 7,
  "summary": "This poll gauges user preferences for NBA teams among Lakers, Pistons, Thunder, and Pacers fans.  Understanding these preferences may help the app better tailor content or features to users' interests.\n"
}
```

- Error

```json
{
    "message": "Unauthorized access"
}
OR
{
    "message": "Server Timeout"
}
OR
{
    "message": "Invalid input"
}
```

### `POST /polls/ai`

#### Body

```json
{
  "topic": "SnP 500 stocks",
  "choice": 2
}
```

- Success - 201 Created

```json
{
  "message": "Poll created with AI help",
  "pollId": 10,
  "question": "What is your opinion on Shanghai stock exchange best stocks?",
  "options": [
    "Tencent Holdings",
    "Alibaba Group Holding",
    "Kweichow Moutai",
    "China Construction Bank"
  ],
  "summary": "This poll gauges user opinions on the best performing stocks currently listed on the Shanghai Stock Exchange, focusing on four prominent companies: Tencent Holdings, Alibaba Group Holding, Kweichow Moutai, and China Construction Bank.  Understanding these opinions can be valuable for investors interested in the Chinese stock market and those seeking insights into popular investment choices.\n"
}
```

- Error

```json
{
    "message": "Unauthorized access"
}
OR
{
    "message": "Server Timeout"
}
OR
{
    "message": "Invalid input"
}
```

### `POST /poll/:id/vote`

#### Body

```json
{
  "optionId": 12
}
```

- Success 201 - Created

```json
{
  "message": "You have already voted on this poll"
}
```

- Error

```json
{
    "message": "You have already voted on this poll"
}
OR
{
    "message": "Poll not found"
}
OR
{
    "message": "Invalid option for this poll"
}
```

### `GET /polls/:id/details`

#### Response

```json
{
  "question": "What's your favorite programming language?",
  "options": [
    {
      "id": 1,
      "text": "JavaScript",
      "votes": 1
    },
    {
      "id": 2,
      "text": "Python",
      "votes": 1
    },
    {
      "id": 3,
      "text": "Go",
      "votes": 0
    },
    {
      "id": 4,
      "text": "Rust",
      "votes": 0
    }
  ],
  "userVoteOptionId": 2
}
```
