FROM python:3.10-slim

WORKDIR /app

# Wasmer proxy ko bypass karne ke liye (Sabse Aham Fix)
ENV NO_PROXY=*
ENV no_proxy=*
ENV PYTHONHTTPSVERIFY=0

# FFmpeg install karein (Video/Audio merge ke liye zaroori)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
