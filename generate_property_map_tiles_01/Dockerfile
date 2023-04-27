# This Dockerfile is a mix of two documentation sources:
# https://cloud.google.com/run/docs/quickstarts/jobs/build-create-shell#writing
# https://cloud.google.com/run/docs/tutorials/gcloud#code-container

# ----------

# Use a gcloud image based on debian:buster-slim for a lean production container.
# https://docs.docker.com/develop/develop-images/multistage-build/#use-multi-stage-builds
FROM gcr.io/google.com/cloudsdktool/cloud-sdk:slim

RUN apt-get update

# Install GDAL for ogr2ogr
RUN apt-get install -y gdal-bin

# Execute next commands in the directory /workspace
WORKDIR /workspace

# Copy over the script to the /workspace directory
COPY script_01.sh .

# Just in case the script doesn't have the executable bit set
RUN chmod +x ./script_01.sh

# Run the script when starting the container
CMD [ "./script_01.sh" ]