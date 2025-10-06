pub mod auth;
pub mod emails;
pub mod bimi;

use axum::{http::StatusCode, Json};
use serde_json::{json, Value};

pub async fn health() -> (StatusCode, Json<Value>) {
    (StatusCode::OK, Json(json!({ "status": "healthy" })))
}
