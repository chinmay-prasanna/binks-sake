# Bink's Sake
A self hosted service to read music from local directories and stream them to your devices anywhere

## Setup
### Docker compose setup -
```
docker compose up --build
```

### Local server setup -
Navigate into the server directory
```
pip install -r requirements.txt
uvicorn main:app --host localhost --reload
```

API docs available at localhost/docs