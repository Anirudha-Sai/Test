FROM alpine:3.19

# Install Node.js and Python
RUN apk add --no-cache nodejs python3

# Set the working directory
WORKDIR /app

# Copy the scripts into the container
COPY app.js app.py ./

# Run both scripts when the container starts
CMD ["sh", "-c", "node app.js && python3 script.py"]
