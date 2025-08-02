# Use lightweight Python image
FROM python:3.11-alpine

# Set working directory
WORKDIR /docs

# Install MkDocs dependencies (lightweight versions)
RUN pip install --no-cache-dir mkdocs mkdocs-material

# Copy documentation files
COPY . .

# Expose port
EXPOSE 8000

# Run MkDocs development server
CMD ["mkdocs", "serve", "--dev-addr=0.0.0.0:8000"] 