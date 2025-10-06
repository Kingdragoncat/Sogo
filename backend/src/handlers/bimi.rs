use axum::{extract::Path, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Serialize, Deserialize)]
pub struct BimiResponse {
    pub domain: String,
    pub logo_url: Option<String>,
    pub verified: bool,
}

/// Fetch BIMI (Brand Indicators for Message Identification) logo for a domain
/// BIMI record is a DNS TXT record at default._bimi.{domain}
pub async fn get_bimi_logo(
    Path(domain): Path<String>,
) -> Result<Json<BimiResponse>, StatusCode> {
    match fetch_bimi_record(&domain).await {
        Ok(logo_url) => Ok(Json(BimiResponse {
            domain: domain.clone(),
            logo_url: Some(logo_url),
            verified: true,
        })),
        Err(_) => Ok(Json(BimiResponse {
            domain,
            logo_url: None,
            verified: false,
        })),
    }
}

/// Query DNS for BIMI TXT record
async fn fetch_bimi_record(domain: &str) -> Result<String, Box<dyn std::error::Error>> {
    let bimi_record = format!("default._bimi.{}", domain);

    // Use nslookup or dig to query DNS TXT record
    #[cfg(target_os = "windows")]
    let output = Command::new("nslookup")
        .args(["-type=TXT", &bimi_record])
        .output()?;

    #[cfg(not(target_os = "windows"))]
    let output = Command::new("dig")
        .args(["+short", "TXT", &bimi_record])
        .output()?;

    let result = String::from_utf8_lossy(&output.stdout);

    // Parse BIMI record format: v=BIMI1; l=https://example.com/logo.svg
    if let Some(logo_line) = result.lines().find(|line| line.contains("l=")) {
        if let Some(url_start) = logo_line.find("l=") {
            let url_part = &logo_line[url_start + 2..];
            if let Some(url_end) = url_part.find(';').or_else(|| url_part.find('"')) {
                let logo_url = url_part[..url_end].trim().to_string();
                return Ok(logo_url);
            } else {
                return Ok(url_part.trim().trim_matches('"').to_string());
            }
        }
    }

    Err("No BIMI record found".into())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_bimi_parsing() {
        // Test with known BIMI domains
        // Most companies don't have BIMI yet, but you can test with:
        // - paypal.com
        // - linkedin.com
        // - verizon.com
    }
}
