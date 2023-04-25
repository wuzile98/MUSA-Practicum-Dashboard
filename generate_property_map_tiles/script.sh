#!/usr/bin/env bash
set -ex

# Download the property_tile_info.geojson file from the temp bucket.
gcloud storage cp \
  gs://wzl_data_lake/phl_opa_properties/parcel_with_counts_trim.geojson \
  ./property_tile_info.geojson
  

# Convert the geojson file to a vector tileset in a folder named "properties".
# The tile set will be in the range of zoom levels 12-18. See the ogr2ogr docs
# at https://gdal.org/drivers/vector/mvt.html for more information.
ogr2ogr \
  -f MVT \
  -dsco MINZOOM=15 \
  -dsco MAXZOOM=19 \
  -dsco COMPRESS=NO \
  ./properties \
  ./property_tile_info.geojson

# Upload the vector tileset to the public bucket.
gcloud storage cp \
  --recursive \
  ./properties \
  gs://wzl_data_lake/tiles