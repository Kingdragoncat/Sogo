use redis::aio::ConnectionManager;
use sqlx::MySqlPool;
use std::env;

#[derive(Clone)]
pub struct Config {
    pub mailcow_api_url: String,
    pub mailcow_api_key: String,
    pub imap_host: String,
    pub imap_port: u16,
    pub smtp_host: String,
    pub smtp_port: u16,
    pub redis_url: String,
    pub database_url: String,
    pub jwt_secret: String,
}

impl Config {
    pub fn from_env() -> Self {
        Self {
            mailcow_api_url: env::var("MAILCOW_API_URL")
                .unwrap_or_else(|_| "https://mail.mythofy.net".to_string()),
            mailcow_api_key: env::var("MAILCOW_API_KEY")
                .expect("MAILCOW_API_KEY must be set"),
            imap_host: env::var("IMAP_HOST")
                .unwrap_or_else(|_| "mail.mythofy.net".to_string()),
            imap_port: env::var("IMAP_PORT")
                .unwrap_or_else(|_| "993".to_string())
                .parse()
                .unwrap_or(993),
            smtp_host: env::var("SMTP_HOST")
                .unwrap_or_else(|_| "mail.mythofy.net".to_string()),
            smtp_port: env::var("SMTP_PORT")
                .unwrap_or_else(|_| "587".to_string())
                .parse()
                .unwrap_or(587),
            redis_url: env::var("REDIS_URL")
                .unwrap_or_else(|_| "redis://127.0.0.1".to_string()),
            database_url: env::var("DATABASE_URL")
                .expect("DATABASE_URL must be set"),
            jwt_secret: env::var("JWT_SECRET")
                .unwrap_or_else(|_| "change-me-in-production".to_string()),
        }
    }
}

pub struct AppState {
    pub config: Config,
    pub redis: ConnectionManager,
    pub db: MySqlPool,
}

impl AppState {
    pub async fn new(config: Config) -> Self {
        // Initialize Redis
        let client = redis::Client::open(config.redis_url.clone())
            .expect("Failed to create Redis client");
        let redis = ConnectionManager::new(client)
            .await
            .expect("Failed to connect to Redis");

        // Initialize MySQL
        let db = MySqlPool::connect(&config.database_url)
            .await
            .expect("Failed to connect to MySQL");

        Self { config, redis, db }
    }
}
