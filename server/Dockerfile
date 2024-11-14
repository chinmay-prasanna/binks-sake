FROM python:3.10.12
ENV PYTHONUNBUFFERRED 1
RUN mkdir /code

COPY server/requirements.txt /code/

WORKDIR /code
RUN pip install -U pip && \
    pip install -r requirements.txt

COPY /server/ /code/
CMD alembic upgrade head \
        && uvicorn main:app --host 0.0.0.0

