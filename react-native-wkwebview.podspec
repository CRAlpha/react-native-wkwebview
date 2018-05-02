require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-wkwebview"
  s.version      = package["version"]
  s.summary      = "React Native WKWebView for iOS"
  s.author       = "Ruoyu Sun <ruoysun@gmail.com> (https://github.com/insraq)"

  s.homepage     = "https://github.com/CRAlpha/react-native-wkwebview"

  s.license      = "MIT"
  s.platform     = :ios, "8.0"

  s.source       = { :git => "https://github.com/CRAlpha/react-native-wkwebview.git", :tag => "v#{s.version}" }

  s.source_files  = "ios/RCTWKWebView/*.{h,m}"

  s.dependency "React"
end
