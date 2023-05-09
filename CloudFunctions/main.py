import os
import json
import requests
from google.cloud import storage, bigquery

def download_dataset(url):
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def extract_columns(data, columns):
    extracted_data = []
    for feature in data["features"]:
        row = {column: feature["properties"].get(column) for column in columns}
        extracted_data.append(row)
    return extracted_data

def upload_to_bucket(bucket_name, file_name, data):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(file_name)
    blob.upload_from_string(json.dumps(data), content_type="application/json")

def load_data_to_bigquery(dataset_id, table_id, bucket_name, file_name):
    bigquery_client = bigquery.Client()
    dataset_ref = bigquery_client.dataset(dataset_id)
    table_ref = dataset_ref.table(table_id)
    job_config = bigquery.LoadJobConfig()
    job_config.source_format = bigquery.SourceFormat.NEWLINE_DELIMITED_JSON
    job_config.autodetect = True

    uri = f"gs://{bucket_name}/{file_name}"
    load_job = bigquery_client.load_table_from_uri(uri, table_ref, job_config=job_config)
    load_job.result()

def process_dataset(request):
    url = "https://phl.carto.com/api/v2/sql?filename=opa_properties_public&format=geojson&skipfields=cartodb_id&q=SELECT+*+FROM+opa_properties_public"
    bucket_name = os.environ["BUCKET_NAME"]
    dataset_id = os.environ["BIGQUERY_DATASET_ID"]
    table_id = os.environ["BIGQUERY_TABLE_ID"]




    # Download and extract the data
    dataset = download_dataset(url)
    columns_to_extract = ["parcel_number", "market_value"]
    extracted_data = extract_columns(dataset, columns_to_extract)

    # Upload the data to the bucket
    file_name = "processed_data.json"
    upload_to_bucket(bucket_name, file_name, extracted_data)

    # Load the data into BigQuery
    load_data_to_bigquery(dataset_id, table_id, bucket_name, file_name)

    return "Data processed and loaded into BigQuery", 200
