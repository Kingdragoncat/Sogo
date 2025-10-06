mod config;
mod handlers;
mod mailcow;
mod models;
mod services;

use axum::{
    routing::{delete, get, patch, post},
    Router,
};
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::config::AppState;

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "mythofy_mail_backend=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load configuration
    dotenvy::dotenv().ok();
    let config = config::Config::from_env();

    // Initialize app state
    let state = Arc::new(AppState::new(config).await);

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any)
        .allow_credentials(true);

    // Build router
    let app = Router::new()
        .route("/api/health", get(handlers::health))
        .route("/api/auth/login", post(handlers::auth::login))
        .route("/api/auth/logout", post(handlers::auth::logout))
        .route("/api/emails/:folder", get(handlers::emails::list_emails))
        .route("/api/emails/:id", delete(handlers::emails::delete_email))
        .route("/api/emails/:id/read", patch(handlers::emails::mark_read))
        .route("/api/emails/:id/star", patch(handlers::emails::star_email))
        .route("/api/emails/send", post(handlers::emails::send_email))
        .route("/api/emails/search", get(handlers::emails::search_emails))
        .route("/api/bimi/:domain", get(handlers::bimi::get_bimi_logo))
        .layer(cors)
        .with_state(state);

    // Start server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080")
        .await
        .unwrap();

    tracing::info!("Mythofy Mail Backend listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, app).await.unwrap();
}
