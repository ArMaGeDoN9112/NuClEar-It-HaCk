FROM python:3.9

COPY . /app
WORKDIR /app

RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install --upgrade setuptools wheel
RUN python3 -m pip install -r requirements.txt

ENTRYPOINT ["python3", "cut_audio.py", "voice.wav"]