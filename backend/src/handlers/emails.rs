use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use std::sync::Arc;
use serde::Deserialize;

use crate::{
    config::AppState,
    models::{ApiResponse, Email, MarkReadRequest, SendEmailRequest, StarEmailRequest},
    services::email::{fetch_folder_emails, send_email_via_smtp},
};

#[derive(Deserialize)]
pub struct SearchQuery {
    q: String,
}

pub async fn list_emails(
    State(state): State<Arc<AppState>>,
    Path(folder): Path<String>,
) -> Result<Json<Vec<Email>>, StatusCode> {
    match fetch_folder_emails(&state, &folder).await {
        Ok(emails) => Ok(Json(emails)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn delete_email(
    State(_state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Json<ApiResponse<String>>, StatusCode> {
    // Implement email deletion via IMAP
    tracing::info!("Deleting email: {}", id);
    Ok(Json(ApiResponse::success(id)))
}

pub async fn mark_read(
    State(_state): State<Arc<AppState>>,
    Path(id): Path<String>,
    Json(payload): Json<MarkReadRequest>,
) -> Result<Json<ApiResponse<String>>, StatusCode> {
    // Implement mark as read via IMAP
    tracing::info!("Marking email {} as read: {}", id, payload.read);
    Ok(Json(ApiResponse::success(id)))
}

pub async fn star_email(
    State(_state): State<Arc<AppState>>,
    Path(id): Path<String>,
    Json(payload): Json<StarEmailRequest>,
) -> Result<Json<ApiResponse<String>>, StatusCode> {
    // Implement star via IMAP
    tracing::info!("Starring email {}: {}", id, payload.starred);
    Ok(Json(ApiResponse::success(id)))
}

pub async fn send_email(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<SendEmailRequest>,
) -> Result<Json<ApiResponse<String>>, StatusCode> {
    match send_email_via_smtp(&state, payload).await {
        Ok(id) => Ok(Json(ApiResponse::success(id))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn search_emails(
    State(state): State<Arc<AppState>>,
    Query(query): Query<SearchQuery>,
) -> Result<Json<Vec<Email>>, StatusCode> {
    // Implement search across all folders
    tracing::info!("Searching for: {}", query.q);
    list_emails(State(state), Path("inbox".to_string())).await
}
