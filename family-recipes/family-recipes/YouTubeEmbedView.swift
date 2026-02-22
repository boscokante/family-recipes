import SwiftUI
import WebKit

struct YouTubeEmbedView: UIViewRepresentable {
    let youtubeURL: String

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.scrollView.isScrollEnabled = false
        webView.backgroundColor = .clear
        webView.isOpaque = false
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        guard let videoID = extractYouTubeID(from: youtubeURL) else { return }
        let embedURL = "https://www.youtube.com/embed/\(videoID)"
        let html = """
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; background-color: transparent; }
            iframe { width: 100%; height: 100%; border: 0; border-radius: 12px; }
          </style>
        </head>
        <body>
          <iframe src="\(embedURL)" allowfullscreen></iframe>
        </body>
        </html>
        """
        webView.loadHTMLString(html, baseURL: nil)
    }

    private func extractYouTubeID(from url: String) -> String? {
        let patterns = [
            "youtube\\.com/watch\\?v=([^&]+)",
            "youtu\\.be/([^?&]+)",
            "youtube\\.com/embed/([^?&]+)"
        ]
        for pattern in patterns {
            if let regex = try? NSRegularExpression(pattern: pattern),
               let match = regex.firstMatch(in: url, range: NSRange(location: 0, length: url.utf16.count)),
               let range = Range(match.range(at: 1), in: url) {
                return String(url[range])
            }
        }
        return nil
    }
}
