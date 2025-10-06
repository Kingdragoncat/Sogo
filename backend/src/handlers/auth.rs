use axum::{extract::State, http::StatusCode, Json};
use std::sync::Arc;

use crate::{
    config::AppState,
    models::{ApiResponse, LoginRequest, LoginResponse, User},
    services::auth::create_jwt,
};

pub async fn login(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<ApiResponse<LoginResponse>>, StatusCode> {
    // Authenticate with Mailcow/IMAP
    match authenticate_user(&state, &payload.email, &payload.password).await {
        Ok(user) => {
            let token = create_jwt(&state.config.jwt_secret, &user.id)
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            Ok(Json(ApiResponse::success(LoginResponse { token, user })))
        }
        Err(_) => Err(StatusCode::UNAUTHORIZED),
    }
}

pub async fn logout() -> StatusCode {
    // In a real implementation, you'd invalidate the JWT token here
    StatusCode::OK
}

async fn authenticate_user(
    state: &AppState,
    email: &str,
    password: &str,
) -> Result<User, Box<dyn std::error::Error>> {
    // Try IMAP authentication
    let imap_addr = format!("{}:{}", state.config.imap_host, state.config.imap_port);
    let tls = async_native_tls::TlsConnector::new();

    let client = async_imap::connect(imap_addr, &state.config.imap_host, tls).await?;
    let _session = client.login(email, password).await
        .map_err(|e| e.0)?;

    // Authentication successful
    Ok(User {
        id: uuid::Uuid::new_v4().to_string(),
        email: email.to_string(),
        name: email.split('@').next().unwrap_or("User").to_string(),
    })
}
