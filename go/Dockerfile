# Specify the base image for the go app.
FROM golang:1.21.6


# Set the working directory inside the container
WORKDIR /app

# Copy the go.mod and go.sum files to the container
COPY go.mod ./
COPY go.sum* ./
# Download dependencies
RUN go mod download

# Copy the rest of the application code
COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o app

EXPOSE 3000

#starts the application, but waits for the database to be up and running
CMD ["./wait-for-it.sh", "postgres:5432", "--", "./app"]
