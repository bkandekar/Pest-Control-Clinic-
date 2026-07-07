package com.example

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
  @SuppressLint("SetJavaScriptEnabled")
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
          AndroidView(
            factory = { context ->
              WebView(context).apply {
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.allowFileAccess = true
                settings.allowContentAccess = true
                settings.cacheMode = android.webkit.WebSettings.LOAD_NO_CACHE
                clearCache(true)
                
                webViewClient = object : WebViewClient() {
                  override fun shouldOverrideUrlLoading(
                    view: WebView?,
                    request: WebResourceRequest?
                  ): Boolean {
                    val url = request?.url?.toString() ?: return false
                    // Handle telephone and whatsapp links externally
                    if (url.startsWith("tel:") || url.startsWith("whatsapp:") || url.contains("wa.me")) {
                      try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        context.startActivity(intent)
                        return true
                      } catch (e: Exception) {
                        // Fail silently if app not installed or protocol not supported
                      }
                    }
                    return false
                  }
                }
                loadUrl("file:///android_asset/index.html")
              }
            },
            modifier = Modifier
              .fillMaxSize()
              .padding(innerPadding)
          )
        }
      }
    }
  }
}

