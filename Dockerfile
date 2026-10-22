FROM python:3.10-slim

WORKDIR /app

# FFmpeg install karein (video/audio merge ke liye zaroori)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Pehle dependencies install karein
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Phir baaki saara code copy karein
COPY . .

EXPOSE 8080

# App ko start karein
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
