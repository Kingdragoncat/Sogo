use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Email {
    pub id: String,
    pub from: String,
    pub to: Vec<String>,
    pub subject: String,
    pub preview: String,
    pub body: Option<String>,
    pub date: DateTime<Utc>,
    pub unread: bool,
    pub starred: bool,
    pub folder: String,
    pub has_attachments: bool,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub token: String,
    pub user: User,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: String,
    pub email: String,
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct SendEmailRequest {
    pub to: Vec<String>,
    pub subject: String,
    pub body: String,
    pub cc: Option<Vec<String>>,
    pub bcc: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
pub struct MarkReadRequest {
    pub read: bool,
}

#[derive(Debug, Deserialize)]
pub struct StarEmailRequest {
    pub starred: bool,
}

#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            error: None,
        }
    }

    pub fn error(message: String) -> Self {
        Self {
            success: false,
            data: None,
            error: Some(message),
        }
    }
}
