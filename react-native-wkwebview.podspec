require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-wkwebview"
  s.version      = package["version"]
  s.summary      = "React Native WKWebView for iOS and macOS"
  s.author       = "Ruoyu Sun <ruoysun@gmail.com> (https://github.com/insraq)"

  s.homepage     = "https://github.com/CRAlpha/react-native-wkwebview"

  s.license      = "MIT"
  s.ios.deployment_target = "8.0"
  s.osx.deployment_target = "10.10"

  s.source       = { :git => "https://github.com/CRAlpha/react-native-wkwebview.git", :tag => "v#{s.version}" }

  s.ios.source_files   = "ios/RCTWKWebView/*.{h,m}"
  s.osx.source_files   = "macos/RCTWKWebView/*.{h,m}"

  s.dependency "React"
end
